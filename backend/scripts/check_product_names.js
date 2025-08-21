const { sql, config } = require('../db');

async function main() {
  let pool;
  try {
    console.log('🔌 Connecting to database...');
    pool = await sql.connect(config);
    console.log('✅ Connected');

    // Check product names to find suitable ones for SPORTS
    const namesQuery = `
      SELECT TOP 20 ProductID, Name, Gender, BrandID
      FROM Products 
      ORDER BY ProductID
    `;
    
    const products = await pool.request().query(namesQuery);
    console.log('\n📋 Sample Product Names:');
    products.recordset.forEach(row => {
      console.log(`   ID: ${row.ProductID}, Name: "${row.Name}", Gender: ${row.Gender}, BrandID: ${row.BrandID}`);
    });

    // Check brand names
    const brandsQuery = `SELECT BrandID, Name FROM Brands ORDER BY BrandID`;
    const brands = await pool.request().query(brandsQuery);
    console.log('\n🏷️  Available Brands:');
    brands.recordset.forEach(row => {
      console.log(`   BrandID: ${row.BrandID}, Name: ${row.Name}`);
    });

  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  } finally {
    try { await sql.close(); } catch (_) {}
  }
}

if (require.main === module) {
  main();
}
