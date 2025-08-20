require('dotenv').config();
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
    
    // Test query
    const result = await sql.query('SELECT COUNT(*) as total FROM Products');
    console.log('📊 Total products in database:', result.recordset[0].total);
    
    // Test brands
    const brands = await sql.query('SELECT * FROM Brands');
    console.log('🏷️ Brands found:', brands.recordset.length);
    brands.recordset.forEach(brand => {
      console.log(`  - ${brand.Name}`);
    });
    
    // Test categories
    const categories = await sql.query('SELECT * FROM Categories');
    console.log('📁 Categories found:', categories.recordset.length);
    categories.recordset.forEach(cat => {
      console.log(`  - ${cat.Name}`);
    });
    
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  } finally {
    try {
      await sql.close();
      console.log('🔌 Connection closed');
    } catch (closeErr) {
      console.error('Error closing connection:', closeErr);
    }
  }
}

testConnection();
