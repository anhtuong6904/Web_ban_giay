const sql = require('mssql');
const fs = require('fs');
const path = require('path');
// Load env from backend/.env if present
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
  } else {
    require('dotenv').config();
  }
} catch (_) {}

// Database configuration (match backend/db.js)
const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Giakiet@123',
  server: process.env.DB_SERVER || 'DESKTOP-3UR600M',
  database: process.env.DB_DATABASE || 'shopgiay',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Function to create slug from product name
function createSlug(name) {
  if (!name) return '';
  return String(name)
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Function to create folder and placeholder images
function createProductFolder(productName, productId) {
  const slug = createSlug(productName);
  if (!slug) {
    console.log(`❌ Cannot create slug for product: ${productName}`);
    return;
  }

  const folderPath = path.join(__dirname, '../../public/images/products', slug);
  
  try {
    // Create folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`✅ Created folder: ${slug}`);
    } else {
      console.log(`ℹ️  Folder already exists: ${slug}`);
    }

    // Create placeholder images if they don't exist
    const imageFiles = ['1.png', '2.png', '3.png'];
    imageFiles.forEach(filename => {
      const imagePath = path.join(folderPath, filename);
      if (!fs.existsSync(imagePath)) {
        // Create a simple placeholder image (1x1 pixel transparent PNG)
        const placeholderBuffer = Buffer.from([
          0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
          0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
          0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
          0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
          0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
          0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        fs.writeFileSync(imagePath, placeholderBuffer);
        console.log(`  📁 Created placeholder: ${filename}`);
      } else {
        console.log(`  ℹ️  Image already exists: ${filename}`);
      }
    });

  } catch (error) {
    console.error(`❌ Error creating folder for ${productName}:`, error.message);
  }
}

async function main() {
  try {
    console.log('🔌 Connecting to database...');
    const pool = await sql.connect(config);
    console.log('✅ Connected to database');

    // Get all products
    const result = await pool.request().query(`
      SELECT ProductID, Name, ImageURL, MainImage 
      FROM Products 
      ORDER BY ProductID
    `);

    console.log(`📦 Found ${result.recordset.length} products`);
    console.log('🏗️  Creating missing folders...\n');

    let createdCount = 0;
    let existingCount = 0;

    for (const product of result.recordset) {
      const slug = createSlug(product.Name);
      const folderPath = path.join(__dirname, '../../public/images/products', slug);
      
      if (!fs.existsSync(folderPath)) {
        createProductFolder(product.Name, product.ProductID);
        createdCount++;
      } else {
        console.log(`ℹ️  Folder exists: ${slug}`);
        existingCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Created: ${createdCount} folders`);
    console.log(`ℹ️  Existing: ${existingCount} folders`);
    console.log(`📁 Total: ${createdCount + existingCount} folders`);

    await pool.close();
    console.log('\n🔌 Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createProductFolder, createSlug };
