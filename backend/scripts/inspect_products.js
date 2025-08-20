require('dotenv').config();
const { sql, config } = require('../db');

async function main() {
	try {
		console.log('DB:', { user: config.user, server: config.server, database: config.database, port: config.port });
		await sql.connect(config);
		const total = await sql.query('SELECT COUNT(*) AS total FROM Products');
		console.log('Total products:', total.recordset[0].total);
		const sample = await sql.query("SELECT TOP 20 ProductID, Name FROM Products ORDER BY ProductID DESC");
		console.log('Latest products:');
		sample.recordset.forEach(r => console.log(` - [${r.ProductID}] ${r.Name}`));
	} catch (e) {
		console.error('Error:', e.message);
	} finally {
		try { await sql.close(); } catch {}
	}
}

main();
