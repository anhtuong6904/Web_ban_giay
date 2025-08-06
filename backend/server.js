const express = require('express');
const cors = require('cors');
const { sql, config } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// API test kết nối và lấy tất cả sản phẩm
app.get('/api/products', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM Products');
    console.log('Kết quả truy vấn:', result); // Thêm dòng này
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi truy vấn SQL:', err); // Thêm dòng này
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 