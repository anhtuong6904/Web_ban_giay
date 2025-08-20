const { sql, config } = require('../db');

async function main() {
  let pool;
  try {
    console.log('🔌 Connecting to database...');
    pool = await sql.connect(config);
    console.log('✅ Connected');

    const query = `
      UPDATE p
      SET Price = calc.Price
      FROM Products p
      LEFT JOIN Brands b ON p.BrandID = b.BrandID
      CROSS APPLY (
        SELECT 
          BaseMin = CASE b.Name
            WHEN 'Nike' THEN 2500000
            WHEN 'Adidas' THEN 2200000
            WHEN 'Converse' THEN 1000000
            WHEN 'Puma' THEN 1400000
            WHEN 'New Balance' THEN 2300000
            ELSE 1500000
          END,
          BaseMax = CASE b.Name
            WHEN 'Nike' THEN 3600000
            WHEN 'Adidas' THEN 3200000
            WHEN 'Converse' THEN 2000000
            WHEN 'Puma' THEN 2400000
            WHEN 'New Balance' THEN 3000000
            ELSE 2600000
          END,
          R1 = ABS(CHECKSUM(NEWID()))
      ) rnd
      CROSS APPLY (
        SELECT Price = ROUND( (rnd.BaseMin + (rnd.R1 % (rnd.BaseMax - rnd.BaseMin + 1))), -3 )
      ) calc
      WHERE (p.Price IS NULL OR p.Price = 0);
    `;

    const res = await pool.request().query(query);
    const remain = await pool.request().query(`SELECT COUNT(*) AS cnt FROM Products WHERE Price IS NULL OR Price = 0`);

    console.log(`✅ Rows updated: ${res.rowsAffected?.[0] || 0}`);
    console.log(`📊 Remaining zero-price: ${remain.recordset[0].cnt}`);
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
