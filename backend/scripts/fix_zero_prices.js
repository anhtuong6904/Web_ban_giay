const fs = require('fs');
const path = require('path');
const { sql, config } = require('../db');

async function columnExists(pool, table, column) {
	const res = await pool
		.request()
		.input('table', sql.NVarChar, table)
		.input('column', sql.NVarChar, column)
		.query(`
			SELECT COUNT(*) AS cnt
			FROM sys.columns c
			JOIN sys.tables t ON c.object_id = t.object_id
			WHERE t.name = @table AND c.name = @column
		`);
	return (res.recordset?.[0]?.cnt || 0) > 0;
}

async function main() {
	let pool;
	try {
		console.log('🔌 Connecting to database...');
		pool = await sql.connect(config);
		console.log('✅ Connected');

		const hasOriginalPrice = await columnExists(pool, 'Products', 'OriginalPrice');
		const hasDiscount = await columnExists(pool, 'Products', 'Discount');

		console.log(`Schema flags -> hasOriginalPrice: ${hasOriginalPrice}, hasDiscount: ${hasDiscount}`);

		let updated = 0;
		if (hasOriginalPrice && hasDiscount) {
			const q = `
			UPDATE p
			SET 
				OriginalPrice = calc.OriginalPrice,
				Discount = calc.Discount,
				Price = calc.Price
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
					R1 = ABS(CHECKSUM(NEWID())),
					R2 = ABS(CHECKSUM(NEWID()))
			) rnd
			CROSS APPLY (
				SELECT 
					OriginalPrice = ROUND( (rnd.BaseMin + (rnd.R1 % (rnd.BaseMax - rnd.BaseMin + 1))), -3 ),
					Discount = (rnd.R2 % 26)
			) d
			CROSS APPLY (
				SELECT Price = CASE WHEN d.Discount = 0 THEN d.OriginalPrice ELSE ROUND(d.OriginalPrice * (100 - d.Discount) / 100.0, -3) END
			) calc
			WHERE (p.Price IS NULL OR p.Price = 0);`;
			const res = await pool.request().query(q);
			updated = res.rowsAffected?.[0] || 0;
		} else {
			const q = `
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
			WHERE (p.Price IS NULL OR p.Price = 0);`;
			const res = await pool.request().query(q);
			updated = res.rowsAffected?.[0] || 0;
		}

		const remain = await pool.request().query(`SELECT COUNT(*) AS cnt FROM Products WHERE Price IS NULL OR Price = 0`);
		console.log(`✅ Updated rows: ${updated}`);
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
