const { sql, config } = require('../db');

async function main() {
  let pool;
  try {
    console.log('🔌 Connecting to database...');
    pool = await sql.connect(config);
    console.log('✅ Connected');

    // Update UNISEX to SPORTS
    const updateQuery = `
      UPDATE Products 
      SET Gender = 'SPORTS' 
      WHERE Gender = 'UNISEX'
    `;
    
    const result = await pool.request().query(updateQuery);
    console.log(`✅ Updated ${result.rowsAffected?.[0] || 0} products from UNISEX to SPORTS`);

    // Show current gender distribution
    const distributionQuery = `
      SELECT Gender, COUNT(*) as Count
      FROM Products 
      GROUP BY Gender
      ORDER BY Gender
    `;
    
    const distribution = await pool.request().query(distributionQuery);
    console.log('\n📊 Current Gender Distribution:');
    distribution.recordset.forEach(row => {
      console.log(`   ${row.Gender}: ${row.Count} products`);
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
