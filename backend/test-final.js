const { sql, config } = require('./db');

console.log('🎯 Final Database Connection Test');
console.log('================================\n');

async function testConnection() {
  try {
    console.log('🔌 Connecting to database...');
    console.log('Config:', {
      user: config.user,
      server: config.server,
      database: config.database,
      port: config.port
    });
    
    await sql.connect(config);
    console.log('✅ Database connected successfully!');
    
    // Test query đơn giản
    console.log('\n📊 Testing basic query...');
    const result = await sql.query('SELECT COUNT(*) as count FROM Products');
    console.log(`✅ Products count: ${result.recordset[0].count}`);
    
    // Test query chi tiết
    console.log('\n📦 Testing product detail query...');
    const productResult = await sql.query('SELECT TOP 1 * FROM Products');
    if (productResult.recordset.length > 0) {
      const product = productResult.recordset[0];
      console.log(`✅ First product: ${product.Name}`);
      console.log(`   Price: ${product.Price}`);
      console.log(`   MainImage: ${product.MainImage || 'NULL'}`);
    }
    
    await sql.close();
    console.log('\n🔌 Database connection closed successfully');
    
    console.log('\n🎉 SUCCESS: Database connection working perfectly!');
    console.log('Bây giờ bạn có thể chạy backend server!');
    
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Full error:', err);
  }
}

testConnection(); 