const express = require('express');
const cors = require('cors');
const { sql, config } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint để kiểm tra server
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// API lấy tất cả danh mục
app.get('/api/categories', async (req, res) => {
  try {
    console.log('Connecting to database...');
    await sql.connect(config);
    console.log('Database connected successfully');
    
    const query = `
      SELECT 
        c.CategoryID,
        c.Name,
        c.Description,
        c.Image,
        c.ParentCategoryID,
        c.SortOrder,
        c.IsActive,
        COUNT(pc.ProductID) as ProductCount
      FROM Categories c
      LEFT JOIN ProductCategories pc ON c.CategoryID = pc.CategoryID
      WHERE c.IsActive = 1
      GROUP BY c.CategoryID, c.Name, c.Description, c.Image, c.ParentCategoryID, c.SortOrder, c.IsActive
      ORDER BY c.SortOrder, c.Name
    `;
    
    console.log('Executing query:', query);
    const result = await sql.query(query);
    console.log(`Found ${result.recordset.length} categories`);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi truy vấn SQL:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try {
      await sql.close();
      console.log('Database connection closed');
    } catch (closeErr) {
      console.error('Error closing connection:', closeErr);
    }
  }
});

// API lấy tất cả danh mục giới tính
app.get('/api/genders', async (req, res) => {
  try {
    console.log('Connecting to database...');
    await sql.connect(config);
    console.log('Database connected successfully');
    
    const query = `
      SELECT 
        gc.GenderCategoryID,
        gc.Name,
        gc.Description,
        gc.SortOrder,
        gc.IsActive,
        COUNT(pg.ProductID) as ProductCount
      FROM GenderCategories gc
      LEFT JOIN ProductGenders pg ON gc.GenderCategoryID = pg.GenderCategoryID
      WHERE gc.IsActive = 1
      GROUP BY gc.GenderCategoryID, gc.Name, gc.Description, gc.SortOrder, gc.IsActive
      ORDER BY gc.SortOrder, gc.Name
    `;
    
    console.log('Executing query:', query);
    const result = await sql.query(query);
    console.log(`Found ${result.recordset.length} gender categories`);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi truy vấn SQL:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try {
      await sql.close();
      console.log('Database connection closed');
    } catch (closeErr) {
      console.error('Error closing connection:', closeErr);
    }
  }
});

// API lấy tất cả sản phẩm với filter linh hoạt
app.get('/api/products', async (req, res) => {
  try {
    console.log('Connecting to database...');
    await sql.connect(config);
    console.log('Database connected successfully');
    
    const { category, gender, brand, sale, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereConditions = ['p.InStock = 1'];
    let joinTables = [];
    
    // Thêm filter theo danh mục
    if (category) {
      joinTables.push('LEFT JOIN ProductCategories pc ON p.ProductID = pc.ProductID');
      joinTables.push('LEFT JOIN Categories c ON pc.CategoryID = c.CategoryID');
      whereConditions.push(`c.Name LIKE '%${category}%'`);
    }
    
    // Thêm filter theo giới tính
    if (gender) {
      joinTables.push('LEFT JOIN ProductGenders pg ON p.ProductID = pg.ProductID');
      joinTables.push('LEFT JOIN GenderCategories gc ON pg.GenderCategoryID = gc.GenderCategoryID');
      whereConditions.push(`gc.Name = '${gender}'`);
    }
    
    // Thêm filter theo thương hiệu
    if (brand) {
      whereConditions.push(`p.BrandID = ${parseInt(brand)}`);
    }
    
    // Thêm filter theo khuyến mãi
    if (sale === 'true') {
      whereConditions.push(`p.Discount > 0`);
    }
    
    // Thêm filter theo tìm kiếm
    if (search) {
      whereConditions.push(`(p.Name LIKE '%${search}%' OR p.Description LIKE '%${search}%')`);
    }
    
    const whereClause = whereConditions.join(' AND ');
    const joinClause = joinTables.length > 0 ? joinTables.join(' ') : '';
    
    const query = `
      SELECT DISTINCT
        p.ProductID,
        p.Name,
        p.Price,
        p.OriginalPrice,
        p.Discount,
        p.MainImage,
        p.Description,
        p.InStock,
        p.StockQuantity,
        b.Name as BrandName,
        b.Logo as BrandLogo
      FROM Products p
      LEFT JOIN Brands b ON p.BrandID = b.BrandID
      ${joinClause}
      WHERE ${whereClause}
      ORDER BY p.ProductID
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;
    
    console.log('Executing query:', query);
    const result = await sql.query(query);
    console.log(`Found ${result.recordset.length} products`);
    
    // Lấy tổng số sản phẩm để tính pagination
    const countQuery = `
      SELECT COUNT(DISTINCT p.ProductID) as TotalCount
      FROM Products p
      ${joinClause}
      WHERE ${whereClause}
    `;
    
    const countResult = await sql.query(countQuery);
    const totalCount = countResult.recordset[0].TotalCount;
    
    res.json({
      products: result.recordset,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalProducts: totalCount,
        productsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Lỗi truy vấn SQL:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try {
      await sql.close();
      console.log('Database connection closed');
    } catch (closeErr) {
      console.error('Error closing connection:', closeErr);
    }
  }
});

// API lấy thông tin chi tiết sản phẩm theo ID
app.get('/api/products/:id', async (req, res) => {
  try {
    console.log(`Fetching product with ID: ${req.params.id}`);
    console.log('Connecting to database...');
    await sql.connect(config);
    console.log('Database connected successfully');
    
    const { id } = req.params;
    
    // Query sản phẩm với thông tin danh mục và giới tính
    const query = `
      SELECT 
        p.*,
        b.Name as BrandName,
        b.Logo as BrandLogo,
        STRING_AGG(DISTINCT c.Name, ', ') AS Categories,
        STRING_AGG(DISTINCT gc.Name, ', ') AS Genders
      FROM Products p
      LEFT JOIN Brands b ON p.BrandID = b.BrandID
      LEFT JOIN ProductCategories pc ON p.ProductID = pc.ProductID
      LEFT JOIN Categories c ON pc.CategoryID = c.CategoryID
      LEFT JOIN ProductGenders pg ON p.ProductID = pg.ProductID
      LEFT JOIN GenderCategories gc ON pg.GenderCategoryID = gc.GenderCategoryID
      WHERE p.ProductID = @ProductID
      GROUP BY 
        p.ProductID, p.Name, p.BrandID, p.CategoryID, p.Price, p.OriginalPrice, 
        p.Discount, p.Description, p.MainImage, p.Rating, p.Reviews, p.InStock, 
        p.StockQuantity, p.CreatedAt, p.UpdatedAt, p.ThumbnailImages, p.DetailImages, 
        p.ColorImages, p.ImageUpdatedAt, b.Name, b.Logo
    `;
    
    console.log('Executing query:', query);
    const result = await sql.query(query, { ProductID: parseInt(id) });
    console.log(`Found ${result.recordset.length} products with ID ${id}`);
    
    if (result.recordset.length === 0) {
      console.log(`Product with ID ${id} not found`);
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }
    
    const product = result.recordset[0];
    console.log('Product found:', product.Name);
    
    res.json(product);
  } catch (err) {
    console.error('Lỗi truy vấn SQL:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try {
      await sql.close();
      console.log('Database connection closed');
    } catch (closeErr) {
      console.error('Error closing connection:', closeErr);
    }
  }
});

// API lấy sản phẩm theo danh mục cụ thể
app.get('/api/categories/:categoryName/products', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    console.log(`Fetching products for category: ${categoryName}`);
    console.log('Connecting to database...');
    await sql.connect(config);
    console.log('Database connected successfully');
    
    const query = `
      SELECT DISTINCT
        p.ProductID,
        p.Name,
        p.Price,
        p.OriginalPrice,
        p.Discount,
        p.MainImage,
        p.Description,
        p.InStock,
        p.StockQuantity,
        b.Name as BrandName
      FROM Products p
      LEFT JOIN Brands b ON p.BrandID = b.BrandID
      LEFT JOIN ProductCategories pc ON p.ProductID = pc.ProductID
      LEFT JOIN Categories c ON pc.CategoryID = c.CategoryID
      WHERE c.Name LIKE '%${categoryName}%' AND p.InStock = 1
      ORDER BY p.ProductID
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;
    
    console.log('Executing query:', query);
    const result = await sql.query(query);
    console.log(`Found ${result.recordset.length} products in category ${categoryName}`);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi truy vấn SQL:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try {
      await sql.close();
      console.log('Database connection closed');
    } catch (closeErr) {
      console.error('Error closing connection:', closeErr);
    }
  }
});

// API lấy sản phẩm theo giới tính
app.get('/api/genders/:gender/products', async (req, res) => {
  try {
    const { gender } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    console.log(`Fetching products for gender: ${gender}`);
    console.log('Connecting to database...');
    await sql.connect(config);
    console.log('Database connected successfully');
    
    const query = `
      SELECT DISTINCT
        p.ProductID,
        p.Name,
        p.Price,
        p.OriginalPrice,
        p.Discount,
        p.MainImage,
        p.Description,
        p.InStock,
        p.StockQuantity,
        b.Name as BrandName
      FROM Products p
      LEFT JOIN Brands b ON p.BrandID = b.BrandID
      LEFT JOIN ProductGenders pg ON p.ProductID = pg.ProductID
      LEFT JOIN GenderCategories gc ON pg.GenderCategoryID = gc.GenderCategoryID
      WHERE gc.Name = '${gender}' AND p.InStock = 1
      ORDER BY p.ProductID
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;
    
    console.log('Executing query:', query);
    const result = await sql.query(query);
    console.log(`Found ${result.recordset.length} products for gender ${gender}`);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi truy vấn SQL:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try {
      await sql.close();
      console.log('Database connection closed');
    } catch (closeErr) {
      console.error('Error closing connection:', closeErr);
    }
  }
});

// API lấy tất cả thương hiệu
app.get('/api/brands', async (req, res) => {
  try {
    console.log('Connecting to database...');
    await sql.connect(config);
    console.log('Database connected successfully');
    
    const query = `
      SELECT 
        b.BrandID,
        b.Name,
        b.Logo,
        b.Description,
        COUNT(p.ProductID) as ProductCount
      FROM Brands b
      LEFT JOIN Products p ON b.BrandID = p.BrandID
      GROUP BY b.BrandID, b.Name, b.Logo, b.Description
      ORDER BY b.Name
    `;
    
    console.log('Executing query:', query);
    const result = await sql.query(query);
    console.log(`Found ${result.recordset.length} brands`);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi truy vấn SQL:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try {
      await sql.close();
      console.log('Database connection closed');
    } catch (closeErr) {
      console.error('Error closing connection:', closeErr);
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   GET /api/test - Test server`);
  console.log(`   GET /api/categories - Get all categories`);
  console.log(`   GET /api/genders - Get all gender categories`);
  console.log(`   GET /api/products - Get all products with filters`);
  console.log(`   GET /api/products/:id - Get product by ID`);
  console.log(`   GET /api/categories/:categoryName/products - Get products by category`);
  console.log(`   GET /api/genders/:gender/products - Get products by gender`);
  console.log(`   GET /api/brands - Get all brands`);
});
