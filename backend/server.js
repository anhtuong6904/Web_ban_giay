const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const { VNPay } = require('vnpay');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const db = require('./db');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const usersRoutes = require('./Routes/users');
app.use('/api/users', usersRoutes);

const vnpayRoutes = require('./Routes/PaymentVnpay');
app.use('/api/payments', vnpayRoutes);

// backend/routes/ipn.ts
app.post('/api/payment/ipn', (req, res) => {
  try {
    const verification = vnpay.verifyIpnCall(req.body);
    
    if (verification.isSuccess) {
      // ✅ Thanh toán thành công - cập nhật database
      console.log('Payment successful:', verification.vnp_TxnRef);
      
      // Cập nhật order status trong database
      // updateOrderStatus(verification.vnp_TxnRef, 'PAID');
      
      res.status(200).json({ RspCode: '00', Message: 'success' });
    } else {
      // ❌ Thanh toán thất bại
      console.log('Payment failed:', verification.message);
      res.status(200).json({ RspCode: '01', Message: 'fail' });
    }
  } catch (error) {
    console.error('IPN processing error:', error);
    res.status(500).json({ RspCode: '99', Message: 'error' });
  }
});


// Database configuration
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || 'Giakiet@123',  // Password đúng
  server: process.env.DB_SERVER /*|| 'DESKTOP-3UR600M' || 'localhost' */|| '127.0.0.1',
  database: process.env.DB_DATABASE || 'shopgiay',  // Cập nhật tên database mới
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};
// Log config để debug (không hiển thị password)
console.log('🔌 Database config:', {
  user: config.user,
  server: config.server,
  database: config.database,
  port: config.port,
  auth: 'SQL Authentication'
});



// Test endpoint để kiểm tra server
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT 1 as test');
    await sql.close();
    res.json({ 
      message: 'Database connection successful!',
      test: result.recordset[0].test
    });
  } catch (err) {
    console.error('❌ Database connection error:', err);
    res.status(500).json({ 
      message: 'Database connection failed!',
      error: err.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    
    // Kiểm tra kết nối database
    const dbTest = await pool.request().query('SELECT 1 as test');
    
    // Kiểm tra số lượng users
    const usersCount = await pool.request().query('SELECT COUNT(*) as count FROM Users');
    
    // Kiểm tra số lượng products
    const productsCount = await pool.request().query('SELECT COUNT(*) as count FROM Products');
    
    await sql.close();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connection: 'connected',
        users: usersCount.recordset[0].count,
        products: productsCount.recordset[0].count
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      }
    });
  } catch (err) {
    console.error('❌ Health check error:', err);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: err.message
    });
  }
});

// Check Users table structure
app.get('/api/users/structure', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    
    // Get table structure
    const structure = await pool.request().query(`
      SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        CHARACTER_MAXIMUM_LENGTH,
        COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Users'
      ORDER BY ORDINAL_POSITION
    `);
    
    // Get sample data
    const sampleData = await pool.request().query('SELECT TOP 1 * FROM Users');
    
    await sql.close();
    
    res.json({
      table: 'Users',
      structure: structure.recordset,
      sampleData: sampleData.recordset[0] || null,
      totalColumns: structure.recordset.length
    });
  } catch (err) {
    console.error('❌ Error checking Users table structure:', err);
    res.status(500).json({
      error: err.message,
      details: err.stack
    });
  }
});

// Test Users table with sample insert
app.post('/api/users/test-insert', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    
    // Try to insert a test user with minimal data
    const result = await pool.request()
      .input('username', sql.VarChar(100), 'testuser')
      .input('password', sql.VarChar(255), 'testpass')
      .input('fullName', sql.NVarChar(200), 'Test User')
      .input('email', sql.VarChar(200), 'test@test.com')
      .query(`
        INSERT INTO Users (username, password, fullName, email, createdAt)
        VALUES (@username, @password, @fullName, @email, GETDATE());
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    // Delete the test user immediately
    await pool.request()
      .input('id', sql.Int, result.recordset[0].id)
      .query('DELETE FROM Users WHERE id = @id');
    
    await sql.close();
    
    res.json({
      message: 'Test insert successful - Users table structure is correct',
      testId: result.recordset[0].id
    });
  } catch (err) {
    console.error('❌ Test insert failed:', err);
    res.status(500).json({
      error: err.message,
      details: err.stack,
      message: 'Users table structure has issues'
    });
  }
});

// Ensure Orders tables exist
async function ensureOrderTables() {
  // assumes a connection is already open
  await sql.query(`
    IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Orders]') AND type in (N'U'))
    BEGIN
      CREATE TABLE [dbo].[Orders](
        [OrderID] INT IDENTITY(1,1) PRIMARY KEY,
        [CustomerName] NVARCHAR(200) NOT NULL,
        [Email] NVARCHAR(200) NULL,
        [Address] NVARCHAR(400) NULL,
        [PhoneNumber] NVARCHAR(50) NULL,
        [PaymentMethod] NVARCHAR(50) NOT NULL,
        [Status] NVARCHAR(50) NOT NULL DEFAULT 'PENDING',
        [TotalAmount] DECIMAL(18,2) NOT NULL DEFAULT 0,
        [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE()
      );
    END;

    IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OrderItems]') AND type in (N'U'))
    BEGIN
      CREATE TABLE [dbo].[OrderItems](
        [OrderItemID] INT IDENTITY(1,1) PRIMARY KEY,
        [OrderID] INT NOT NULL,
        [ProductID] INT NULL,
        [ProductName] NVARCHAR(300) NOT NULL,
        [Quantity] INT NOT NULL,
        [UnitPrice] DECIMAL(18,2) NOT NULL,
        [Image] NVARCHAR(500) NULL,
        CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
      );
    END;
  `);
}

app.post('/api/orders', async (req, res) => {
  const { recipient, items, paymentMethod = 'COD', note } = req.body || {};
  if (!recipient || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing recipient or items' });
  }

  try {
    const pool = await sql.connect(config);
    await ensureOrderTables();

    const total = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);

    // 1. Tạo order
    const insertOrder = await pool.request()
      .input('CustomerName', sql.NVarChar(200), recipient.name || '')
      .input('Email', sql.NVarChar(200), recipient.email || '')
      .input('Address', sql.NVarChar(400), recipient.address || '')
      .input('PhoneNumber', sql.NVarChar(50), recipient.phone || '')
      .input('PaymentMethod', sql.NVarChar(50), paymentMethod)
      .input('Status', sql.NVarChar(50), paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING')
      .input('TotalAmount', sql.Decimal(18, 2), total)
      .query(`
        INSERT INTO Orders (CustomerName, Email, Address, PhoneNumber, PaymentMethod, Status, TotalAmount)
        OUTPUT INSERTED.OrderID
        VALUES (@CustomerName, @Email, @Address, @PhoneNumber, @PaymentMethod, @Status, @TotalAmount)
      `);

    const orderId = insertOrder.recordset[0].OrderID;

    // 2. Lưu items
    for (const it of items) {
      await pool.request()
        .input('OrderID', sql.Int, orderId)
        .input('ProductID', sql.Int, it.productId || null)
        .input('ProductName', sql.NVarChar(300), it.name)
        .input('Quantity', sql.Int, it.quantity || 1)
        .input('UnitPrice', sql.Decimal(18, 2), it.price || 0)
        .input('Image', sql.NVarChar(500), it.image || null)
        .query(`
          INSERT INTO OrderItems (OrderID, ProductID, ProductName, Quantity, UnitPrice, Image)
          VALUES (@OrderID, @ProductID, @ProductName, @Quantity, @UnitPrice, @Image)
        `);
    }

    // 3. Nếu COD → trả về ngay
    if (paymentMethod === 'COD') {
      return res.json({ success: true, orderId, total, status: 'CONFIRMED' });
    }

    // 4. Nếu VNPay → gọi tạo payment URL
    if (paymentMethod === 'VNPay') {
      try {
        const response = await fetch(`${process.env.SERVER_URL}/api/payments/vnpay/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            orderId,
            orderInfo: `Thanh toán đơn #${orderId}`
          })
        });

        const data = await response.json();

        if (data.success) {
          // Trả về payment URL cho client
          return res.json({ success: true, orderId, total, status: 'PROCESSING', paymentUrl: data.paymentUrl });
        } else {
          return res.status(400).json({ success: false, error: data.error || 'Tạo thanh toán thất bại' });
        }
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    }

  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try { await sql.close(); } catch {}
  }
});



// Ensure Users table has all required columns
async function ensureUsersLocalColumns(pool) {
  try {
    // Add missing columns if they don't exist
    const columnsToAdd = [
      { name: 'FirebaseUID', type: 'NVARCHAR(200)', nullable: 'NULL' },
      { name: 'DisplayName', type: 'NVARCHAR(200)', nullable: 'NULL' },
      { name: 'PhotoURL', type: 'NVARCHAR(500)', nullable: 'NULL' },
      { name: 'CreatedAt', type: 'DATETIME', nullable: 'NOT NULL DEFAULT GETDATE()' },
      { name: 'UpdatedAt', type: 'DATETIME', nullable: 'NOT NULL DEFAULT GETDATE()' }
    ];

    for (const column of columnsToAdd) {
      try {
        await pool.request().query(`
          IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = '${column.name}')
          BEGIN
            ALTER TABLE Users ADD ${column.name} ${column.type} ${column.nullable === 'NOT NULL' ? 'NOT NULL' : ''} ${column.nullable === 'NOT NULL' ? 'DEFAULT GETDATE()' : ''}
          END
        `);
      } catch (addColumnError) {
        console.log(`Column ${column.name} might already exist or error:`, addColumnError.message);
      }
    }

    // Add unique index for FirebaseUID if it doesn't exist
    try {
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'IX_Users_FirebaseUID')
        BEGIN
          CREATE UNIQUE INDEX IX_Users_FirebaseUID ON Users(FirebaseUID)
        END
      `);
    } catch (indexError) {
      console.log('FirebaseUID index might already exist:', indexError.message);
    }

    // Add trigger for UpdatedAt if it doesn't exist
    try {
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[TR_Users_UpdatedAt]'))
        BEGIN
          EXEC('CREATE TRIGGER TR_Users_UpdatedAt ON Users AFTER UPDATE AS BEGIN UPDATE Users SET UpdatedAt = GETDATE() FROM Users u INNER JOIN inserted i ON u.UserID = i.UserID END')
        END
      `);
    } catch (triggerError) {
      console.log('UpdatedAt trigger might already exist:', triggerError.message);
    }

  } catch (err) {
    console.error('Error ensuring Users table columns:', err);
  }
}

// Products API with search, sort, and filters
app.get('/api/products', async (req, res) => {
  try {
    const {
      search,
      gender,
      tag,
      sortBy,
      sortOrder,
      priceMin,
      priceMax,
      discountMin,
      discountMax,
      ratingMin,
      ratingMax
    } = req.query;

    console.log('🔍 API Products called with params:', req.query);

    const pool = await sql.connect(config);
    
    // Build WHERE conditions
    const conditions = ['1=1']; // Always true condition as base
    
    // Search by name or description
    if (search) {
      const searchTerm = search.trim();
      console.log('🔍 Search term received:', searchTerm);
      if (searchTerm) {
        const searchCondition = `(Name LIKE '%${searchTerm}%' OR Description LIKE '%${searchTerm}%')`;
        conditions.push(searchCondition);
        console.log('🔍 Search condition added:', searchCondition);
      }
    }

    // Gender filter
    if (gender && gender !== 'all') {
      conditions.push(`Gender = '${gender.toUpperCase()}'`);
    }

    // Tag filter - sử dụng Gender thay vì Tag
    if (tag && tag !== 'all') {
      if (['men', 'women', 'kids', 'sports'].includes(tag.toLowerCase())) {
        const gender = tag.toUpperCase();
        conditions.push(`Gender = '${gender}'`);
      }
    }

    // Price range
    if (priceMin && !Number.isNaN(parseFloat(priceMin))) {
      conditions.push(`Price >= ${parseFloat(priceMin)}`);
    }
    if (priceMax && !Number.isNaN(parseFloat(priceMax))) {
      conditions.push(`Price <= ${parseFloat(priceMax)}`);
    }

    // Discount range
    if (discountMin && !Number.isNaN(parseFloat(discountMin))) {
      conditions.push(`ISNULL(Discount, 0) >= ${parseFloat(discountMin)}`);
    }
    if (discountMax && !Number.isNaN(parseFloat(discountMax))) {
      conditions.push(`ISNULL(Discount, 0) <= ${parseFloat(discountMax)}`);
    }

    // Rating range
    if (ratingMin && !Number.isNaN(parseFloat(ratingMin))) {
      conditions.push(`ISNULL(Rating, 0) >= ${parseFloat(ratingMin)}`);
    }
    if (ratingMax && !Number.isNaN(parseFloat(ratingMax))) {
      conditions.push(`ISNULL(Rating, 0) <= ${parseFloat(ratingMax)}`);
    }

    // Xử lý sắp xếp
    let orderBy = 'ProductID'; // Mặc định sắp xếp theo ID

    if (sortBy) {
      const sortByLower = sortBy.toLowerCase();
      const sortOrderLower = (sortOrder || 'asc').toLowerCase();

      // Validate sortBy parameter
      const allowedSortFields = ['price', 'discount', 'name', 'rating'];
      if (allowedSortFields.includes(sortByLower)) {
        let fieldName;
        switch (sortByLower) {
          case 'price':
            fieldName = 'Price';
            break;
          case 'discount':
            fieldName = 'Discount';
            break;
          case 'name':
            fieldName = 'Name';
            break;
          case 'rating':
            fieldName = 'Rating';
            break;
          default:
            fieldName = 'ProductID';
        }

        // Validate sortOrder
        const validOrder = ['asc', 'desc'].includes(sortOrderLower) ? sortOrderLower : 'asc';
        orderBy = `${fieldName} ${validOrder.toUpperCase()}`;

        console.log(`🔍 Sorting by: ${fieldName} ${validOrder.toUpperCase()}`);
      }
    }

    const query = `SELECT * FROM Products WHERE ${conditions.join(' AND ')} ORDER BY ${orderBy}`;
    console.log('🔍 Final SQL Query:', query);
    console.log('🔍 All conditions:', conditions);
    
    const result = await sql.query(query);
    
    // Kiểm tra kết quả
    if (!result.recordset) {
      throw new Error('Không nhận được dữ liệu từ database');
    }
    
    console.log(`✅ Found ${result.recordset.length} products`);
    
    // Kiểm tra và xử lý dữ liệu trước khi trả về
    const products = result.recordset.map(product => ({
      ...product,
      // Đảm bảo các trường quan trọng không bị undefined
      ProductID: product.ProductID || null,
      Name: product.Name || '',
      Description: product.Description || '',
      Price: product.Price || 0,
      OriginalPrice: product.OriginalPrice || product.Price || 0,
      Discount: product.Discount || 0,
      CategoryID: product.CategoryID || null,
      BrandID: product.BrandID || null,
      Rating: product.Rating || 0,
      MainImage: product.MainImage || null,
      StockQuantity: product.StockQuantity || 0,
      InStock: product.InStock !== undefined ? product.InStock : true,
      createdAt: product.createdAt || product.CreatedAt || null,
      updatedAt: product.updatedAt || product.UpdatedAt || null
    }));
    
    res.json(products);
  } catch (err) {
    console.error('❌ Products API error:', err);
    res.status(500).json({ 
      error: err.message,
      details: 'Lỗi khi lấy danh sách sản phẩm'
    });
  } finally {
    try { await sql.close(); } catch {}
  }
});

// API lấy thông tin chi tiết sản phẩm theo ID
app.get('/api/products/:id', async (req, res) => {
  try {
    console.log(`Fetching product with ID: ${req.params.id}`);
    
    const pool = await sql.connect(config);
    const { id } = req.params;
    
    // Query đơn giản
    const query = 'SELECT * FROM Products WHERE ProductID = @ProductID';
    console.log('Executing query:', query);
    
    const result = await pool.request()
      .input('ProductID', sql.Int, parseInt(id))
      .query(query);
      
    // Kiểm tra kết quả
    if (!result.recordset) {
      throw new Error('Không nhận được dữ liệu từ database');
    }
      
    console.log(`Found ${result.recordset.length} products with ID ${id}`);
    if (result.recordset.length === 0) {
      console.log(`Product with ID ${id} not found`);
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }
    
    const product = result.recordset[0];
    if (!product || !product.Name) {
      throw new Error('Dữ liệu sản phẩm không hợp lệ');
    }
    
    console.log('Product found:', product.Name);
    
    res.json(product);
  } catch (err) {
    console.error('Lỗi truy vấn SQL:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try { await sql.close(); } catch {}
  }
});

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email, fullName, phoneNumber, address } = req.body;
    
    console.log('🔍 Registration request body:', { username, email, fullName, phoneNumber, address });
    
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pool = await sql.connect(config);
    
    // Ensure Users table exists
    await ensureUsersLocalColumns(pool);
    
    // Check if username already exists
    const existingUser = await pool.request()
      .input('username', sql.NVarChar(100), username)
      .query('SELECT * FROM Users WHERE Username = @username');
    
    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('🔍 Creating user with fullName:', fullName);
    
    // Create new user
    await pool.request()
      .input('username', sql.NVarChar(100), username)
      .input('passwordHash', sql.NVarChar(255), hashedPassword)
      .input('email', sql.NVarChar(200), email)
      .input('fullName', sql.NVarChar(200), fullName || '')
      .input('phoneNumber', sql.NVarChar(50), phoneNumber || '')
      .input('address', sql.NVarChar(400), address || '')
      .query(`
        INSERT INTO Users (Username, PasswordHash, Email, FullName, PhoneNumber, Address, CreatedAt, UpdatedAt)
        VALUES (@username, @passwordHash, @email, @fullName, @phoneNumber, @address, GETDATE(), GETDATE())
      `);
    
    console.log('✅ User registered successfully with fullName:', fullName);
    res.json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try { await sql.close(); } catch {}
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔍 Login request for username:', username);
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }

    const pool = await sql.connect(config);
    
    // Find user by username
    const user = await pool.request()
      .input('username', sql.NVarChar(100), username)
      .query('SELECT * FROM Users WHERE Username = @username');
    
    if (user.recordset.length === 0) {
      return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu, vui lòng đăng nhập lại' });
    }

    const userData = user.recordset[0];
    console.log('🔍 Found user data:', { 
      username: userData.Username, 
      fullName: userData.FullName, 
      email: userData.Email 
    });
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.PasswordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu, vui lòng đăng nhập lại' });
    }

    // Return user data (without password)
    const { PasswordHash, ...userInfo } = userData;
    console.log('✅ Login successful, returning user info:', userInfo);
    res.json({ success: true, user: userInfo });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try { await sql.close(); } catch {}
  }
});

// // Users CRUD API
// app.get('/api/users', async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request().query('SELECT * FROM Users ORDER BY createdAt DESC');
    
//     // Kiểm tra kết quả
//     if (!result.recordset) {
//       throw new Error('Không nhận được dữ liệu từ database');
//     }
    
//     // Kiểm tra và xử lý dữ liệu trước khi trả về
//     const users = result.recordset.map(user => ({
//       ...user,
//       // Đảm bảo các trường quan trọng không bị undefined
//       id: user.id || user.UserID || null,
//       username: user.username || user.Username || '',
//       fullName: user.fullName || user.FullName || '',
//       email: user.email || user.Email || '',
//       phoneNumber: user.phoneNumber || user.PhoneNumber || '',
//       address: user.address || user.Address || '',
//       image: user.image || user.Image || null,
//       createdAt: user.createdAt || user.CreatedAt || null,
//       updatedAt: user.updatedAt || user.UpdatedAt || null
//     }));
    
//     console.log(`✅ Successfully fetched ${users.length} users`);
//     res.json(users);
//   } catch (err) {
//     console.error('❌ Error fetching users:', err);
//     res.status(500).json({ 
//       message: 'Lỗi khi lấy danh sách người dùng',
//       error: err.message 
//     });
//   } finally {
//     try { await sql.close(); } catch {}
//   }
// });

// app.post('/api/users', async (req, res) => {
//   try {
//     const { username, password, fullName, phoneNumber, email, address, image } = req.body;
    
//     console.log('📥 Received user data:', { username, fullName, email, phoneNumber, address, hasImage: !!image });
    
//     if (!username || !password || !fullName || !email) {
//       console.log('❌ Missing required fields:', { username: !!username, password: !!password, fullName: !!fullName, email: !!email });
//       return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
//     }

//     console.log('🔌 Connecting to database...');
//     const pool = await sql.connect(config);
//     console.log('✅ Database connected successfully');
    
//     // Check if username already exists
//     console.log('🔍 Checking if username exists:', username);
//     const existingUser = await pool.request()
//       .input('username', sql.VarChar, username)
//       .query('SELECT * FROM Users WHERE username = @username');
    
//     if (existingUser.recordset.length > 0) {
//       console.log('❌ Username already exists:', username);
//       return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
//     }
//     console.log('✅ Username is available');

//     // Hash password
//     console.log('🔐 Hashing password...');
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log('✅ Password hashed successfully');
    
//     // Process image if provided (limit length to avoid truncation)
//     let processedImage = null;
//     if (image && image.length > 0) {
//       // Limit image length to 1000 characters to avoid database truncation
//       processedImage = image.length > 1000 ? image.substring(0, 1000) : image;
//       console.log('🖼️ Image processed, length:', processedImage.length);
//     }
    
//     console.log('🔧 Executing INSERT query...');
//     const result = await pool.request()
//       .input('username', sql.VarChar, username)
//       .input('password', sql.VarChar, hashedPassword)
//       .input('fullName', sql.NVarChar, fullName)
//       .input('phoneNumber', sql.VarChar, phoneNumber || null)
//       .input('email', sql.VarChar, email)
//       .input('address', sql.NVarChar, address || null)
//       .input('image', sql.VarChar(1000), processedImage)
//       .query(`
//         INSERT INTO Users (username, password, fullName, PhoneNumber, email, address, image, createdAt)
//         VALUES (@username, @password, @fullName, @phoneNumber, @email, @address, @image, GETDATE());
//         SELECT SCOPE_IDENTITY() AS id;
//       `);
    
//     console.log('📊 Insert result:', result);
    
//     // Kiểm tra kết quả insert
//     if (!result.recordset || result.recordset.length === 0) {
//       throw new Error('Không thể tạo người dùng - không nhận được ID');
//     }

//     const userId = result.recordset[0].id;
//     if (!userId) {
//       throw new Error('Không thể tạo người dùng - ID không hợp lệ');
//     }
    
//     console.log('✅ User created successfully with ID:', userId);
//     res.status(201).json({ 
//       message: 'Tạo người dùng thành công',
//       id: userId
//     });
//   } catch (err) {
//     console.error('❌ Error creating user:', err);
//     console.error('❌ Error stack:', err.stack);
//     res.status(500).json({ 
//       message: `Lỗi khi tạo người dùng: ${err.message}`,
//       details: err.stack
//     });
//   } finally {
//     try { 
//       await sql.close(); 
//       console.log('🔌 Database connection closed');
//     } catch (closeErr) {
//       console.error('❌ Error closing database connection:', closeErr);
//     }
//   }
// });

// app.put('/api/users/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { username, password, fullName, phoneNumber, email, address, image } = req.body;
    
//     console.log('📥 Update user data for ID:', id, { fullName, email, phoneNumber, address, hasImage: !!image });
    
//     if (!fullName || !email) {
//       console.log('❌ Missing required fields:', { fullName: !!fullName, email: !!email });
//       return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
//     }

//     console.log('🔌 Connecting to database...');
//     const pool = await sql.connect(config);
//     console.log('✅ Database connected successfully');
    
//     // Process image if provided (limit length to avoid truncation)
//     let processedImage = null;
//     if (image !== undefined) {
//       if (image && image.length > 0) {
//         // Limit image length to 1000 characters to avoid database truncation
//         processedImage = image.length > 1000 ? image.substring(0, 1000) : image;
//         console.log('🖼️ Image processed for update, length:', processedImage.length);
//       }
//     }
    
//     let updateQuery = `
//       UPDATE Users 
//       SET fullName = @fullName, 
//           PhoneNumber = @phoneNumber, 
//           email = @email, 
//           address = @address`;
    
//     const request = pool.request()
//       .input('id', sql.Int, id)
//       .input('fullName', sql.NVarChar, fullName)
//       .input('phoneNumber', sql.VarChar, phoneNumber || null)
//       .input('email', sql.VarChar, email)
//       .input('address', sql.NVarChar, address || null);

//     // Add image update if provided
//     if (image !== undefined) {
//       updateQuery += ', image = @image';
//       request.input('image', sql.VarChar(1000), processedImage);
//     }

//     // Update password if provided
//     if (password && password.trim()) {
//       console.log('🔐 Hashing new password...');
//       const hashedPassword = await bcrypt.hash(password, 10);
//       updateQuery += ', password = @password';
//       request.input('password', sql.VarChar, hashedPassword);
//       console.log('✅ Password hashed successfully');
//     }
    
//     updateQuery += ', updatedAt = GETDATE() WHERE id = @id';
    
//     console.log('🔧 Update query:', updateQuery);
//     console.log('🔧 Executing UPDATE query...');
    
//     const result = await request.query(updateQuery);
//     console.log('📊 Update result:', result);
    
//     if (result.rowsAffected[0] === 0) {
//       console.log('❌ No user found with ID:', id);
//       return res.status(404).json({ message: 'Không tìm thấy người dùng' });
//     }
    
//     console.log('✅ User updated successfully');
//     res.json({ message: 'Cập nhật người dùng thành công' });
//   } catch (err) {
//     console.error('❌ Error updating user:', err);
//     console.error('❌ Error stack:', err.stack);
//     res.status(500).json({ 
//       message: `Lỗi khi cập nhật người dùng: ${err.message}`,
//       details: err.stack
//     });
//   } finally {
//     try { 
//       await sql.close(); 
//       console.log('🔌 Database connection closed');
//     } catch (closeErr) {
//       console.error('❌ Error closing database connection:', closeErr);
//     }
//   }
// });

// app.delete('/api/users/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const pool = await sql.connect(config);
    
//     const result = await pool.request()
//       .input('id', sql.Int, id)
//       .query('DELETE FROM Users WHERE id = @id');
    
//     if (result.rowsAffected[0] === 0) {
//       return res.status(404).json({ message: 'Không tìm thấy người dùng' });
//     }
    
//     res.json({ message: 'Xóa người dùng thành công' });
//   } catch (err) {
//     console.error('❌ Error deleting user:', err);
//     res.status(500).json({ message: 'Lỗi khi xóa người dùng' });
//   } finally {
//     try { await sql.close(); } catch {}
//   }
// });

// // Products CRUD API
// app.post('/api/products', async (req, res) => {
//   try {
//     console.log('📥 Received product data:', req.body);
    
//     const { 
//       Name, Description, Price, OriginalPrice, Discount, CategoryID, 
//       BrandID, Rating, MainImage, StockQuantity, InStock 
//     } = req.body;
    
//     if (!Name || Price === undefined) {
//       return res.status(400).json({ message: 'Thiếu thông tin bắt buộc: Name và Price' });
//     }

//     const pool = await sql.connect(config);
    
//     // Check if table exists and get its structure
//     const tableCheck = await pool.request().query(`
//       SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
//       FROM INFORMATION_SCHEMA.COLUMNS 
//       WHERE TABLE_NAME = 'Products'
//       ORDER BY ORDINAL_POSITION
//     `);
    
//     console.log('📊 Table structure:', tableCheck.recordset);
    
//     // Build dynamic INSERT query based on available columns
//     let columns = [];
//     let values = [];
//     let params = [];
    
//     // Only add columns that exist in the database
//     const availableColumns = tableCheck.recordset.map(col => col.COLUMN_NAME);
//     console.log('📋 Available columns:', availableColumns);
    
//     if (Name && availableColumns.includes('Name')) { 
//       columns.push('Name'); 
//       values.push('@Name'); 
//       params.push(['Name', sql.NVarChar, Name]); 
//     }
//     if (Description && availableColumns.includes('Description')) { 
//       columns.push('Description'); 
//       values.push('@Description'); 
//       params.push(['Description', sql.NVarChar, Description]); 
//     }
//     if (Price !== undefined && availableColumns.includes('Price')) { 
//       columns.push('Price'); 
//       values.push('@Price'); 
//       params.push(['Price', sql.Int, Price]); 
//     }
//     if (OriginalPrice !== undefined && availableColumns.includes('OriginalPrice')) { 
//       columns.push('OriginalPrice'); 
//       values.push('@OriginalPrice'); 
//       params.push(['OriginalPrice', sql.Int, OriginalPrice]); 
//     }
//     if (Discount !== undefined && availableColumns.includes('Discount')) { 
//       columns.push('Discount'); 
//       values.push('@Discount'); 
//       params.push(['Discount', sql.Int, Discount]); 
//     }
//     if (CategoryID && availableColumns.includes('CategoryID')) { 
//       columns.push('CategoryID'); 
//       values.push('@CategoryID'); 
//       params.push(['CategoryID', sql.Int, CategoryID]); 
//     }
//     if (BrandID && availableColumns.includes('BrandID')) { 
//       columns.push('BrandID'); 
//       values.push('@BrandID'); 
//       params.push(['BrandID', sql.Int, BrandID]); 
//     }
//     if (Rating !== undefined && availableColumns.includes('Rating')) { 
//       columns.push('Rating'); 
//       values.push('@Rating'); 
//       params.push(['Rating', sql.Float, Rating]); 
//     }
//     if (MainImage && availableColumns.includes('MainImage')) { 
//       // Giới hạn độ dài MainImage để tránh lỗi truncation
//       const truncatedImage = MainImage.length > 1000 ? MainImage.substring(0, 1000) : MainImage;
//       columns.push('MainImage'); 
//       values.push('@MainImage'); 
//       params.push(['MainImage', sql.NVarChar(1000), truncatedImage]); 
//     }
//     if (StockQuantity !== undefined && availableColumns.includes('StockQuantity')) { 
//       columns.push('StockQuantity'); 
//       values.push('@StockQuantity'); 
//       params.push(['StockQuantity', sql.Int, StockQuantity]); 
//     }
//     if (InStock !== undefined && availableColumns.includes('InStock')) { 
//       columns.push('InStock'); 
//       values.push('@InStock'); 
//       params.push(['InStock', sql.Bit, InStock]); 
//     }
    
//     // Add timestamp if column exists
//     const hasCreatedAt = tableCheck.recordset.some(col => col.COLUMN_NAME === 'createdAt');
//     if (hasCreatedAt) {
//       columns.push('createdAt');
//       values.push('GETDATE()');
//     }
    
//     const insertQuery = `
//       INSERT INTO Products (${columns.join(', ')})
//       VALUES (${values.join(', ')});
//       SELECT SCOPE_IDENTITY() AS ProductID;
//     `;
    
//     console.log('🔧 Insert query:', insertQuery);
    
//     const request = pool.request();
//     params.forEach(([name, type, value]) => {
//       request.input(name, type, value);
//     });
    
//     const result = await request.query(insertQuery);
    
//     console.log('✅ Insert result:', result);
    
//     // Kiểm tra kết quả insert
//     if (!result.recordset || result.recordset.length === 0) {
//       throw new Error('Không thể tạo sản phẩm - không nhận được ProductID');
//     }

//     const productId = result.recordset[0].ProductID;
//     if (!productId) {
//       throw new Error('Không thể tạo sản phẩm - ProductID không hợp lệ');
//     }
    
//     res.status(201).json({ 
//       message: 'Tạo sản phẩm thành công',
//       ProductID: productId
//     });
//   } catch (err) {
//     console.error('❌ Error creating product:', err);
//     res.status(500).json({ message: `Lỗi khi tạo sản phẩm: ${err.message}` });
//   } finally {
//     try { await sql.close(); } catch {}
//   }
// });

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      Name, Description, Price, OriginalPrice, Discount, CategoryID, 
      BrandID, Rating, MainImage, StockQuantity, InStock 
    } = req.body;
    
    if (!Name || Price === undefined) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const pool = await sql.connect(config);
    
    // Check if table exists and get its structure
    const tableCheck = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Products'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('📊 Update - Table structure:', tableCheck.recordset);
    
    // Build dynamic UPDATE query based on available columns
    const availableColumns = tableCheck.recordset.map(col => col.COLUMN_NAME);
    console.log('📋 Update - Available columns:', availableColumns);
    
    let updateFields = [];
    let params = [];
    
    if (Name && availableColumns.includes('Name')) { 
      updateFields.push('Name = @Name'); 
      params.push(['Name', sql.NVarChar, Name]); 
    }
    if (Description !== undefined && availableColumns.includes('Description')) { 
      updateFields.push('Description = @Description'); 
      params.push(['Description', sql.NVarChar, Description || null]); 
    }
    if (Price !== undefined && availableColumns.includes('Price')) { 
      updateFields.push('Price = @Price'); 
      params.push(['Price', sql.Int, Price]); 
    }
    if (OriginalPrice !== undefined && availableColumns.includes('OriginalPrice')) { 
      updateFields.push('OriginalPrice = @OriginalPrice'); 
      params.push(['OriginalPrice', sql.Int, OriginalPrice || Price]); 
    }
    if (Discount !== undefined && availableColumns.includes('Discount')) { 
      updateFields.push('Discount = @Discount'); 
      params.push(['Discount', sql.Int, Discount || 0]); 
    }
    if (CategoryID !== undefined && availableColumns.includes('CategoryID')) { 
      updateFields.push('CategoryID = @CategoryID'); 
      params.push(['CategoryID', sql.Int, CategoryID || null]); 
    }
    if (BrandID !== undefined && availableColumns.includes('BrandID')) { 
      updateFields.push('BrandID = @BrandID'); 
      params.push(['BrandID', sql.Int, BrandID || null]); 
    }
    if (Rating !== undefined && availableColumns.includes('Rating')) { 
      updateFields.push('Rating = @Rating'); 
      params.push(['Rating', sql.Float, Rating || 0]); 
    }
    if (MainImage !== undefined && availableColumns.includes('MainImage')) { 
      // Giới hạn độ dài MainImage để tránh lỗi truncation
      const truncatedImage = MainImage && MainImage.length > 1000 ? MainImage.substring(0, 1000) : MainImage;
      updateFields.push('MainImage = @MainImage'); 
      params.push(['MainImage', sql.NVarChar(1000), truncatedImage || null]); 
    }
    if (StockQuantity !== undefined && availableColumns.includes('StockQuantity')) { 
      updateFields.push('StockQuantity = @StockQuantity'); 
      params.push(['StockQuantity', sql.Int, StockQuantity || 0]); 
    }
    if (InStock !== undefined && availableColumns.includes('InStock')) { 
      updateFields.push('InStock = @InStock'); 
      params.push(['InStock', sql.Bit, InStock || false]); 
    }
    
    // Add updatedAt if column exists
    if (availableColumns.includes('updatedAt')) {
      updateFields.push('updatedAt = GETDATE()');
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'Không có trường nào để cập nhật' });
    }
    
    const updateQuery = `
      UPDATE Products 
      SET ${updateFields.join(', ')}
      WHERE ProductID = @id
    `;
    
    console.log('🔧 Update query:', updateQuery);
    
    const request = pool.request()
      .input('id', sql.Int, id);
    
    params.forEach(([name, type, value]) => {
      request.input(name, type, value);
    });
    
    const result = await request.query(updateQuery);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    res.json({ message: 'Cập nhật sản phẩm thành công' });
  } catch (err) {
    console.error('❌ Error updating product:', err);
    res.status(500).json({ message: `Lỗi khi cập nhật sản phẩm: ${err.message}` });
  } finally {
    try { await sql.close(); } catch {}
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Products WHERE ProductID = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (err) {
    console.error('❌ Error deleting product:', err);
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm' });
  } finally {
    try { await sql.close(); } catch {}
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Test endpoint: http://localhost:${PORT}/api/test`);
}); 