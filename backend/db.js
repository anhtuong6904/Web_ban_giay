require('dotenv').config();
const sql = require('mssql');

// Config sử dụng SQL Authentication với password đúng
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || 'Giakiet@123',  // Password đúng
  server: process.env.DB_SERVER /*|| 'DESKTOP-3UR600M' || 'localhost' */|| 'DESKTOP-BRVN1O0',
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

module.exports = { sql, config }; 