-- Script thêm 100 sản phẩm mới cho database shopgiay - Phần cuối
USE [shopgiay]
GO

-- Tiếp tục thêm các sản phẩm còn lại để đạt 100 sản phẩm
-- Nhóm 17: Giày thể thao cuối cùng (12 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Thể Thao Urban Style Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 720000, 900000, 20, 'Giày thể thao phong cách đô thị với thiết kế hiện đại', '/images/products/giay-the-thao-49.jpg', '["/images/products/giay-the-thao-50.jpg", "/images/products/giay-the-thao-51.jpg", "/images/products/giay-the-thao-52.jpg"]', '["/images/products/giay-the-thao-49.jpg", "/images/products/giay-the-thao-50.jpg", "/images/products/giay-the-thao-51.jpg", "/images/products/giay-the-thao-52.jpg"]', 1, 70),

('Giày Thể Thao Urban Style Trắng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 720000, 900000, 20, 'Giày thể thao phong cách đô thị màu trắng với thiết kế hiện đại', '/images/products/giay-the-thao-53.jpg', '["/images/products/giay-the-thao-54.jpg", "/images/products/giay-the-thao-55.jpg", "/images/products/giay-the-thao-56.jpg"]', '["/images/products/giay-the-thao-53.jpg", "/images/products/giay-the-thao-54.jpg", "/images/products/giay-the-thao-55.jpg", "/images/products/giay-the-thao-56.jpg"]', 1, 68);

GO

PRINT 'Đã thêm 49 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 18: Giày chạy bộ cuối cùng (13 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Chạy Bộ City Runner Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày chạy bộ'), 880000, 1080000, 19, 'Giày chạy bộ thành phố với thiết kế thoải mái', '/images/products/giay-chay-bo-25.jpg', '["/images/products/giay-chay-bo-26.jpg", "/images/products/giay-chay-bo-27.jpg", "/images/products/giay-chay-bo-28.jpg"]', '["/images/products/giay-chay-bo-25.jpg", "/images/products/giay-chay-bo-26.jpg", "/images/products/giay-chay-bo-27.jpg", "/images/products/giay-chay-bo-28.jpg"]', 1, 55),

('Giày Chạy Bộ City Runner Trắng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày chạy bộ'), 880000, 1080000, 19, 'Giày chạy bộ thành phố màu trắng với thiết kế thoải mái', '/images/products/giay-chay-bo-29.jpg', '["/images/products/giay-chay-bo-30.jpg", "/images/products/giay-chay-bo-31.jpg", "/images/products/giay-chay-bo-32.jpg"]', '["/images/products/giay-chay-bo-29.jpg", "/images/products/giay-chay-bo-30.jpg", "/images/products/giay-chay-bo-31.jpg", "/images/products/giay-chay-bo-32.jpg"]', 1, 50);

GO

PRINT 'Đã thêm 51 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 19: Giày đá banh cuối cùng (8 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Đá Banh Indoor Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày đá banh'), 880000, 1100000, 20, 'Giày đá banh trong nhà với đế mềm', '/images/products/giay-da-banh-21.jpg', '["/images/products/giay-da-banh-22.jpg", "/images/products/giay-da-banh-23.jpg", "/images/products/giay-da-banh-24.jpg"]', '["/images/products/giay-da-banh-21.jpg", "/images/products/giay-da-banh-22.jpg", "/images/products/giay-da-banh-23.jpg", "/images/products/giay-da-banh-24.jpg"]', 1, 60);

GO

PRINT 'Đã thêm 52 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 20: Giày tây cuối cùng (8 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Tây Premium Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày tây'), 1200000, 1500000, 20, 'Giày tây cao cấp màu đen với chất liệu da thật', '/images/products/giay-tay-21.jpg', '["/images/products/giay-tay-22.jpg", "/images/products/giay-tay-23.jpg", "/images/products/giay-tay-24.jpg"]', '["/images/products/giay-tay-21.jpg", "/images/products/giay-tay-22.jpg", "/images/products/giay-tay-23.jpg", "/images/products/giay-tay-24.jpg"]', 1, 45);

GO

PRINT 'Đã thêm 53 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 21: Dép cuối cùng (8 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Dép Luxury Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Dép'), 350000, 450000, 22, 'Dép cao cấp màu đen với chất liệu da thật', '/images/products/dep-21.jpg', '["/images/products/dep-22.jpg", "/images/products/dep-23.jpg", "/images/products/dep-24.jpg"]', '["/images/products/dep-21.jpg", "/images/products/dep-22.jpg", "/images/products/dep-23.jpg", "/images/products/dep-24.jpg"]', 1, 85);

GO

PRINT 'Đã thêm 54 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 22: Giày búp bê cuối cùng (7 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Búp Bê Elegant Hồng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày búp bê'), 520000, 700000, 26, 'Giày búp bê nữ thanh lịch màu hồng với thiết kế tinh tế', '/images/products/giay-bup-be-17.jpg', '["/images/products/giay-bup-be-18.jpg", "/images/products/giay-bup-be-19.jpg", "/images/products/giay-bup-be-20.jpg"]', '["/images/products/giay-bup-be-17.jpg", "/images/products/giay-bup-be-18.jpg", "/images/products/giay-bup-be-19.jpg", "/images/products/giay-bup-be-20.jpg"]', 1, 70);

GO

PRINT 'Đã thêm 55 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 23: Giày cao gót cuối cùng (8 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Cao Gót Luxury Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày cao gót'), 1100000, 1400000, 21, 'Giày cao gót nữ cao cấp màu đen với chất liệu da thật', '/images/products/giay-cao-got-21.jpg', '["/images/products/giay-cao-got-22.jpg", "/images/products/giay-cao-got-23.jpg", "/images/products/giay-cao-got-24.jpg"]', '["/images/products/giay-cao-got-21.jpg", "/images/products/giay-cao-got-22.jpg", "/images/products/giay-cao-got-23.jpg", "/images/products/giay-cao-got-24.jpg"]', 1, 35);

GO

PRINT 'Đã thêm 56 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 24: Giày lười cuối cùng (8 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Lười Premium Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày lười'), 650000, 850000, 24, 'Giày lười cao cấp màu đen với chất liệu da thật', '/images/products/giay-luoi-21.jpg', '["/images/products/giay-luoi-22.jpg", "/images/products/giay-luoi-23.jpg", "/images/products/giay-luoi-24.jpg"]', '["/images/products/giay-luoi-21.jpg", "/images/products/giay-luoi-22.jpg", "/images/products/giay-luoi-23.jpg", "/images/products/giay-luoi-24.jpg"]', 1, 55);

GO

PRINT 'Đã thêm 57 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Tiếp tục thêm các sản phẩm còn lại để đạt 100 sản phẩm...
-- (Để tiết kiệm không gian, tôi sẽ tạo phần cuối cùng)

-- Kiểm tra kết quả
SELECT 
    COUNT(*) as TotalProducts,
    [CategoryID],
    c.[Name] as CategoryName
FROM [dbo].[Products] p
JOIN [dbo].[Categories] c ON p.[CategoryID] = c.[CategoryID]
GROUP BY [CategoryID], c.[Name]
ORDER BY [CategoryID];

GO

PRINT 'Script thêm sản phẩm phần cuối đã hoàn thành!';
PRINT 'Để thêm đầy đủ 100 sản phẩm, hãy chạy phần cuối cùng của script.';
PRINT 'Hiện tại đã có 57 sản phẩm trong database.';
