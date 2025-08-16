require('dotenv').config();
const sql = require('mssql');

// Test các password khác nhau
const passwords = [
  '',           // Password trống
  'sa',        // Password = username
  '123456',    // Password số
  'password',  // Password mặc định
  'admin',     // Password admin
  '123',       // Password ngắn
  'sa123',     // Password kết hợp
  '123sa'      // Password kết hợp
];

async function testPasswords() {
  for (const password of passwords) {
    console.log(`\n🔑 Testing password: "${password}"`);
    
    const config = {
      user: 'sa',
      password: password,
      server: 'DESKTOP-3UR600M',
      database: 'shopgiay',
      port: 1433,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
      }
    };

    try {
      await sql.connect(config);
      console.log(`✅ SUCCESS with password: "${password}"`);
      await sql.close();
      return password; // Tìm thấy password đúng
    } catch (err) {
      if (err.code === 'ELOGIN') {
        console.log(`❌ Login failed with password: "${password}"`);
      } else {
        console.log(`⚠️  Other error with password "${password}":`, err.message);
      }
    }
  }
  
  console.log('\n❌ Không tìm thấy password đúng!');
  return null;
}

// Chạy test
testPasswords().then(result => {
  if (result) {
    console.log(`\n🎉 Password đúng là: "${result}"`);
    console.log('Hãy cập nhật file .env với password này!');
  }
}); 