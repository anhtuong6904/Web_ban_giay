const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'Giakiet@123',
  server: 'DESKTOP-3UR600M',
  database: 'shopgiay',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

async function testConnection() {
  try {
    console.log('🔌 Đang kết nối database...');
    console.log('Server:', config.server);
    console.log('Database:', config.database);
    console.log('User:', config.user);
    
    const pool = await sql.connect(config);
    console.log('✅ Kết nối database thành công!');
    
    // Test query đơn giản
    console.log('🔍 Đang test query...');
    const result = await pool.request().query('SELECT COUNT(*) as total FROM Products');
    console.log('✅ Query thành công! Số sản phẩm:', result.recordset[0].total);
    
    await pool.close();
    console.log('🔌 Đã đóng kết nối database');
    
  } catch (err) {
    console.error('❌ Lỗi kết nối database:', err.message);
    console.error('Chi tiết lỗi:', err);
  }
}

testConnection();
