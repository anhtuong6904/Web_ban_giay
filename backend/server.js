const express = require('express');
const cors = require('cors');
const { sql, config } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const { VNPay } = require('vnpay');
require('dotenv').config();

const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMNCODE,
  secureSecret: process.env.VNP_HASHSECRET,
  testMode: true
});

// API tạo thanh toán
app.post('/api/payments/create', (req, res) => {
  try {
    const { amount, orderInfo } = req.body;

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount * 100, // VNPay yêu cầu nhân 100
      vnp_IpAddr: req.ip,
      vnp_ReturnUrl: `${process.env.APP_URL}/api/payments/verify`,
      vnp_TxnRef: `ORDER_${Date.now()}`,
      vnp_OrderInfo: orderInfo,
    });

    res.json({ success: true, paymentUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API xác thực thanh toán từ VNPay trả về
app.get('/api/payments/verify', (req, res) => {
  try {
    const verification = vnpay.verifyReturnUrl(req.query);
    if (verification.isVerified) {
      res.json({ success: true, data: verification });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



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
      return res.status(400).json({ error: 'FirebaseUID và Email là bắt buộc' });
    }

    const pool = await sql.connect(config);
    
    // Kiểm tra user đã tồn tại chưa
    const checkUser = await pool.request()
      .input('firebaseUID', sql.NVarChar, firebaseUID)
      .query('SELECT UserID FROM Users WHERE FirebaseUID = @firebaseUID');
    
    if (checkUser.recordset.length > 0) {
      // Cập nhật thông tin user
      await pool.request()
        .input('firebaseUID', sql.NVarChar, firebaseUID)
        .input('email', sql.NVarChar, email)
        .input('displayName', sql.NVarChar, displayName || null)
        .input('photoURL', sql.NVarChar, photoURL || null)
        .input('lastLoginAt', sql.DateTime2, new Date())
        .query(`
          UPDATE Users 
          SET Email = @email, 
              DisplayName = @displayName, 
              PhotoURL = @photoURL, 
              LastLoginAt = @lastLoginAt,
              UpdatedAt = GETDATE()
          WHERE FirebaseUID = @firebaseUID
        `);
      
      return res.json({ message: 'User updated successfully' });
    } else {
      // Tạo user mới
      const result = await pool.request()
        .input('firebaseUID', sql.NVarChar, firebaseUID)
        .input('email', sql.NVarChar, email)
        .input('displayName', sql.NVarChar, displayName || null)
        .input('photoURL', sql.NVarChar, photoURL || null)
        .query(`
          INSERT INTO Users (FirebaseUID, Email, DisplayName, PhotoURL, LastLoginAt)
          VALUES (@firebaseUID, @email, @displayName, @photoURL, @lastLoginAt)
        `);
      
      return res.json({ message: 'User created successfully' });
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    try { await sql.close(); } catch {}
  }
});

app.get('/api/users/:firebaseUID', async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('firebaseUID', sql.NVarChar, firebaseUID)
      .query('SELECT * FROM Users WHERE FirebaseUID = @firebaseUID');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    try { await sql.close(); } catch {}
  }
});

// API lấy tất cả sản phẩm, có filter
app.get('/api/products', async (req, res) =>{
  try {
    console.log('Connecting to database...');
    await sql.connect(config);
    console.log('Database connected successfully');

    // Supported query params:
    // - gender: men|women|kids|sports
    // - brand: BrandID (number)
    // - brandName: string
    // - category: CategoryID (number)
    // - categoryName: string
    // - tag: shoes|men|women|kids|sports|brands
    // - sale: true
    const { gender, brand, category, brandName, categoryName, tag, sale, priceMin, priceMax } = req.query;

    const conditions = ['1=1'];

    // Tag mapping
    if (tag) {
      const t = String(tag).toLowerCase();
      if (t === 'men') conditions.push("Gender = 'MEN'");
      if (t === 'women') conditions.push("Gender = 'WOMEN'");
      if (t === 'kids') conditions.push("Gender = 'KIDS'");
      if (t === 'sports') conditions.push("Gender = 'SPORTS'");
      // shoes => no extra filter; brands => needs brand/brandName to be effective
    }

    if (gender) {
      const g = String(gender).toUpperCase();
      conditions.push(`Gender = '${g}'`);
    }

    if (brand && !Number.isNaN(parseInt(brand))) {
      conditions.push(`BrandID = ${parseInt(brand)}`);
    }

    if (brandName) {
      conditions.push(`BrandID IN (SELECT BrandID FROM Brands WHERE Name LIKE '%${brandName}%')`);
    }

    if (category && !Number.isNaN(parseInt(category))) {
      conditions.push(`CategoryID = ${parseInt(category)}`);
    }

    if (categoryName) {
      conditions.push(`CategoryID IN (SELECT CategoryID FROM Categories WHERE Name LIKE '%${categoryName}%')`);
    }

    if (sale === 'true') {
      // Only add if column exists; many schemas have Discount
      conditions.push('ISNULL(Discount, 0) > 0');
    }

    // Price range
    if (priceMin && !Number.isNaN(parseFloat(priceMin))) {
      conditions.push(`Price >= ${parseFloat(priceMin)}`);
    }
    if (priceMax && !Number.isNaN(parseFloat(priceMax))) {
      conditions.push(`Price <= ${parseFloat(priceMax)}`);
    }

    const query = `SELECT * FROM Products WHERE ${conditions.join(' AND ')} ORDER BY ProductID`;
    console.log('Executing query:', query);
    const result = await sql.query(query);
    console.log(`Found ${result.recordset.length} products`);

    res.json(result.recordset);
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

// API lấy thông tin chi tiết sản phẩm theo ID
app.get('/api/products/:id', async (req, res) => {
  try {
    console.log(`Fetching product with ID: ${req.params.id}`);
    console.log('Connecting to database...');
    await sql.connect(config);
    console.log('Database connected successfully');
    
    const { id } = req.params;
    
    // Query đơn giản hơn, không join với bảng khác
    const query = `SELECT * FROM Products WHERE ProductID = ${parseInt(id)}`;
    console.log('Executing query:', query);
    
    const result = await sql.query(query);
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

// NEW: User API endpoints
app.post('/api/users', async (req, res) => {
  try {
    const { firebaseUID, email, displayName, photoURL } = req.body;
    if (!firebaseUID || !email) {
      return res.status(400).json({ error: 'FirebaseUID và Email là bắt buộc' });
    }

    await sql.connect(config);
    const checkUser = await sql.query(`
      SELECT UserID FROM Users WHERE FirebaseUID = '${firebaseUID}'
    `);

    if (checkUser.recordset.length > 0) {
      // Update existing user
      await sql.query(`
        UPDATE Users 
        SET Email = '${email}', 
            DisplayName = '${displayName || ''}', 
            PhotoURL = '${photoURL || ''}', 
            LastLoginAt = GETDATE(),
            UpdatedAt = GETDATE()
        WHERE FirebaseUID = '${firebaseUID}'
      `);
      res.json({ message: 'User updated successfully' });
    } else {
      // Create new user
      await sql.query(`
        INSERT INTO Users (FirebaseUID, Email, DisplayName, PhotoURL, LastLoginAt)
        VALUES ('${firebaseUID}', '${email}', '${displayName || ''}', '${photoURL || ''}', GETDATE())
      `);
      res.json({ message: 'User created successfully' });
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    try {
      await sql.close();
    } catch {}
  }
});

app.get('/api/users/:firebaseUID', async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    await sql.connect(config);
    const result = await sql.query(`
      SELECT * FROM Users WHERE FirebaseUID = '${firebaseUID}'
    `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    try {
      await sql.close();
    } catch {}
  }
});

// Complete Orders API
app.post('/api/orders', async (req, res) => {
  const { recipient, items, paymentMethod = 'COD', note } = req.body || {};
  if (!recipient || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing recipient or items' });
  }

  try {
    await sql.connect(config);
    
    // Create order
    const orderResult = await sql.query(`
      INSERT INTO Orders (CustomerName, Email, Address, Phone, PaymentMethod, Status, TotalAmount, CreatedAt)
      OUTPUT INSERTED.OrderID
      VALUES ('${recipient.name}', '${recipient.email}', '${recipient.address}', '${recipient.phone}', '${paymentMethod}', 'PENDING', ${items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}, GETDATE())
    `);
    
    const orderId = orderResult.recordset[0].OrderID;
    
    // Create order items
    for (const item of items) {
      await sql.query(`
        INSERT INTO OrderItems (OrderID, ProductID, ProductName, Quantity, UnitPrice, Image)
        VALUES (${orderId}, ${item.id}, '${item.name}', ${item.quantity}, ${item.price}, '${item.image}')
      `);
    }
    
    res.json({ 
      success: true, 
      orderId,
      message: 'Order created successfully' 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    try {
      await sql.close();
    } catch {}
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   GET /api/test - Test server`);
  console.log(`   GET /api/products - Get all products`);
  console.log(`   GET /api/products/:id - Get product by ID`);
  console.log(`   POST /api/users - Create/Update user`);
  console.log(`   GET /api/users/:firebaseUID - Get user info`);
  console.log(`   POST /api/orders - Create order`);
}); 