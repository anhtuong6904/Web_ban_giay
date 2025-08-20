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

// API lấy tất cả sản phẩm, có filter
app.get('/api/products', async (req, res) =>{
  try {
    console.log('Connecting to database...');
    await sql.connect(config);
    console.log('Database connected successfully');

    // Supported query params:
    // - gender: men|women|kids|unisex
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
      if (t === 'men') conditions.push("(Gender = 'MEN' OR Gender = 'UNISEX')");
      if (t === 'women') conditions.push("(Gender = 'WOMEN' OR Gender = 'UNISEX')");
      if (t === 'kids') conditions.push("(Gender = 'KIDS' OR Gender = 'UNISEX')");
      if (t === 'sports') {
        conditions.push("CategoryID IN (SELECT CategoryID FROM Categories WHERE Name IN ('Running','Basketball','Skateboarding','Giày thể thao','Giày chạy bộ'))");
      }
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   GET /api/test - Test server`);
  console.log(`   GET /api/products - Get all products`);
  console.log(`   GET /api/products/:id - Get product by ID`);
}); 