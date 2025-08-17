const sql = require('mssql');

console.log('🔍 Comprehensive SQL Server Connection Test');
console.log('==========================================\n');

// Test 1: Windows Authentication
async function testWindowsAuth() {
  console.log('🪟 Test 1: Windows Authentication');
  const config = {
    server: 'DESKTOP-3UR600M',
    database: 'shopgiay',
    port: 1433,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      integratedSecurity: true
    }
  };

  try {
    await sql.connect(config);
    console.log('✅ Windows Authentication: SUCCESS');
    await sql.close();
    return true;
  } catch (err) {
    console.log('❌ Windows Authentication: FAILED');
    console.log('   Error:', err.message);
    return false;
  }
}

// Test 2: SQL Authentication với nhiều password
async function testSQLAuth() {
  console.log('\n🔑 Test 2: SQL Authentication với nhiều password');
  
  const passwords = [
    '', 'sa', '123456', 'password', 'admin', '123', 'sa123', '123sa',
    'root', 'master', 'sql', 'server', 'sa123456', '123456sa',
    'administrator', 'saadmin', 'sa1234', '1234sa', 'sa2024', '2024sa'
  ];

  for (const password of passwords) {
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
      console.log(`✅ SQL Auth SUCCESS with password: "${password}"`);
      await sql.close();
      return password;
    } catch (err) {
      if (err.code === 'ELOGIN') {
        console.log(`❌ Login failed: "${password}"`);
      } else {
        console.log(`⚠️  Other error with "${password}":`, err.message);
      }
    }
  }
  
  console.log('❌ Không tìm thấy password đúng!');
  return null;
}

// Test 3: Kiểm tra server có hoạt động không
async function testServerConnection() {
  console.log('\n🌐 Test 3: Kiểm tra server connection (không cần database)');
  
  const config = {
    user: 'sa',
    password: '123456',
    server: 'DESKTOP-3UR600M',
    port: 1433,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true
    }
  };

  try {
    await sql.connect(config);
    console.log('✅ Server connection: SUCCESS (không cần database)');
    await sql.close();
    return true;
  } catch (err) {
    console.log('❌ Server connection: FAILED');
    console.log('   Error:', err.message);
    return false;
  }
}

// Test 4: Thử với server name khác
async function testAlternativeServerNames() {
  console.log('\n🔄 Test 4: Thử với server name khác');
  
  const serverNames = [
    'localhost',
    '127.0.0.1',
    'DESKTOP-3UR600M\\SQLEXPRESS',
    'DESKTOP-3UR600M\\MSSQLSERVER',
    'DESKTOP-3UR600M,1433'
  ];

  for (const server of serverNames) {
    console.log(`   Testing server: ${server}`);
    
    const config = {
      user: 'sa',
      password: '123456',
      server: server,
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
      console.log(`✅ SUCCESS with server: ${server}`);
      await sql.close();
      return server;
    } catch (err) {
      console.log(`❌ FAILED with server: ${server}`);
    }
  }
  
  console.log('❌ Không tìm thấy server name đúng!');
  return null;
}

// Chạy tất cả tests
async function runAllTests() {
  console.log('🚀 Bắt đầu test toàn diện...\n');
  
  const results = {
    windowsAuth: await testWindowsAuth(),
    sqlAuth: await testSQLAuth(),
    serverConnection: await testServerConnection(),
    alternativeServer: await testAlternativeServerNames()
  };

  console.log('\n📊 KẾT QUẢ TỔNG HỢP:');
  console.log('========================');
  console.log(`Windows Auth: ${results.windowsAuth ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`SQL Auth: ${results.sqlAuth ? `✅ SUCCESS (password: "${results.sqlAuth}")` : '❌ FAILED'}`);
  console.log(`Server Connection: ${results.serverConnection ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`Alternative Server: ${results.alternativeServer ? `✅ SUCCESS (${results.alternativeServer})` : '❌ FAILED'}`);

  if (results.sqlAuth) {
    console.log(`\n🎉 GIẢI PHÁP: Sử dụng password "${results.sqlAuth}"`);
  } else if (results.alternativeServer) {
    console.log(`\n🎉 GIẢI PHÁP: Sử dụng server "${results.alternativeServer}"`);
  } else {
    console.log('\n❌ CẦN KIỂM TRA SQL SERVER CONFIGURATION');
    console.log('   - Kiểm tra SQL Server có chạy không');
    console.log('   - Kiểm tra port 1433 có mở không');
    console.log('   - Kiểm tra Windows Firewall');
    console.log('   - Reset password user sa');
  }
}

runAllTests().catch(console.error); 