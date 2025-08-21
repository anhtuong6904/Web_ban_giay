const sql = require('mssql');

// Thử các cấu hình khác nhau
const configs = [
  {
    name: 'localhost',
    config: {
      user: 'sa',
      password: 'Giakiet@123',
      server: 'localhost',
      database: 'WebShoes',
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
      }
    }
  },
  {
    name: 'localhost\\MSSQLSERVER',
    config: {
      user: 'sa',
      password: 'Giakiet@123',
      server: 'localhost\\MSSQLSERVER',
      database: 'WebShoes',
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
      }
    }
  },
  {
    name: 'DESKTOP-3UR600M',
    config: {
      user: 'sa',
      password: 'Giakiet@123',
      server: 'DESKTOP-3UR600M',
      database: 'WebShoes',
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
      }
    }
  },
  {
    name: 'DESKTOP-3UR600M\\MSSQLSERVER',
    config: {
      user: 'sa',
      password: 'Giakiet@123',
      server: 'DESKTOP-3UR600M\\MSSQLSERVER',
      database: 'shopgiay',
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
      }
    }
  }
];

async function testConnection(config, configName) {
  try {
    console.log(`🔌 Đang thử kết nối với: ${configName}`);
    const pool = await sql.connect(config);
    console.log(`✅ Kết nối thành công với: ${configName}`);
    
    // Test query đơn giản
    console.log('🔍 Đang test query...');
    const result = await pool.request().query('SELECT COUNT(*) as total FROM Products');
    console.log('✅ Query thành công! Số sản phẩm:', result.recordset[0].total);
    
    await pool.close();
    console.log('🔌 Đã đóng kết nối database');
    return true;
    
  } catch (err) {
    console.error(`❌ Lỗi kết nối với ${configName}:`, err.message);
    return false;
  }
}

async function testAllConfigs() {
  console.log('🚀 Bắt đầu test tất cả cấu hình...\n');
  
  for (const configInfo of configs) {
    const success = await testConnection(configInfo.config, configInfo.name);
    if (success) {
      console.log(`\n🎉 Tìm thấy cấu hình hoạt động: ${configInfo.name}`);
      console.log('📝 Cập nhật server.js với cấu hình này:');
      console.log(`server: '${configInfo.config.server}'`);
      break;
    }
    console.log(''); // Dòng trống để dễ đọc
  }
}

testAllConfigs();
