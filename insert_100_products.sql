-- Script thêm 100 sản phẩm đa dạng cho database shopgiay
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
    INSERT INTO [dbo].[Categories] WHERE [Name] = 'Dép')
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

-- Bắt đầu thêm 100 sản phẩm
-- Nhóm 1: Giày thể thao (20 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Thể Thao UTH Shoes Helio Teen Nam Màu Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 595000, 750000, 21, 'Giày thể thao nam với thiết kế hiện đại, phù hợp cho hoạt động thể thao và dạo phố', '/images/products/giay-the-thao-helio-teen-nam-den-main.jpg', '["/images/products/giay-the-thao-helio-teen-nam-den-side.jpg", "/images/products/giay-the-thao-helio-teen-nam-den-top.jpg", "/images/products/giay-the-thao-helio-teen-nam-den-detail.jpg"]', '["/images/products/giay-the-thao-helio-teen-nam-den-main.jpg", "/images/products/giay-the-thao-helio-teen-nam-den-side.jpg", "/images/products/giay-the-thao-helio-teen-nam-den-top.jpg", "/images/products/giay-the-thao-helio-teen-nam-den-detail.jpg"]', 1, 100),

('Giày Thể Thao UTH Shoes Helio Teen Nam Màu Trắng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 595000, 750000, 21, 'Giày thể thao nam màu trắng với thiết kế trẻ trung, phù hợp cho mọi lứa tuổi', '/images/products/giay-the-thao-helio-teen-nam-trang-main.jpg', '["/images/products/giay-the-thao-helio-teen-nam-trang-side.jpg", "/images/products/giay-the-thao-helio-teen-nam-trang-top.jpg", "/images/products/giay-the-thao-helio-teen-nam-trang-detail.jpg"]', '["/images/products/giay-the-thao-helio-teen-nam-trang-main.jpg", "/images/products/giay-the-thao-helio-teen-nam-trang-side.jpg", "/images/products/giay-the-thao-helio-teen-nam-trang-top.jpg", "/images/products/giay-the-thao-helio-teen-nam-trang-detail.jpg"]', 1, 85),

('Giày Thể Thao UTH Shoes Helio Teen Nam Màu Xanh', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 595000, 750000, 21, 'Giày thể thao nam màu xanh với thiết kế năng động, phù hợp cho các hoạt động thể thao', '/images/products/giay-the-thao-helio-teen-nam-xanh-main.jpg', '["/images/products/giay-the-thao-helio-teen-nam-xanh-side.jpg", "/images/products/giay-the-thao-helio-teen-nam-xanh-top.jpg", "/images/products/giay-the-thao-helio-teen-nam-xanh-detail.jpg"]', '["/images/products/giay-the-thao-helio-teen-nam-xanh-main.jpg", "/images/products/giay-the-thao-helio-teen-nam-xanh-side.jpg", "/images/products/giay-the-thao-helio-teen-nam-xanh-top.jpg", "/images/products/giay-the-thao-helio-teen-nam-xanh-detail.jpg"]', 1, 90),

('Giày Thể Thao UTH Shoes Helio Teen Nữ Màu Hồng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 575000, 720000, 20, 'Giày thể thao nữ màu hồng với thiết kế dễ thương, phù hợp cho các cô gái trẻ', '/images/products/giay-the-thao-helio-teen-nu-hong-main.jpg', '["/images/products/giay-the-thao-helio-teen-nu-hong-side.jpg", "/images/products/giay-the-thao-helio-teen-nu-hong-top.jpg", "/images/products/giay-the-thao-helio-teen-nu-hong-detail.jpg"]', '["/images/products/giay-the-thao-helio-teen-nu-hong-main.jpg", "/images/products/giay-the-thao-helio-teen-nu-hong-side.jpg", "/images/products/giay-the-thao-helio-teen-nu-hong-top.jpg", "/images/products/giay-the-thao-helio-teen-nu-hong-detail.jpg"]', 1, 75),

('Giày Thể Thao UTH Shoes Helio Teen Nữ Màu Trắng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 575000, 720000, 20, 'Giày thể thao nữ màu trắng với thiết kế thanh lịch, dễ phối đồ', '/images/products/giay-the-thao-helio-teen-nu-trang-main.jpg', '["/images/products/giay-the-thao-helio-teen-nu-trang-side.jpg", "/images/products/giay-the-thao-helio-teen-nu-trang-top.jpg", "/images/products/giay-the-thao-helio-teen-nu-trang-detail.jpg"]', '["/images/products/giay-the-thao-helio-teen-nu-trang-main.jpg", "/images/products/giay-the-thao-helio-teen-nu-trang-side.jpg", "/images/products/giay-the-thao-helio-teen-nu-trang-top.jpg", "/images/products/giay-the-thao-helio-teen-nu-trang-detail.jpg"]', 1, 80);

GO

PRINT 'Đã thêm 5 sản phẩm đầu tiên. Tiếp tục với các sản phẩm khác...';
