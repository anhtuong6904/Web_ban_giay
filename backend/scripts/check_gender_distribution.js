const { sql, config } = require('../db');

async function main() {
  let pool;
  try {
    console.log('🔌 Connecting to database...');
    pool = await sql.connect(config);
    console.log('✅ Connected');

    // Check current gender distribution
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

    // Check if we need to add SPORTS products
    const sportsCount = distribution.recordset.find(r => r.Gender === 'SPORTS')?.Count || 0;
    
    if (sportsCount === 0) {
      console.log('\n⚠️  No SPORTS products found. Adding some...');
      
      // Update some running shoes to SPORTS
      const updateQuery = `
        UPDATE TOP(10) Products 
        SET Gender = 'SPORTS' 
        WHERE Gender = 'MEN' 
        AND (Name LIKE '%Running%' OR Name LIKE '%Sport%' OR Name LIKE '%Athletic%')
      `;
      
      const result = await pool.request().query(updateQuery);
      console.log(`✅ Updated ${result.rowsAffected?.[0] || 0} products to SPORTS`);
      
      // Show updated distribution
      const updatedDistribution = await pool.request().query(distributionQuery);
      console.log('\n📊 Updated Gender Distribution:');
      updatedDistribution.recordset.forEach(row => {
        console.log(`   ${row.Gender}: ${row.Count} products`);
      });
    } else {
      console.log(`\n✅ Already have ${sportsCount} SPORTS products`);
    }

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
