-- Script thêm dữ liệu mẫu cho sản phẩm
USE [shopgiay]
GO

-- Thêm dữ liệu mẫu cho Categories nếu chưa có
IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao')
BEGIN
    INSERT INTO [dbo].[Categories] ([Name], [Description], [Image])
    VALUES ('Giày thể thao', 'Giày thể thao nam nữ đa dạng mẫu mã', '/images/categories/the-thao.jpg');
END

IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE [Name] = 'Giày chạy bộ')
BEGIN
    INSERT INTO [dbo].[Categories] ([Name], [Description], [Image])
    VALUES ('Giày chạy bộ', 'Giày chạy bộ chuyên nghiệp', '/images/categories/chay-bo.jpg');
END

IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE [Name] = 'Giày đá banh')
BEGIN
    INSERT INTO [dbo].[Categories] ([Name], [Description], [Image])
    VALUES ('Giày đá banh', 'Giày đá banh chính hãng', '/images/categories/da-banh.jpg');
END

IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE [Name] = 'Giày tây')
BEGIN
    INSERT INTO [dbo].[Categories] ([Name], [Description], [Image])
    VALUES ('Giày tây', 'Giày tây công sở nam', '/images/categories/giay-tay.jpg');
END

IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE [Name] = 'Dép')
BEGIN
    INSERT INTO [dbo].[Categories] ([Name], [Description], [Image])
    VALUES ('Dép', 'Dép nam nữ thoải mái', '/images/categories/dep.jpg');
END

IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE [Name] = 'Giày búp bê')
BEGIN
    INSERT INTO [dbo].[Categories] ([Name], [Description], [Image])
    VALUES ('Giày búp bê', 'Giày búp bê nữ đẹp', '/images/categories/bup-be.jpg');
END

-- Thêm dữ liệu mẫu cho Brands nếu chưa có
IF NOT EXISTS (SELECT * FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes')
BEGIN
    INSERT INTO [dbo].[Brands] ([Name], [Logo], [Description])
    VALUES ('UTH Shoes', '/images/brands/uth-shoes-logo.png', 'Thương hiệu giày Việt Nam chất lượng cao');
END

-- Thêm dữ liệu mẫu cho Products nếu chưa có
IF NOT EXISTS (SELECT * FROM [dbo].[Products] WHERE [ProductID] = 1)
BEGIN
    INSERT INTO [dbo].[Products] (
        [ProductID], [Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount],
        [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity]
    )
    VALUES (
        1, 'Giày Thể Thao UTH Shoes Helio Teen Nam Màu Đen', 
        (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'),
        (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'),
        595000, 750000, 21,
        'Với phối màu trắng phối đen cá tính, mẫu Helio UTH008100 mang lại diện mạo thể thao mạnh mẽ và dễ phối hợp với đa dạng phong cách.',
        '/images/products/giay-the-thao-1.jpg',
        '["/images/products/giay-the-thao-2.jpg", "/images/products/giay-the-thao-3.jpg", "/images/products/giay-the-thao-4.jpg"]',
        '["/images/products/giay-the-thao-1.jpg", "/images/products/giay-the-thao-2.jpg", "/images/products/giay-the-thao-3.jpg", "/images/products/giay-the-thao-4.jpg"]',
        1, 100
    );
END

IF NOT EXISTS (SELECT * FROM [dbo].[Products] WHERE [ProductID] = 2)
BEGIN
    INSERT INTO [dbo].[Products] (
        [ProductID], [Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount],
        [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity]
    )
    VALUES (
        2, 'Giày Chạy Bộ UTH Shoes Runner Pro', 
        (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'),
        (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày chạy bộ'),
        850000, 1000000, 15,
        'Giày chạy bộ chuyên nghiệp với công nghệ đệm đế tiên tiến, phù hợp cho cả người mới bắt đầu và vận động viên chuyên nghiệp.',
        '/images/products/giay-chay-bo-1.jpg',
        '["/images/products/giay-chay-bo-2.jpg", "/images/products/giay-chay-bo-3.jpg", "/images/products/giay-chay-bo-4.jpg"]',
        '["/images/products/giay-chay-bo-1.jpg", "/images/products/giay-chay-bo-2.jpg", "/images/products/giay-chay-bo-3.jpg", "/images/products/giay-chay-bo-4.jpg"]',
        1, 80
    );
END

IF NOT EXISTS (SELECT * FROM [dbo].[Products] WHERE [ProductID] = 3)
BEGIN
    INSERT INTO [dbo].[Products] (
        [ProductID], [Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount],
        [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity]
    )
    VALUES (
        3, 'Giày Đá Banh UTH Shoes Football Elite', 
        (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'),
        (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày đá banh'),
        1200000, 1500000, 20,
        'Giày đá banh chính hãng với thiết kế chuyên nghiệp, đế bám tốt và chất liệu cao cấp.',
        '/images/products/giay-da-banh-1.jpg',
        '["/images/products/giay-da-banh-2.jpg", "/images/products/giay-da-banh-3.jpg", "/images/products/giay-da-banh-4.jpg"]',
        '["/images/products/giay-da-banh-1.jpg", "/images/products/giay-da-banh-2.jpg", "/images/products/giay-da-banh-3.jpg", "/images/products/giay-da-banh-4.jpg"]',
        1, 60
    );
END

IF NOT EXISTS (SELECT * FROM [dbo].[Products] WHERE [ProductID] = 4)
BEGIN
    INSERT INTO [dbo].[Products] (
        [ProductID], [Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount],
        [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity]
    )
    VALUES (
        4, 'Giày Tây UTH Shoes Business Classic', 
        (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'),
        (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày tây'),
        950000, 1200000, 21,
        'Giày tây công sở nam với thiết kế cổ điển, phù hợp cho môi trường làm việc chuyên nghiệp.',
        '/images/products/giay-tay-1.jpg',
        '["/images/products/giay-tay-2.jpg", "/images/products/giay-tay-3.jpg", "/images/products/giay-tay-4.jpg"]',
        '["/images/products/giay-tay-1.jpg", "/images/products/giay-tay-2.jpg", "/images/products/giay-tay-3.jpg", "/images/products/giay-tay-4.jpg"]',
        1, 75
    );
END

IF NOT EXISTS (SELECT * FROM [dbo].[Products] WHERE [ProductID] = 5)
BEGIN
    INSERT INTO [dbo].[Products] (
        [ProductID], [Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount],
        [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity]
    )
    VALUES (
        5, 'Dép UTH Shoes Comfort Slide', 
        (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'),
        (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Dép'),
        250000, 350000, 29,
        'Dép nam nữ thoải mái với đế mềm và thiết kế hiện đại, phù hợp cho mọi lứa tuổi.',
        '/images/products/dep-1.jpg',
        '["/images/products/dep-2.jpg", "/images/products/dep-3.jpg", "/images/products/dep-4.jpg"]',
        '["/images/products/dep-1.jpg", "/images/products/dep-2.jpg", "/images/products/dep-3.jpg", "/images/products/dep-4.jpg"]',
        1, 120
    );
END

IF NOT EXISTS (SELECT * FROM [dbo].[Products] WHERE [ProductID] = 6)
BEGIN
    INSERT INTO [dbo].[Products] (
        [ProductID], [Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount],
        [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity]
    )
    VALUES (
        6, 'Giày Búp Bê UTH Shoes Princess', 
        (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'),
        (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày búp bê'),
        450000, 600000, 25,
        'Giày búp bê nữ đẹp với thiết kế dễ thương, phù hợp cho các cô gái trẻ.',
        '/images/products/giay-bup-be-1.jpg',
        '["/images/products/giay-bup-be-2.jpg", "/images/products/giay-bup-be-3.jpg", "/images/products/giay-bup-be-4.jpg"]',
        '["/images/products/giay-bup-be-1.jpg", "/images/products/giay-bup-be-2.jpg", "/images/products/giay-bup-be-3.jpg", "/images/products/giay-bup-be-4.jpg"]',
        1, 90
    );
END

-- Thêm dữ liệu mẫu cho ProductColors
INSERT INTO [dbo].[ProductColors] ([ProductID], [Name], [Code])
SELECT 1, 'Đen', 'BLACK' WHERE NOT EXISTS (SELECT * FROM [dbo].[ProductColors] WHERE [ProductID] = 1 AND [Name] = 'Đen');

INSERT INTO [dbo].[ProductColors] ([ProductID], [Name], [Code])
SELECT 1, 'Trắng', 'WHITE' WHERE NOT EXISTS (SELECT * FROM [dbo].[ProductColors] WHERE [ProductID] = 1 AND [Name] = 'Trắng');

INSERT INTO [dbo].[ProductColors] ([ProductID], [Name], [Code])
SELECT 1, 'Xanh', 'BLUE' WHERE NOT EXISTS (SELECT * FROM [dbo].[ProductColors] WHERE [ProductID] = 1 AND [Name] = 'Xanh');

-- Thêm dữ liệu mẫu cho ProductSizes
INSERT INTO [dbo].[ProductSizes] ([ProductID], [Size])
SELECT 1, 38 WHERE NOT EXISTS (SELECT * FROM [dbo].[ProductSizes] WHERE [ProductID] = 1 AND [Size] = 38);

INSERT INTO [dbo].[ProductSizes] ([ProductID], [Size])
SELECT 1, 39 WHERE NOT EXISTS (SELECT * FROM [dbo].[ProductSizes] WHERE [ProductID] = 1 AND [Size] = 39);

INSERT INTO [dbo].[ProductSizes] ([ProductID], [Size])
SELECT 1, 40 WHERE NOT EXISTS (SELECT * FROM [dbo].[ProductSizes] WHERE [ProductID] = 1 AND [Size] = 40);

INSERT INTO [dbo].[ProductSizes] ([ProductID], [Size])
SELECT 1, 41 WHERE NOT EXISTS (SELECT * FROM [dbo].[ProductSizes] WHERE [ProductID] = 1 AND [Size] = 41);

INSERT INTO [dbo].[ProductSizes] ([ProductID], [Size])
SELECT 1, 42 WHERE NOT EXISTS (SELECT * FROM [dbo].[ProductSizes] WHERE [ProductID] = 1 AND [Size] = 42);

INSERT INTO [dbo].[ProductSizes] ([ProductID], [Size])
SELECT 1, 43 WHERE NOT EXISTS (SELECT * FROM [dbo].[ProductSizes] WHERE [ProductID] = 1 AND [Size] = 43);

-- Thêm dữ liệu mẫu cho ProductFeatures
INSERT INTO [dbo].[ProductFeatures] ([ProductID], [FeatureName])
SELECT 1, 'Phần upper gồm da tổng hợp phủ mịn và lưới mesh' WHERE NOT EXISTS (SELECT * FROM [dbo].[ProductFeatures] WHERE [ProductID] = 1 AND [FeatureName] = 'Phần upper gồm da tổng hợp phủ mịn và lưới mesh');

INSERT INTO [dbo].[ProductFeatures] ([ProductID], [FeatureName])
SELECT 1, 'Thiết kế cổ thấp basic, form ôm vừa chân' WHERE NOT EXISTS (SELECT * FROM [dbo].[ProductFeatures] WHERE [ProductID] = 1 AND [FeatureName] = 'Thiết kế cổ thấp basic, form ôm vừa chân');

INSERT INTO [dbo].[ProductFeatures] ([ProductID], [FeatureName])
SELECT 1, 'Đế IP siêu nhẹ, có rãnh chống trượt' WHERE NOT EXISTS (SELECT * FROM [dbo].[ProductFeatures] WHERE [ProductID] = 1 AND [FeatureName] = 'Đế IP siêu nhẹ, có rãnh chống trượt');

INSERT INTO [dbo].[ProductFeatures] ([ProductID], [FeatureName])
SELECT 1, 'Hỗ trợ di chuyển linh hoạt' WHERE NOT EXISTS (SELECT * FROM [dbo].[ProductFeatures] WHERE [ProductID] = 1 AND [FeatureName] = 'Hỗ trợ di chuyển linh hoạt');

-- Kiểm tra kết quả
SELECT 
    p.[ProductID],
    p.[Name],
    c.[Name] as CategoryName,
    b.[Name] as BrandName,
    p.[Price],
    p.[MainImage],
    p.[ThumbnailImages],
    p.[DetailImages]
FROM [dbo].[Products] p
LEFT JOIN [dbo].[Categories] c ON p.[CategoryID] = c.[CategoryID]
LEFT JOIN [dbo].[Brands] b ON p.[BrandID] = b.[BrandID]
WHERE p.[ProductID] IN (1, 2, 3, 4, 5, 6)
ORDER BY p.[ProductID];

GO

PRINT 'Script thêm dữ liệu mẫu đã hoàn thành!';
PRINT 'Đã thêm 6 sản phẩm mẫu với đầy đủ thông tin và hình ảnh.';
PRINT 'Kiểm tra kết quả bằng câu SELECT ở trên.';
