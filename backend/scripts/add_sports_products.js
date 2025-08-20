const { sql, config } = require('../db');

async function main() {
  let pool;
  try {
    console.log('🔌 Connecting to database...');
    pool = await sql.connect(config);
    console.log('✅ Connected');

    // Update some athletic shoes to SPORTS
    const updateQuery = `
      UPDATE Products 
      SET Gender = 'SPORTS' 
      WHERE ProductID IN (
        SELECT TOP 15 ProductID 
        FROM Products 
        WHERE Gender = 'MEN' 
        AND BrandID IN (1, 2) -- Nike and Adidas
        AND (
          Name LIKE '%Air Zoom%' OR 
          Name LIKE '%Air Max%' OR 
          Name LIKE '%Ultraboost%' OR 
          Name LIKE '%NMD%' OR
          Name LIKE '%Yeezy%'
        )
        ORDER BY ProductID
      )
    `;
    
    const result = await pool.request().query(updateQuery);
    console.log(`✅ Updated ${result.rowsAffected?.[0] || 0} products to SPORTS`);

    // Show updated distribution
    const distributionQuery = `
      SELECT Gender, COUNT(*) as Count
      FROM Products 
      GROUP BY Gender
      ORDER BY Gender
    `;
    
    const distribution = await pool.request().query(distributionQuery);
    console.log('\n📊 Updated Gender Distribution:');
    distribution.recordset.forEach(row => {
      console.log(`   ${row.Gender}: ${row.Count} products`);
    });

    // Show some SPORTS products
    const sportsQuery = `
      SELECT TOP 10 ProductID, Name, BrandID, Gender
      FROM Products 
      WHERE Gender = 'SPORTS'
      ORDER BY ProductID
    `;
    
    const sportsProducts = await pool.request().query(sportsQuery);
    console.log('\n🏃 SPORTS Products:');
    sportsProducts.recordset.forEach(row => {
      console.log(`   ID: ${row.ProductID}, Name: "${row.Name}", BrandID: ${row.BrandID}`);
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
