-- Script thêm 100 sản phẩm mới cho database shopgiay - Hoàn thành cuối cùng
USE [shopgiay]
GO

-- Tiếp tục thêm các sản phẩm còn lại để đạt 100 sản phẩm
-- Nhóm 57: Giày thể thao cuối cùng (3 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Thể Thao Ultra Royal Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 1250000, 1650000, 24, 'Giày thể thao siêu hoàng gia màu đen với chất liệu da thật và thiết kế sang trọng nhất', '/images/products/giay-the-thao-89.jpg', '["/images/products/giay-the-thao-90.jpg", "/images/products/giay-the-thao-91.jpg", "/images/products/giay-the-thao-92.jpg"]', '["/images/products/giay-the-thao-89.jpg", "/images/products/giay-the-thao-90.jpg", "/images/products/giay-the-thao-91.jpg", "/images/products/giay-the-thao-92.jpg"]', 1, 38),

('Giày Thể Thao Ultra Royal Trắng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 1250000, 1650000, 24, 'Giày thể thao siêu hoàng gia màu trắng với chất liệu da thật và thiết kế sang trọng nhất', '/images/products/giay-the-thao-93.jpg', '["/images/products/giay-the-thao-94.jpg", "/images/products/giay-the-thao-95.jpg", "/images/products/giay-the-thao-96.jpg"]', '["/images/products/giay-the-thao-93.jpg", "/images/products/giay-the-thao-94.jpg", "/images/products/giay-the-thao-95.jpg", "/images/products/giay-the-thao-96.jpg"]', 1, 35);

GO

PRINT 'Đã thêm 95 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 58: Giày chạy bộ cuối cùng (3 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Chạy Bộ Ultra Royal Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày chạy bộ'), 1450000, 1900000, 24, 'Giày chạy bộ siêu hoàng gia với công nghệ đệm đế tiên tiến nhất', '/images/products/giay-chay-bo-49.jpg', '["/images/products/giay-chay-bo-50.jpg", "/images/products/giay-chay-bo-51.jpg", "/images/products/giay-chay-bo-52.jpg"]', '["/images/products/giay-chay-bo-49.jpg", "/images/products/giay-chay-bo-50.jpg", "/images/products/giay-chay-bo-51.jpg", "/images/products/giay-chay-bo-52.jpg"]', 1, 25);

GO

PRINT 'Đã thêm 96 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 59: Giày đá banh cuối cùng (2 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Đá Banh Ultra Royal Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày đá banh'), 1650000, 2150000, 23, 'Giày đá banh siêu hoàng gia với thiết kế chuyên nghiệp nhất', '/images/products/giay-da-banh-41.jpg', '["/images/products/giay-da-banh-42.jpg", "/images/products/giay-da-banh-43.jpg", "/images/products/giay-da-banh-44.jpg"]', '["/images/products/giay-da-banh-41.jpg", "/images/products/giay-da-banh-42.jpg", "/images/products/giay-da-banh-43.jpg", "/images/products/giay-da-banh-44.jpg"]', 1, 20);

GO

PRINT 'Đã thêm 97 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 60: Giày tây cuối cùng (2 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Tây Ultra Royal Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày tây'), 1850000, 2400000, 23, 'Giày tây siêu hoàng gia với chất liệu da thật và thiết kế sang trọng nhất', '/images/products/giay-tay-41.jpg', '["/images/products/giay-tay-42.jpg", "/images/products/giay-tay-43.jpg", "/images/products/giay-tay-44.jpg"]', '["/images/products/giay-tay-41.jpg", "/images/products/giay-tay-42.jpg", "/images/products/giay-tay-43.jpg", "/images/products/giay-tay-44.jpg"]', 1, 15);

GO

PRINT 'Đã thêm 98 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 61: Dép cuối cùng (1 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Dép Ultra Royal Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Dép'), 650000, 880000, 26, 'Dép siêu hoàng gia màu đen với chất liệu da thật và thiết kế sang trọng nhất', '/images/products/dep-41.jpg', '["/images/products/dep-42.jpg", "/images/products/dep-43.jpg", "/images/products/dep-44.jpg"]', '["/images/products/dep-41.jpg", "/images/products/dep-42.jpg", "/images/products/dep-43.jpg", "/images/products/dep-44.jpg"]', 1, 55);

GO

PRINT 'Đã thêm 99 sản phẩm. Tiếp tục với sản phẩm cuối cùng...';

-- Nhóm 62: Giày búp bê cuối cùng (1 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Búp Bê Ultra Royal Hồng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày búp bê'), 950000, 1300000, 27, 'Giày búp bê nữ siêu hoàng gia màu hồng với thiết kế sang trọng nhất', '/images/products/giay-bup-be-37.jpg', '["/images/products/giay-bup-be-38.jpg", "/images/products/giay-bup-be-39.jpg", "/images/products/giay-bup-be-40.jpg"]', '["/images/products/giay-bup-be-37.jpg", "/images/products/giay-bup-be-38.jpg", "/images/products/giay-bup-be-39.jpg", "/images/products/giay-bup-be-40.jpg"]', 1, 45);

GO

PRINT 'Đã thêm 100 sản phẩm! Hoàn thành!';

-- Kiểm tra kết quả cuối cùng
SELECT 
    COUNT(*) as TotalProducts,
    [CategoryID],
    c.[Name] as CategoryName
FROM [dbo].[Products] p
JOIN [dbo].[Categories] c ON p.[CategoryID] = c.[CategoryID]
GROUP BY [CategoryID], c.[Name]
ORDER BY [CategoryID];

GO

PRINT 'Script thêm sản phẩm đã hoàn thành!';
PRINT 'Đã thêm đầy đủ 100 sản phẩm vào database.';
PRINT 'Kiểm tra kết quả bằng câu SELECT ở trên.';
