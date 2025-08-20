require('dotenv').config();
const { sql, config } = require('../db');

async function columnExists(table, column) {
	const res = await sql.query`
		SELECT 1 AS existsCol
		FROM INFORMATION_SCHEMA.COLUMNS 
		WHERE TABLE_NAME = ${table} AND COLUMN_NAME = ${column}
	`;
	return res.recordset.length > 0;
}

async function exec(query) {
	await sql.query(query);
}

async function main() {
	try {
		console.log('Connecting to DB:', { user: config.user, server: config.server, database: config.database, port: config.port });
		await sql.connect(config);

		const hasGender = await columnExists('Products', 'Gender');
		if (!hasGender) {
			console.log('Gender column not found. Adding...');
			await exec('ALTER TABLE dbo.Products ADD Gender NVARCHAR(20) NULL;');
			console.log('Gender column added.');
		} else {
			console.log('Gender column already exists.');
		}

		console.log('Setting default Gender = UNISEX for NULL/blank...');
		await exec(`UPDATE dbo.Products SET Gender = 'UNISEX' 
			WHERE Gender IS NULL OR LTRIM(RTRIM(COALESCE(Gender, ''))) = ''`);

		console.log('Updating WOMEN by name patterns...');
		await exec(`UPDATE dbo.Products SET Gender = 'WOMEN'
			WHERE Name LIKE '%Women%' OR Name LIKE '%Wmns%' OR Name LIKE '%WMNS%' OR Name LIKE '%W%'`);

		console.log('Updating KIDS by name patterns...');
		await exec(`UPDATE dbo.Products SET Gender = 'KIDS'
			WHERE Name LIKE '%Kids%' OR Name LIKE '%GS%' OR Name LIKE '%PS%' OR Name LIKE '%TD%' OR Name LIKE '%Y%'`);

		console.log('Updating MEN for remaining UNISEX by brand prefixes...');
		await exec(`UPDATE dbo.Products SET Gender = 'MEN'
			WHERE Gender = 'UNISEX' AND (Name LIKE 'Nike %' OR Name LIKE 'Adidas %' OR Name LIKE 'Converse %' OR Name LIKE 'Puma %' OR Name LIKE 'New Balance %')`);

		const summary = await sql.query`SELECT Gender, COUNT(*) AS Total FROM dbo.Products GROUP BY Gender`;
		console.log('Summary by Gender:');
		summary.recordset.forEach(r => console.log(` - ${r.Gender}: ${r.Total}`));

		console.log('Done.');
	} catch (e) {
		console.error('Failed:', e);
		process.exitCode = 1;
	} finally {
		try { await sql.close(); } catch {}
	}
}

main();
