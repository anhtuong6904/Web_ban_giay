require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sql, config } = require('../db');

async function runBatches(sqlText) {
	// Split by GO on its own line (case-insensitive)
	const batches = sqlText
		.replace(/\r\n/g, '\n')
		.split(/^[ \t]*GO[ \t]*$/gim)
		.map(s => s.trim())
		.filter(Boolean);

	for (let i = 0; i < batches.length; i++) {
		const batch = batches[i];
		try {
			await sql.query(batch);
			console.log(`✔ Executed batch ${i + 1}/${batches.length}`);
		} catch (err) {
			console.error(`✖ Error in batch ${i + 1}:`, err.message);
			throw err;
		}
	}
}

async function main() {
	const filePath = path.join(__dirname, '..', 'sql', 'auto_classify_and_price.sql');
	if (!fs.existsSync(filePath)) {
		console.error('SQL file not found:', filePath);
		process.exit(1);
	}
	const sqlText = fs.readFileSync(filePath, 'utf8');

	try {
		console.log('🔌 Connecting to database with config:', {
			user: config.user,
			server: config.server,
			database: config.database,
			port: config.port
		});
		await sql.connect(config);
		console.log('✅ Connected');
		await runBatches(sqlText);
		console.log('🎉 Done');
	} catch (err) {
		console.error('❌ Failed:', err);
		process.exitCode = 1;
	} finally {
		try { await sql.close(); } catch {}
	}
}

main();
