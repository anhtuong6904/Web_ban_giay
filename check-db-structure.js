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

async function checkDatabaseStructure() {
  try {
    console.log('🔌 Đang kết nối database...');
    const pool = await sql.connect(config);
    console.log('✅ Kết nối database thành công!');
    
    // Kiểm tra cấu trúc bảng Products
    console.log('\n📋 Kiểm tra cấu trúc bảng Products:');
    const columns = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Products'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('Các cột trong bảng Products:');
    columns.recordset.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    // Kiểm tra dữ liệu mẫu
    console.log('\n📦 Kiểm tra dữ liệu mẫu:');
    const sampleData = await pool.request().query('SELECT TOP 3 * FROM Products');
    console.log('3 sản phẩm đầu tiên:');
    sampleData.recordset.forEach((product, index) => {
      console.log(`\nSản phẩm ${index + 1}:`);
      Object.keys(product).forEach(key => {
        console.log(`  ${key}: ${product[key]}`);
      });
    });
    
    await pool.close();
    console.log('\n🔌 Đã đóng kết nối database');
    
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  }
}

checkDatabaseStructure();
