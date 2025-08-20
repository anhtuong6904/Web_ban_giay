-- Script tạo hệ thống phân loại sản phẩm mới
-- Cho phép một sản phẩm thuộc nhiều danh mục khác nhau

USE [WebShoesUTH]; -- Thay đổi tên database nếu cần
GO

-- 1. Tạo bảng Categories mới
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Categories')
BEGIN
    CREATE TABLE Categories (
        CategoryID INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(500),
        Image NVARCHAR(500),
        ParentCategoryID INT NULL,
        SortOrder INT DEFAULT 0,
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE()
    );
    PRINT 'Đã tạo bảng Categories';
END
ELSE
BEGIN
    PRINT 'Bảng Categories đã tồn tại';
END

-- 2. Tạo bảng ProductCategories (quan hệ nhiều-nhiều)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ProductCategories')
BEGIN
    CREATE TABLE ProductCategories (
        ProductCategoryID INT PRIMARY KEY IDENTITY(1,1),
        ProductID INT NOT NULL,
        CategoryID INT NOT NULL,
        IsPrimary BIT DEFAULT 0,
        CreatedAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
        FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
    );
    PRINT 'Đã tạo bảng ProductCategories';
END
ELSE
BEGIN
    PRINT 'Bảng ProductCategories đã tồn tại';
END

-- 3. Tạo bảng GenderCategories
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'GenderCategories')
BEGIN
    CREATE TABLE GenderCategories (
        GenderCategoryID INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(50) NOT NULL,
        Description NVARCHAR(200),
        SortOrder INT DEFAULT 0,
        IsActive BIT DEFAULT 1
    );
    PRINT 'Đã tạo bảng GenderCategories';
END
ELSE
BEGIN
    PRINT 'Bảng GenderCategories đã tồn tại';
END

-- 4. Tạo bảng ProductGenders
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ProductGenders')
BEGIN
    CREATE TABLE ProductGenders (
        ProductGenderID INT PRIMARY KEY IDENTITY(1,1),
        ProductID INT NOT NULL,
        GenderCategoryID INT NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
        FOREIGN KEY (GenderCategoryID) REFERENCES GenderCategories(GenderCategoryID)
    );
    PRINT 'Đã tạo bảng ProductGenders';
END
ELSE
BEGIN
    PRINT 'Bảng ProductGenders đã tồn tại';
END

-- 5. Thêm dữ liệu mẫu cho Categories
INSERT INTO Categories (Name, Description, Image, ParentCategoryID, SortOrder) VALUES
('SHOES', 'Tất cả các loại giày dép', '/images/categories/shoes.jpg', NULL, 1),
('MEN', 'Giày dép dành cho nam', '/images/categories/men.jpg', NULL, 2),
('WOMEN', 'Giày dép dành cho nữ', '/images/categories/women.jpg', NULL, 3),
('KIDS', 'Giày dép dành cho trẻ em', '/images/categories/kids.jpg', NULL, 4),
('SPORTS', 'Giày thể thao chuyên dụng', '/images/categories/sports.jpg', NULL, 5),
('BRANDS', 'Thương hiệu giày dép', '/images/categories/brands.jpg', NULL, 6),
('Giày thể thao', 'Giày thể thao nam nữ đa dạng', '/images/categories/the-thao.jpg', 1, 7),
('Giày chạy bộ', 'Giày chạy bộ chuyên nghiệp', '/images/categories/chay-bo.jpg', 5, 8),
('Giày đá banh', 'Giày đá banh chính hãng', '/images/categories/da-banh.jpg', 5, 9),
('Giày tây', 'Giày tây công sở nam', '/images/categories/giay-tay.jpg', 2, 10),
('Giày cao gót', 'Giày cao gót nữ thanh lịch', '/images/categories/cao-got.jpg', 3, 11),
('Giày búp bê', 'Giày búp bê nữ đẹp', '/images/categories/bup-be.jpg', 3, 12),
('Dép', 'Dép nam nữ thoải mái', '/images/categories/dep.jpg', 1, 13),
('Giày lười', 'Giày lười nam nữ thoải mái', '/images/categories/giay-luoi.jpg', 1, 14);

-- 6. Thêm dữ liệu mẫu cho GenderCategories
INSERT INTO GenderCategories (Name, Description, SortOrder) VALUES
('MEN', 'Dành cho nam', 1),
('WOMEN', 'Dành cho nữ', 2),
('KIDS', 'Dành cho trẻ em', 3),
('UNISEX', 'Dành cho cả nam và nữ', 4);

-- 7. Tạo index để tối ưu performance
CREATE INDEX IX_ProductCategories_ProductID ON ProductCategories(ProductID);
CREATE INDEX IX_ProductCategories_CategoryID ON ProductCategories(CategoryID);
CREATE INDEX IX_ProductGenders_ProductID ON ProductGenders(ProductID);
CREATE INDEX IX_ProductGenders_GenderCategoryID ON ProductGenders(GenderCategoryID);

-- 8. Tạo view để dễ dàng query sản phẩm theo danh mục
CREATE VIEW vw_ProductsWithCategories AS
SELECT 
    p.ProductID,
    p.Name,
    p.Price,
    p.OriginalPrice,
    p.Discount,
    p.MainImage,
    p.Description,
    p.InStock,
    p.StockQuantity,
    STRING_AGG(c.Name, ', ') AS Categories,
    STRING_AGG(gc.Name, ', ') AS Genders,
    MAX(pc.IsPrimary) AS HasPrimaryCategory
FROM Products p
LEFT JOIN ProductCategories pc ON p.ProductID = pc.ProductID
LEFT JOIN Categories c ON pc.CategoryID = c.CategoryID
LEFT JOIN ProductGenders pg ON p.ProductID = pg.ProductID
LEFT JOIN GenderCategories gc ON pg.GenderCategoryID = gc.GenderCategoryID
WHERE p.IsActive = 1
GROUP BY 
    p.ProductID, p.Name, p.Price, p.OriginalPrice, p.Discount, 
    p.MainImage, p.Description, p.InStock, p.StockQuantity;

-- 9. Tạo stored procedure để lấy sản phẩm theo danh mục
CREATE PROCEDURE sp_GetProductsByCategory
    @CategoryName NVARCHAR(100) = NULL,
    @Gender NVARCHAR(50) = NULL,
    @BrandID INT = NULL,
    @SaleOnly BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @SQL NVARCHAR(MAX) = '
    SELECT DISTINCT
        p.ProductID,
        p.Name,
        p.Price,
        p.OriginalPrice,
        p.Discount,
        p.MainImage,
        p.Description,
        p.InStock,
        p.StockQuantity
    FROM Products p
    LEFT JOIN ProductCategories pc ON p.ProductID = pc.ProductID
    LEFT JOIN Categories c ON pc.CategoryID = c.CategoryID
    LEFT JOIN ProductGenders pg ON p.ProductID = pg.ProductID
    LEFT JOIN GenderCategories gc ON pg.GenderCategoryID = gc.GenderCategoryID
    WHERE p.IsActive = 1';
    
    IF @CategoryName IS NOT NULL
        SET @SQL += ' AND c.Name LIKE ''%' + @CategoryName + '%''';
    
    IF @Gender IS NOT NULL
        SET @SQL += ' AND gc.Name = ''' + @Gender + '''';
    
    IF @BrandID IS NOT NULL
        SET @SQL += ' AND p.BrandID = ' + CAST(@BrandID AS NVARCHAR(10));
    
    IF @SaleOnly = 1
        SET @SQL += ' AND p.Discount > 0';
    
    SET @SQL += ' ORDER BY p.ProductID';
    
    EXEC sp_executesql @SQL;
END;

-- 10. Tạo stored procedure để thêm sản phẩm vào danh mục
CREATE PROCEDURE sp_AddProductToCategory
    @ProductID INT,
    @CategoryID INT,
    @IsPrimary BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    IF NOT EXISTS (SELECT 1 FROM ProductCategories WHERE ProductID = @ProductID AND CategoryID = @CategoryID)
    BEGIN
        INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary)
        VALUES (@ProductID, @CategoryID, @IsPrimary);
        
        SELECT 'Success' AS Result, 'Product added to category successfully' AS Message;
    END
    ELSE
    BEGIN
        SELECT 'Error' AS Result, 'Product already exists in this category' AS Message;
    END
END;

-- 11. Tạo stored procedure để thêm sản phẩm vào danh mục giới tính
CREATE PROCEDURE sp_AddProductToGender
    @ProductID INT,
    @GenderCategoryID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF NOT EXISTS (SELECT 1 FROM ProductGenders WHERE ProductID = @ProductID AND GenderCategoryID = @GenderCategoryID)
    BEGIN
        INSERT INTO ProductGenders (ProductID, GenderCategoryID)
        VALUES (@ProductID, @GenderCategoryID);
        
        SELECT 'Success' AS Result, 'Product added to gender category successfully' AS Message;
    END
    ELSE
    BEGIN
        SELECT 'Error' AS Result, 'Product already exists in this gender category' AS Message;
    END
END;

-- 12. Kiểm tra kết quả
SELECT 'Categories' AS TableName, COUNT(*) AS RecordCount FROM Categories
UNION ALL
SELECT 'GenderCategories' AS TableName, COUNT(*) AS RecordCount FROM GenderCategories
UNION ALL
SELECT 'ProductCategories' AS TableName, COUNT(*) AS RecordCount FROM ProductCategories
UNION ALL
SELECT 'ProductGenders' AS TableName, COUNT(*) AS RecordCount FROM ProductGenders;

PRINT 'Hệ thống phân loại sản phẩm đã được thiết lập thành công!';
PRINT 'Bạn có thể sử dụng các stored procedures để quản lý sản phẩm:';
PRINT '  - sp_GetProductsByCategory: Lấy sản phẩm theo danh mục';
PRINT '  - sp_AddProductToCategory: Thêm sản phẩm vào danh mục';
PRINT '  - sp_AddProductToGender: Thêm sản phẩm vào danh mục giới tính';
