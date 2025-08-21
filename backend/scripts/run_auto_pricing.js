const fs = require('fs');
const path = require('path');
const { sql, config } = require('../db');

function splitSqlBatches(sqlText) {
	return sqlText
		.replace(/\r\n/g, '\n')
		.split(/^[\t ]*GO[\t ]*$/gim)
		.map(s => s.trim())
		.filter(Boolean);
}

async function run() {
	let pool;
	try {
		const filePath = path.join(__dirname, '../sql/auto_classify_and_price.sql');
		if (!fs.existsSync(filePath)) {
			console.error('❌ SQL file not found:', filePath);
			process.exit(1);
		}
		const sqlText = fs.readFileSync(filePath, 'utf8');
		const batches = splitSqlBatches(sqlText);
		console.log(`📄 Loaded SQL with ${batches.length} batches`);

		console.log('🔌 Connecting to database...');
		pool = await sql.connect(config);
		console.log('✅ Connected');

		for (let i = 0; i < batches.length; i++) {
			const batch = batches[i];
			if (!batch) continue;
			try {
				await pool.request().batch ? await pool.request().batch(batch) : await pool.request().query(batch);
				console.log(`✔️  Executed batch ${i + 1}/${batches.length}`);
			} catch (e) {
				console.log(`⚠️  Batch ${i + 1} failed with error: ${e.message}. Trying query() fallback...`);
				try {
					await pool.request().query(batch);
					console.log(`✔️  Executed batch ${i + 1} via query()`);
				} catch (e2) {
					console.error(`❌ Failed batch ${i + 1}:`, e2.message);
					throw e2;
				}
			}
		}

		console.log('🎉 Done.');
	} catch (e) {
		console.error('❌ Error:', e.message);
		process.exit(1);
	} finally {
		try { await sql.close(); } catch (_) {}
	}
}

if (require.main === module) {
	run();
}
