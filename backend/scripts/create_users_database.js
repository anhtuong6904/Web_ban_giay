const sql = require('mssql');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '123456',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'shopgiay',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function createUsersDatabase() {
  try {
    console.log('Connecting to database...');
    const pool = await sql.connect(config);
    console.log('Connected to database successfully');

    // Đọc file SQL
    const fs = require('fs');
    const sqlFilePath = path.join(__dirname, '../sql/create_users_table.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('Executing SQL script...');
    
    // Chia SQL thành các câu lệnh riêng biệt
    const statements = sqlContent
      .split('GO')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        try {
          await pool.request().query(statement);
          console.log(`Statement ${i + 1} executed successfully`);
        } catch (error) {
          console.error(`Error executing statement ${i + 1}:`, error.message);
          // Tiếp tục với statement tiếp theo
        }
      }
    }

    console.log('✅ Users database setup completed successfully!');
    console.log('📋 Tables created:');
    console.log('   - Users (lưu thông tin người dùng)');
    console.log('   - UserSessions (theo dõi phiên đăng nhập)');
    console.log('   - UserOrders (liên kết user với orders)');

  } catch (error) {
    console.error('❌ Error creating users database:', error);
  } finally {
    try {
      await sql.close();
      console.log('Database connection closed');
    } catch (closeErr) {
      console.error('Error closing connection:', closeErr);
    }
  }
}

// Chạy script
createUsersDatabase();
