const express = require('express');
const cors = require('cors');
const { sql, config } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint để kiểm tra server
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// API lấy tất cả sản phẩm, có filter
app.get('/api/products', async (req, res) =>{
  try {
    console.log('Connecting to database...');
    await sql.connect(config);
    console.log('Database connected successfully');
    
    let query = 'SELECT * FROM Products WHERE 1=1';
    const { gender, brand, category, sale } = req.query;
    if (gender) query += ` AND Gender LIKE '%${gender}%'`;
    if (brand) query += ` AND BrandID = ${parseInt(brand)}`;
    if (category) query += ` AND CategoryID = ${parseInt(category)}`;
    if (sale === 'true') query += ` AND Discount > 0`;
    
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   GET /api/test - Test server`);
  console.log(`   GET /api/products - Get all products`);
  console.log(`   GET /api/products/:id - Get product by ID`);
}); 