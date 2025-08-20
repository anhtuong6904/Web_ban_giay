-- Script cập nhật database shopgiay hiện tại
-- Thêm hệ thống phân loại linh hoạt cho phép một sản phẩm thuộc nhiều danh mục

USE [shopgiay];
GO

-- 1. Thêm các field mới vào bảng Categories hiện tại
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Categories' AND COLUMN_NAME = 'ParentCategoryID')
BEGIN
    ALTER TABLE Categories ADD ParentCategoryID INT NULL;
    PRINT 'Đã thêm field ParentCategoryID vào bảng Categories';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Categories' AND COLUMN_NAME = 'SortOrder')
BEGIN
    ALTER TABLE Categories ADD SortOrder INT DEFAULT 0;
    PRINT 'Đã thêm field SortOrder vào bảng Categories';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Categories' AND COLUMN_NAME = 'IsActive')
BEGIN
    ALTER TABLE Categories ADD IsActive BIT DEFAULT 1;
    PRINT 'Đã thêm field IsActive vào bảng Categories';
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

-- 5. Cập nhật dữ liệu cho Categories hiện tại
UPDATE Categories SET SortOrder = 1, IsActive = 1 WHERE CategoryID = 1; -- Running
UPDATE Categories SET SortOrder = 2, IsActive = 1 WHERE CategoryID = 2; -- Casual
UPDATE Categories SET SortOrder = 3, IsActive = 1 WHERE CategoryID = 3; -- Basketball
UPDATE Categories SET SortOrder = 4, IsActive = 1 WHERE CategoryID = 4; -- Skateboarding
UPDATE Categories SET SortOrder = 5, IsActive = 1 WHERE CategoryID = 5; -- Lifestyle
UPDATE Categories SET SortOrder = 6, IsActive = 1 WHERE CategoryID = 6; -- Giày thể thao
UPDATE Categories SET SortOrder = 7, IsActive = 1 WHERE CategoryID = 7; -- Giày chạy bộ
UPDATE Categories SET SortOrder = 8, IsActive = 1 WHERE CategoryID = 8; -- Giày đá banh
UPDATE Categories SET SortOrder = 9, IsActive = 1 WHERE CategoryID = 9; -- Giày tây
UPDATE Categories SET SortOrder = 10, IsActive = 1 WHERE CategoryID = 10; -- Dép
UPDATE Categories SET SortOrder = 11, IsActive = 1 WHERE CategoryID = 11; -- Giày búp bê
UPDATE Categories SET SortOrder = 12, IsActive = 1 WHERE CategoryID = 12; -- Giày cao gót
UPDATE Categories SET SortOrder = 13, IsActive = 1 WHERE CategoryID = 13; -- Giày lười

-- 6. Thêm dữ liệu mẫu cho GenderCategories
INSERT INTO GenderCategories (Name, Description, SortOrder) VALUES
('MEN', 'Dành cho nam', 1),
('WOMEN', 'Dành cho nữ', 2),
('KIDS', 'Dành cho trẻ em', 3),
('UNISEX', 'Dành cho cả nam và nữ', 4);

-- 7. Thêm dữ liệu mẫu cho ProductCategories (quan hệ với sản phẩm hiện tại)
-- Sản phẩm Nike Air Max 270 - thuộc cả Running và Sports
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (1, 1, 1); -- Primary: Running
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (1, 6, 0); -- Secondary: Giày thể thao

-- Sản phẩm Adidas Ultraboost 22 - thuộc cả Running và Sports
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (2, 1, 1); -- Primary: Running
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (2, 7, 0); -- Secondary: Giày chạy bộ

-- Sản phẩm Converse Chuck Taylor - thuộc cả Casual và Lifestyle
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (3, 2, 1); -- Primary: Casual
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (3, 5, 0); -- Secondary: Lifestyle

-- Sản phẩm Vans Old Skool - thuộc cả Skateboarding và Sports
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (4, 4, 1); -- Primary: Skateboarding
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (4, 6, 0); -- Secondary: Giày thể thao

-- Sản phẩm New Balance 574 - thuộc cả Lifestyle và Casual
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (5, 5, 1); -- Primary: Lifestyle
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (5, 2, 0); -- Secondary: Casual

-- Sản phẩm Jordan Air 1 - thuộc cả Basketball và Sports
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (6, 3, 1); -- Primary: Basketball
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (6, 6, 0); -- Secondary: Giày thể thao

-- 8. Thêm dữ liệu mẫu cho ProductGenders
-- Sản phẩm nam
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (1, 1); -- Nike Air Max - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (2, 1); -- Adidas Ultraboost - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (4, 1); -- Vans Old Skool - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (5, 1); -- New Balance 574 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (6, 1); -- Jordan Air 1 - MEN

-- Sản phẩm nữ
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (3, 2); -- Converse Chuck Taylor - WOMEN

-- Sản phẩm unisex
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (1, 4); -- Nike Air Max - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (2, 4); -- Adidas Ultraboost - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (3, 4); -- Converse Chuck Taylor - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (4, 4); -- Vans Old Skool - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (5, 4); -- New Balance 574 - UNISEX

-- 9. Tạo index để tối ưu performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ProductCategories_ProductID')
    CREATE INDEX IX_ProductCategories_ProductID ON ProductCategories(ProductID);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ProductCategories_CategoryID')
    CREATE INDEX IX_ProductCategories_CategoryID ON ProductCategories(CategoryID);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ProductGenders_ProductID')
    CREATE INDEX IX_ProductGenders_ProductID ON ProductGenders(ProductID);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ProductGenders_GenderCategoryID')
    CREATE INDEX IX_ProductGenders_GenderCategoryID ON ProductGenders(GenderCategoryID);

-- 10. Tạo view để dễ dàng query sản phẩm theo danh mục
IF EXISTS (SELECT * FROM sys.views WHERE name = 'vw_ProductsWithCategories')
    DROP VIEW vw_ProductsWithCategories;

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
WHERE p.InStock = 1
GROUP BY 
    p.ProductID, p.Name, p.Price, p.OriginalPrice, p.Discount, 
    p.MainImage, p.Description, p.InStock, p.StockQuantity;

-- 11. Tạo stored procedure để lấy sản phẩm theo danh mục
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_GetProductsByCategory')
    DROP PROCEDURE sp_GetProductsByCategory;

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
    WHERE p.InStock = 1';
    
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

-- 12. Tạo stored procedure để thêm sản phẩm vào danh mục
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_AddProductToCategory')
    DROP PROCEDURE sp_AddProductToCategory;

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

-- 13. Tạo stored procedure để thêm sản phẩm vào danh mục giới tính
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_AddProductToGender')
    DROP PROCEDURE sp_AddProductToGender;

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

-- 14. Kiểm tra kết quả
SELECT 'Categories' AS TableName, COUNT(*) AS RecordCount FROM Categories
UNION ALL
SELECT 'GenderCategories' AS TableName, COUNT(*) AS RecordCount FROM GenderCategories
UNION ALL
SELECT 'ProductCategories' AS TableName, COUNT(*) AS RecordCount FROM ProductCategories
UNION ALL
SELECT 'ProductGenders' AS TableName, COUNT(*) AS RecordCount FROM ProductGenders;

-- 15. Hiển thị sản phẩm với danh mục và giới tính
SELECT TOP 10
    p.ProductID,
    p.Name,
    STRING_AGG(c.Name, ', ') AS Categories,
    STRING_AGG(gc.Name, ', ') AS Genders
FROM Products p
LEFT JOIN ProductCategories pc ON p.ProductID = pc.ProductID
LEFT JOIN Categories c ON pc.CategoryID = c.CategoryID
LEFT JOIN ProductGenders pg ON p.ProductID = pg.ProductID
LEFT JOIN GenderCategories gc ON pg.GenderCategoryID = gc.GenderCategoryID
GROUP BY p.ProductID, p.Name
ORDER BY p.ProductID;

PRINT 'Cập nhật database shopgiay hoàn tất!';
PRINT 'Đã thêm hệ thống phân loại linh hoạt cho phép một sản phẩm thuộc nhiều danh mục';
PRINT 'Bạn có thể sử dụng các stored procedures để quản lý sản phẩm:';
PRINT '  - sp_GetProductsByCategory: Lấy sản phẩm theo danh mục';
PRINT '  - sp_AddProductToCategory: Thêm sản phẩm vào danh mục';
PRINT '  - sp_AddProductToGender: Thêm sản phẩm vào danh mục giới tính';
