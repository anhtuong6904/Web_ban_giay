# 🏷️ Hệ thống phân loại sản phẩm linh hoạt

## 📋 Tổng quan

Hệ thống này cho phép **một sản phẩm thuộc nhiều danh mục khác nhau** đồng thời, giúp tối ưu hóa việc tìm kiếm và phân loại sản phẩm trên website bán giày.

## 🗄️ Cấu trúc Database

### Bảng chính:
- **Categories**: Danh mục sản phẩm (SHOES, MEN, WOMEN, KIDS, SPORTS, BRANDS, etc.)
- **GenderCategories**: Danh mục giới tính (MEN, WOMEN, KIDS, UNISEX)
- **ProductCategories**: Quan hệ nhiều-nhiều giữa Products và Categories
- **ProductGenders**: Quan hệ nhiều-nhiều giữa Products và GenderCategories

### Ví dụ phân loại:
```
Sản phẩm: Nike Air Max 270
- Danh mục chính: Running (IsPrimary = 1)
- Danh mục phụ: Giày thể thao (IsPrimary = 0)
- Giới tính: MEN, UNISEX

Sản phẩm: Converse Chuck Taylor
- Danh mục chính: Casual (IsPrimary = 1)
- Danh mục phụ: Lifestyle (IsPrimary = 0)
- Giới tính: WOMEN, UNISEX
```

## 🚀 Cách sử dụng

### 1. Cập nhật Database
Chạy script `update_existing_database.sql` trong SQL Server Management Studio:
```sql
-- Chạy file này để cập nhật database hiện tại
update_existing_database.sql
```

### 2. Cập nhật Backend
Thay thế `server.js` cũ bằng `server_updated.js`:
```bash
# Backup file cũ
mv backend/server.js backend/server_old.js

# Sử dụng file mới
mv backend/server_updated.js backend/server.js
```

### 3. Khởi động server
```bash
cd backend
npm start
```

## 📡 API Endpoints

### Lấy danh mục
```http
GET /api/categories
```
**Response:**
```json
[
  {
    "CategoryID": 1,
    "Name": "Running",
    "Description": "Giày chạy bộ và thể thao",
    "Image": "/images/categories/running.jpg",
    "ProductCount": 15
  }
]
```

### Lấy danh mục giới tính
```http
GET /api/genders
```
**Response:**
```json
[
  {
    "GenderCategoryID": 1,
    "Name": "MEN",
    "Description": "Dành cho nam",
    "ProductCount": 45
  }
]
```

### Lấy sản phẩm với filter
```http
GET /api/products?category=Running&gender=MEN&brand=1&sale=true&page=1&limit=20
```

**Parameters:**
- `category`: Tên danh mục (tìm kiếm LIKE)
- `gender`: Giới tính (MEN, WOMEN, KIDS, UNISEX)
- `brand`: ID thương hiệu
- `sale`: Chỉ sản phẩm khuyến mãi (true/false)
- `search`: Tìm kiếm theo tên hoặc mô tả
- `page`: Trang hiện tại
- `limit`: Số sản phẩm mỗi trang

### Lấy sản phẩm theo danh mục
```http
GET /api/categories/Running/products?page=1&limit=20
```

### Lấy sản phẩm theo giới tính
```http
GET /api/genders/MEN/products?page=1&limit=20
```

### Lấy chi tiết sản phẩm
```http
GET /api/products/1
```
**Response:**
```json
{
  "ProductID": 1,
  "Name": "Nike Air Max 270",
  "Categories": "Running, Giày thể thao",
  "Genders": "MEN, UNISEX",
  "BrandName": "Nike",
  "Price": 1500000
}
```

## 🔧 Quản lý sản phẩm

### Thêm sản phẩm vào danh mục
```sql
EXEC sp_AddProductToCategory 
    @ProductID = 1, 
    @CategoryID = 6, 
    @IsPrimary = 0
```

### Thêm sản phẩm vào danh mục giới tính
```sql
EXEC sp_AddProductToGender 
    @ProductID = 1, 
    @GenderCategoryID = 4
```

### Lấy sản phẩm theo danh mục (Stored Procedure)
```sql
EXEC sp_GetProductsByCategory 
    @CategoryName = 'Running', 
    @Gender = 'MEN', 
    @BrandID = 1, 
    @SaleOnly = 0
```

## 💡 Ví dụ sử dụng thực tế

### 1. Sản phẩm thể thao nam
```sql
-- Thêm vào danh mục chính: Giày thể thao
EXEC sp_AddProductToCategory 1, 6, 1

-- Thêm vào danh mục phụ: Running
EXEC sp_AddProductToCategory 1, 1, 0

-- Thêm vào giới tính: Nam
EXEC sp_AddProductToGender 1, 1

-- Thêm vào giới tính: Unisex
EXEC sp_AddProductToGender 1, 4
```

### 2. Sản phẩm nữ thời trang
```sql
-- Thêm vào danh mục chính: Lifestyle
EXEC sp_AddProductToCategory 3, 5, 1

-- Thêm vào danh mục phụ: Casual
EXEC sp_AddProductToCategory 3, 2, 0

-- Thêm vào giới tính: Nữ
EXEC sp_AddProductToGender 3, 2

-- Thêm vào giới tính: Unisex
EXEC sp_AddProductToGender 3, 4
```

## 🎯 Lợi ích

1. **Linh hoạt**: Một sản phẩm có thể xuất hiện ở nhiều danh mục
2. **Tìm kiếm chính xác**: Người dùng dễ dàng tìm sản phẩm theo nhiều tiêu chí
3. **SEO tốt hơn**: Sản phẩm xuất hiện ở nhiều trang danh mục
4. **Quản lý dễ dàng**: Không cần tạo nhiều bản sao sản phẩm
5. **Performance**: Sử dụng index và stored procedures tối ưu

## 🔍 Truy vấn mẫu

### Tìm sản phẩm thể thao nam
```sql
SELECT DISTINCT p.*
FROM Products p
JOIN ProductCategories pc ON p.ProductID = pc.ProductID
JOIN Categories c ON pc.CategoryID = c.CategoryID
JOIN ProductGenders pg ON p.ProductID = pg.ProductID
JOIN GenderCategories gc ON pg.GenderCategoryID = gc.GenderCategoryID
WHERE c.Name LIKE '%thể thao%' 
  AND gc.Name = 'MEN'
  AND p.InStock = 1
```

### Tìm sản phẩm unisex
```sql
SELECT DISTINCT p.*
FROM Products p
JOIN ProductGenders pg ON p.ProductID = pg.ProductID
JOIN GenderCategories gc ON pg.GenderCategoryID = gc.GenderCategoryID
WHERE gc.Name = 'UNISEX'
  AND p.InStock = 1
```

## 📝 Lưu ý

- **IsPrimary**: Chỉ định danh mục chính của sản phẩm
- **STRING_AGG**: Sử dụng để gộp nhiều danh mục thành chuỗi (SQL Server 2017+)
- **Index**: Đã tạo index cho các bảng quan hệ để tối ưu performance
- **Pagination**: Hỗ trợ phân trang cho tất cả API lấy danh sách

## 🚨 Troubleshooting

### Lỗi STRING_AGG
Nếu gặp lỗi STRING_AGG, thay thế bằng STUFF + FOR XML PATH:
```sql
STUFF((
    SELECT ', ' + c.Name 
    FROM Categories c 
    JOIN ProductCategories pc ON c.CategoryID = pc.CategoryID 
    WHERE pc.ProductID = p.ProductID 
    FOR XML PATH('')
), 1, 2, '') AS Categories
```

### Lỗi kết nối database
Kiểm tra file `.env` và cấu hình trong `db.js`:
```javascript
const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'your_password',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'shopgiay',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433
};
```
