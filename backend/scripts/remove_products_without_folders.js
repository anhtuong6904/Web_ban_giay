const fs = require('fs');
const path = require('path');
const sql = require('mssql');

// Load env from backend/.env if present
try {
	const envPath = path.join(__dirname, '..', '.env');
	if (fs.existsSync(envPath)) {
		require('dotenv').config({ path: envPath });
	} else {
		require('dotenv').config();
	}
} catch (_) {}

// Match backend/db.js config
const config = {
	user: process.env.DB_USER || 'sa',
	password: process.env.DB_PASSWORD || 'Giakiet@123',
	server: process.env.DB_SERVER || 'DESKTOP-3UR600M',
	database: process.env.DB_DATABASE || 'shopgiay',
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
	options: { encrypt: false, trustServerCertificate: true }
};

function createSlug(name) {
	if (!name) return '';
	return String(name)
		.trim()
		.replace(/[^a-zA-Z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

async function columnExists(pool, columnName) {
	const result = await pool
		.request()
		.input('col', sql.NVarChar, columnName)
		.query(`SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Products' AND COLUMN_NAME = @col`);
	return result.recordset[0].cnt > 0;
}

async function main() {
	const yesFlag = process.argv.includes('--yes');
	const baseFolder = path.join(__dirname, '../../public/images/products');

	if (!fs.existsSync(baseFolder)) {
		console.error(`❌ Folder not found: ${baseFolder}`);
		process.exit(1);
	}

	console.log('🔌 Connecting to database...');
	const pool = await sql.connect(config);
	console.log('✅ Connected');

	const productsRes = await pool.request().query(`SELECT ProductID, Name FROM Products ORDER BY ProductID`);
	const products = productsRes.recordset;
	console.log(`📦 Loaded ${products.length} products`);

	const missing = [];
	for (const p of products) {
		const slug = createSlug(p.Name);
		const folder = path.join(baseFolder, slug);
		if (!fs.existsSync(folder)) {
			missing.push({ id: p.ProductID, name: p.Name, slug });
		}
	}

	if (missing.length === 0) {
		console.log('✅ All products have folders. Nothing to delete.');
		await pool.close();
		return;
	}

	console.log(`⚠️ ${missing.length} products have no folder:`);
	missing.slice(0, 20).forEach((m) => console.log(` - [${m.id}] ${m.name} -> ${m.slug}`));
	if (missing.length > 20) console.log(`   ... and ${missing.length - 20} more`);

	if (!yesFlag) {
		console.log('\nRun with --yes to delete them.');
		await pool.close();
		return;
	}

	// Prefer soft delete if IsActive exists
	const hasIsActive = await columnExists(pool, 'IsActive');
	const ids = missing.map((m) => m.id);
	let affected = 0;
	if (hasIsActive) {
		const res = await pool.request().query(`UPDATE Products SET IsActive = 0 WHERE ProductID IN (${ids.join(',')})`);
		affected = res.rowsAffected?.[0] || 0;
		console.log(`📝 Soft-deactivated ${affected} products (IsActive = 0).`);
	} else {
		// Hard delete in chunks to avoid parameter limits
		const chunkSize = 100;
		for (let i = 0; i < ids.length; i += chunkSize) {
			const chunk = ids.slice(i, i + chunkSize);
			try {
				const res = await pool.request().query(`DELETE FROM Products WHERE ProductID IN (${chunk.join(',')})`);
				affected += res.rowsAffected?.[0] || 0;
			} catch (e) {
				console.error(`❌ Delete failed for ids [${chunk.join(', ')}]: ${e.message}`);
			}
		}
		console.log(`🗑️  Hard-deleted ${affected} products.`);
	}

	await pool.close();
	console.log('🔌 Connection closed');
}

if (require.main === module) {
	main().catch((e) => {
		console.error('❌ Error:', e.message);
		process.exit(1);
	});
}
