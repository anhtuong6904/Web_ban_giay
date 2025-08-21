const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database configuration
const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '123456',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'WebShoes',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

// Test endpoint để kiểm tra server
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
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
        [Phone] NVARCHAR(50) NULL,
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

// Create order (COD/MoMo/VNPay pending)
app.post('/api/orders', async (req, res) => {
  const { recipient, items, paymentMethod = 'COD', note } = req.body || {};
  if (!recipient || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing recipient or items' });
  }

  try {
    const pool = await sql.connect(config);
    await ensureOrderTables();

    const total = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);

    const insertOrder = await pool.request()
      .input('CustomerName', sql.NVarChar(200), recipient.name || '')
      .input('Email', sql.NVarChar(200), recipient.email || '')
      .input('Address', sql.NVarChar(400), recipient.address || '')
      .input('Phone', sql.NVarChar(50), recipient.phone || '')
      .input('PaymentMethod', sql.NVarChar(50), paymentMethod)
      .input('Status', sql.NVarChar(50), paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING')
      .input('TotalAmount', sql.Decimal(18, 2), total)
      .query(`
        INSERT INTO Orders (CustomerName, Email, Address, Phone, PaymentMethod, Status, TotalAmount)
        OUTPUT INSERTED.OrderID
        VALUES (@CustomerName, @Email, @Address, @Phone, @PaymentMethod, @Status, @TotalAmount)
      `);

    const orderId = insertOrder.recordset[0].OrderID;

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

    res.json({ success: true, orderId, total, status: paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING' });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try { await sql.close(); } catch {}
  }
});

// API endpoints cho Users
app.post('/api/users', async (req, res) => {
  try {
    const { firebaseUID, email, displayName, photoURL } = req.body;
    
    if (!firebaseUID || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pool = await sql.connect(config);
    
    // Ensure Users table exists with correct structure
    await ensureUsersLocalColumns(pool);
    
    // Check if user already exists
    const existingUser = await pool.request()
      .input('firebaseUID', sql.NVarChar(200), firebaseUID)
      .query('SELECT * FROM Users WHERE FirebaseUID = @firebaseUID');
    
    if (existingUser.recordset.length > 0) {
      // Update existing user
      await pool.request()
        .input('firebaseUID', sql.NVarChar(200), firebaseUID)
        .input('email', sql.NVarChar(200), email)
        .input('displayName', sql.NVarChar(200), displayName || '')
        .input('photoURL', sql.NVarChar(500), photoURL || '')
        .query(`
          UPDATE Users 
          SET Email = @email, DisplayName = @displayName, PhotoURL = @photoURL, UpdatedAt = GETDATE()
          WHERE FirebaseUID = @firebaseUID
        `);
      
      res.json({ success: true, message: 'User updated successfully' });
    } else {
      // Create new user
      await pool.request()
        .input('firebaseUID', sql.NVarChar(200), firebaseUID)
        .input('email', sql.NVarChar(200), email)
        .input('displayName', sql.NVarChar(200), displayName || '')
        .input('photoURL', sql.NVarChar(500), photoURL || '')
        .query(`
          INSERT INTO Users (FirebaseUID, Email, DisplayName, PhotoURL, CreatedAt, UpdatedAt)
          VALUES (@firebaseUID, @email, @displayName, @photoURL, GETDATE(), GETDATE())
        `);
      
      res.json({ success: true, message: 'User created successfully' });
    }
  } catch (err) {
    console.error('User API error:', err);
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
      conditions.push(`Gender = '${gender}'`);
    }

    // Tag filter
    if (tag && tag !== 'all') {
      conditions.push(`Tag = '${tag}'`);
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
    console.log(`✅ Found ${result.recordset.length} products`);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Products API error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try { await sql.close(); } catch {}
  }
});

// API lấy thông tin chi tiết sản phẩm theo ID
app.get('/api/products/:id', async (req, res) => {
  try {
    console.log(`Fetching product with ID: ${req.params.id}`);
    console.log('Connecting to database...');
    await sql.connect(config);
    console.log('Database connected successfully');
    
    const { id } = req.params;
    
    // Query đơn giản hơn, không join với bảng khác
    const query = 'SELECT * FROM Products WHERE ProductID = @ProductID';
    console.log('Executing query:', query);
    
    const result = await sql.query(query, { ProductID: parseInt(id) });
    console.log(`Found ${result.recordset.length} products with ID ${id}`);
    if (result.recordset.length === 0) {
      console.log(`Product with ID ${id} not found`);
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }
    
    const product = result.recordset[0];
    console.log('Product found:', product.Name);
    
    res.json(product);
  } catch (err) {
    console.error('Lỗi truy vấn SQL:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try {
      await sql.close();
      console.log('Database connection closed');
    } catch (closeErr) {
      console.error('Error closing connection:', closeErr);
    }
  }
});

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email, fullName, phone, address } = req.body;
    
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
    
    // Create new user
    await pool.request()
      .input('username', sql.NVarChar(100), username)
      .input('passwordHash', sql.NVarChar(255), hashedPassword)
      .input('email', sql.NVarChar(200), email)
      .input('fullName', sql.NVarChar(200), fullName || '')
      .input('phone', sql.NVarChar(50), phone || '')
      .input('address', sql.NVarChar(400), address || '')
      .query(`
        INSERT INTO Users (Username, PasswordHash, Email, FullName, Phone, Address, CreatedAt, UpdatedAt)
        VALUES (@username, @passwordHash, @email, @fullName, @phone, @address, GETDATE(), GETDATE())
      `);
    
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
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.PasswordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu, vui lòng đăng nhập lại' });
    }

    // Return user data (without password)
    const { PasswordHash, ...userInfo } = userData;
    res.json({ success: true, user: userInfo });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try { await sql.close(); } catch {}
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Test endpoint: http://localhost:${PORT}/api/test`);
}); 