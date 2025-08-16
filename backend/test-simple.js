const sql = require('mssql');

console.log('🔍 Simple SQL Server Connection Test');
console.log('===================================\n');

// Test với server name khác nhau
const serverNames = [
  'localhost',
  '127.0.0.1', 
  'DESKTOP-3UR600M',
  'DESKTOP-3UR600M\\SQLEXPRESS',
  'DESKTOP-3UR600M\\MSSQLSERVER'
];

async function testConnection() {
  for (const server of serverNames) {
    console.log(`\n🌐 Testing server: ${server}`);
    
    const config = {
      user: 'sa',
      password: '123456',
      server: server,
      database: 'shopgiay',
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
      }
    };

    try {
      console.log(`   Connecting to ${server}...`);
      await sql.connect(config);
      console.log(`✅ SUCCESS: Connected to ${server}`);
      
      // Test query đơn giản
      const result = await sql.query('SELECT @@VERSION as version');
      console.log(`   SQL Server Version: ${result.recordset[0].version.substring(0, 100)}...`);
      
      await sql.close();
      console.log(`   Connection closed successfully`);
      
      return server; // Tìm thấy server đúng
    } catch (err) {
      if (err.code === 'ELOGIN') {
        console.log(`❌ FAILED: Login failed for user 'sa'`);
      } else if (err.code === 'ESOCKET') {
        console.log(`❌ FAILED: Cannot connect to server (network error)`);
      } else {
        console.log(`❌ FAILED: ${err.message}`);
      }
    }
  }
  
  console.log('\n❌ Không thể kết nối với server nào!');
  return null;
}

// Chạy test
testConnection().then(result => {
  if (result) {
    console.log(`\n🎉 GIẢI PHÁP: Sử dụng server "${result}"`);
    console.log('Hãy cập nhật file .env với server name này!');
  } else {
    console.log('\n❌ CẦN KIỂM TRA:');
    console.log('   1. SQL Server có đang chạy không?');
    console.log('   2. Port 1433 có mở không?');
    console.log('   3. Windows Firewall có chặn không?');
    console.log('   4. SQL Server có hỗ trợ TCP/IP không?');
  }
}); 