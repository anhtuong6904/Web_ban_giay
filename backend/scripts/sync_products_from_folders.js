require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sql, config } = require('../db');

function slugToName(slug) {
	return slug.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildImagePaths(slug) {
	const base = `/images/products/${slug}`;
	return {
		main: `${base}/1.png`,
		thumbs: JSON.stringify([`${base}/1.png`, `${base}/2.png`, `${base}/3.png`]),
		details: JSON.stringify([`${base}/1.png`, `${base}/2.png`, `${base}/3.png`])
	};
}

async function getProductsTableSchema() {
	const result = await sql.query(`
		SELECT c.COLUMN_NAME, c.IS_NULLABLE, c.DATA_TYPE
		FROM INFORMATION_SCHEMA.COLUMNS c
		WHERE c.TABLE_NAME = 'Products'
	`);
	const schema = {};
	for (const row of result.recordset) {
		schema[row.COLUMN_NAME] = {
			isNullable: row.IS_NULLABLE === 'YES',
			dataType: row.DATA_TYPE
		};
	}
	return schema;
}

async function getExistingProductNames() {
	const result = await sql.query(`SELECT Name FROM Products`);
	return new Set(result.recordset.map(r => (r.Name || '').toLowerCase().trim()));
}

function getAllProductSlugs() {
	const productsDir = path.join(__dirname, '..', '..', 'public', 'images', 'products');
	if (!fs.existsSync(productsDir)) return [];
	return fs.readdirSync(productsDir)
		.filter(item => fs.statSync(path.join(productsDir, item)).isDirectory());
}

function pick(obj, keys) {
	const out = {};
	for (const k of keys) if (k in obj) out[k] = obj[k];
	return out;
}

async function insertProductIfMissing(schema, name, slug) {
	const images = buildImagePaths(slug);

	// Tập cột khả dụng theo schema hiện tại
	const availableColumns = new Set(Object.keys(schema));

	// Các cột mặc định nếu tồn tại trong bảng
	const candidateValues = {
		Name: name,
		MainImage: images.main,
		ThumbnailImages: images.thumbs,
		DetailImages: images.details,
		Description: `Auto-added for ${name}`,
		Price: 0,
		OriginalPrice: 0,
		Discount: 0,
		InStock: 1,
		StockQuantity: 0,
		BrandID: null,
		CategoryID: null,
		Gender: 'UNISEX',
		Rating: 0,
		ImageUpdatedAt: new Date(),
		CreatedAt: new Date(),
		UpdatedAt: new Date()
	};

	// Loại trừ các cột không có trong bảng
	const values = pick(candidateValues, Object.keys(candidateValues).filter(k => availableColumns.has(k)));

	// Loại trừ ProductID nếu có
	delete values.ProductID;

	// Tạo câu INSERT động theo các cột hiện có
	const columns = Object.keys(values);
	const params = columns.map((_, idx) => `@p${idx}`);
	const request = new sql.Request();
	columns.forEach((col, idx) => {
		let val = values[col];
		// Chuyển đổi kiểu phù hợp
		if (val instanceof Date) {
			request.input(`p${idx}`, sql.DateTime, val);
		} else if (typeof val === 'number') {
			request.input(`p${idx}`, sql.Decimal(18, 2), val);
		} else if (typeof val === 'string') {
			request.input(`p${idx}`, sql.NVarChar(sql.MAX), val);
		} else if (val === null) {
			request.input(`p${idx}`, null);
		} else {
			request.input(`p${idx}`, sql.NVarChar(sql.MAX), String(val));
		}
	});

	const insertSql = `INSERT INTO Products (${columns.join(', ')}) VALUES (${params.join(', ')})`;
	await request.query(insertSql);
}

async function main() {
	try {
		console.log('🔌 Kết nối database...');
		await sql.connect(config);
		console.log('✅ Đã kết nối');

		console.log('📐 Đọc schema bảng Products...');
		const schema = await getProductsTableSchema();

		console.log('🗂️  Đọc thư mục ảnh...');
		const slugs = getAllProductSlugs();
		console.log(`🔎 Tìm thấy ${slugs.length} thư mục sản phẩm`);

		console.log('📦 Đọc danh sách sản phẩm hiện có trong DB...');
		const existing = await getExistingProductNames();
		console.log(`📊 DB hiện có ${existing.size} sản phẩm`);

		let inserted = 0;
		let skipped = 0;
		for (const slug of slugs) {
			const name = slugToName(slug);
			if (existing.has(name.toLowerCase())) {
				skipped++;
				continue;
			}
			try {
				await insertProductIfMissing(schema, name, slug);
				console.log(`✅ Đã thêm sản phẩm: ${name}`);
				inserted++;
			} catch (e) {
				console.error(`❌ Lỗi thêm ${name}:`, e.message);
			}
		}

		console.log('\n🎉 Hoàn tất!');
		console.log(`✅ Đã thêm mới: ${inserted}`);
		console.log(`ℹ️  Bỏ qua (đã tồn tại): ${skipped}`);
	} catch (err) {
		console.error('❌ Lỗi:', err);
	} finally {
		try { await sql.close(); } catch {}
	}
}

main();
