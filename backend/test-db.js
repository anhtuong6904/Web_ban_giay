const { sql, config } = require('./db');

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    console.log('Config:', {
      user: config.user,
      server: config.server,
      database: config.database,
      port: config.port
    });
    
    await sql.connect(config);
    console.log('✅ Database connected successfully!');
    
    // Test query đơn giản
    const result = await sql.query('SELECT COUNT(*) as count FROM Products');
    console.log('📊 Products count:', result.recordset[0].count);
    
    // Test query sản phẩm đầu tiên
    const product = await sql.query('SELECT TOP 1 * FROM Products');
    if (product.recordset.length > 0) {
      console.log('📦 First product:', product.recordset[0].Name);
    }
    
    await sql.close();
    console.log('🔌 Connection closed');
    
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Full error:', err);
  }
}

testConnection(); 