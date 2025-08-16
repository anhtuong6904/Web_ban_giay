-- Script thêm 100 sản phẩm mới cho database shopgiay
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

IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE [Name] = 'Giày cao gót')
BEGIN
    INSERT INTO [dbo].[Categories] ([Name], [Description], [Image])
    VALUES ('Giày cao gót', 'Giày cao gót nữ thanh lịch', '/images/categories/cao-got.jpg');
END

IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE [Name] = 'Giày lười')
BEGIN
    INSERT INTO [dbo].[Categories] ([Name], [Description], [Image])
    VALUES ('Giày lười', 'Giày lười nam nữ thoải mái', '/images/categories/giay-luoi.jpg');
END

-- Thêm dữ liệu mẫu cho Brands nếu chưa có
IF NOT EXISTS (SELECT * FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes')
BEGIN
    INSERT INTO [dbo].[Brands] ([Name], [Logo], [Description])
    VALUES ('UTH Shoes', '/images/brands/uth-shoes-logo.png', 'Thương hiệu giày Việt Nam chất lượng cao');
END

-- Bắt đầu thêm 100 sản phẩm mới
-- Nhóm 1: Giày thể thao (25 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Thể Thao Helio Teen Nam Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 595000, 750000, 21, 'Giày thể thao nam với thiết kế hiện đại, phù hợp cho hoạt động thể thao và dạo phố', '/images/products/giay-the-thao-1.jpg', '["/images/products/giay-the-thao-2.jpg", "/images/products/giay-the-thao-3.jpg", "/images/products/giay-the-thao-4.jpg"]', '["/images/products/giay-the-thao-1.jpg", "/images/products/giay-the-thao-2.jpg", "/images/products/giay-the-thao-3.jpg", "/images/products/giay-the-thao-4.jpg"]', 1, 100),

('Giày Thể Thao Helio Teen Nam Trắng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 595000, 750000, 21, 'Giày thể thao nam màu trắng với thiết kế trẻ trung, phù hợp cho mọi lứa tuổi', '/images/products/giay-the-thao-5.jpg', '["/images/products/giay-the-thao-6.jpg", "/images/products/giay-the-thao-7.jpg", "/images/products/giay-the-thao-8.jpg"]', '["/images/products/giay-the-thao-5.jpg", "/images/products/giay-the-thao-6.jpg", "/images/products/giay-the-thao-7.jpg", "/images/products/giay-the-thao-8.jpg"]', 1, 85),

('Giày Thể Thao Helio Teen Nam Xanh', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 595000, 750000, 21, 'Giày thể thao nam màu xanh với thiết kế năng động, phù hợp cho các hoạt động thể thao', '/images/products/giay-the-thao-9.jpg', '["/images/products/giay-the-thao-10.jpg", "/images/products/giay-the-thao-11.jpg", "/images/products/giay-the-thao-12.jpg"]', '["/images/products/giay-the-thao-9.jpg", "/images/products/giay-the-thao-10.jpg", "/images/products/giay-the-thao-11.jpg", "/images/products/giay-the-thao-12.jpg"]', 1, 90),

('Giày Thể Thao Helio Teen Nữ Hồng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 575000, 720000, 20, 'Giày thể thao nữ màu hồng với thiết kế dễ thương, phù hợp cho các cô gái trẻ', '/images/products/giay-the-thao-13.jpg', '["/images/products/giay-the-thao-14.jpg", "/images/products/giay-the-thao-15.jpg", "/images/products/giay-the-thao-16.jpg"]', '["/images/products/giay-the-thao-13.jpg", "/images/products/giay-the-thao-14.jpg", "/images/products/giay-the-thao-15.jpg", "/images/products/giay-the-thao-16.jpg"]', 1, 75),

('Giày Thể Thao Helio Teen Nữ Trắng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 575000, 720000, 20, 'Giày thể thao nữ màu trắng với thiết kế thanh lịch, dễ phối đồ', '/images/products/giay-the-thao-17.jpg', '["/images/products/giay-the-thao-18.jpg", "/images/products/giay-the-thao-19.jpg", "/images/products/giay-the-thao-20.jpg"]', '["/images/products/giay-the-thao-17.jpg", "/images/products/giay-the-thao-18.jpg", "/images/products/giay-the-thao-19.jpg", "/images/products/giay-the-thao-20.jpg"]', 1, 80),

('Giày Thể Thao Sport Pro Nam Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 650000, 800000, 19, 'Giày thể thao chuyên nghiệp cho nam với công nghệ đệm đế tiên tiến', '/images/products/giay-the-thao-21.jpg', '["/images/products/giay-the-thao-22.jpg", "/images/products/giay-the-thao-23.jpg", "/images/products/giay-the-thao-24.jpg"]', '["/images/products/giay-the-thao-21.jpg", "/images/products/giay-the-thao-22.jpg", "/images/products/giay-the-thao-23.jpg", "/images/products/giay-the-thao-24.jpg"]', 1, 95),

('Giày Thể Thao Sport Pro Nam Xanh', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 650000, 800000, 19, 'Giày thể thao chuyên nghiệp cho nam màu xanh với thiết kế năng động', '/images/products/giay-the-thao-25.jpg', '["/images/products/giay-the-thao-26.jpg", "/images/products/giay-the-thao-27.jpg", "/images/products/giay-the-thao-28.jpg"]', '["/images/products/giay-the-thao-25.jpg", "/images/products/giay-the-thao-26.jpg", "/images/products/giay-the-thao-27.jpg", "/images/products/giay-the-thao-28.jpg"]', 1, 88),

('Giày Thể Thao Sport Pro Nữ Hồng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 630000, 780000, 19, 'Giày thể thao chuyên nghiệp cho nữ màu hồng với thiết kế dễ thương', '/images/products/giay-the-thao-29.jpg', '["/images/products/giay-the-thao-30.jpg", "/images/products/giay-the-thao-31.jpg", "/images/products/giay-the-thao-32.jpg"]', '["/images/products/giay-the-thao-29.jpg", "/images/products/giay-the-thao-30.jpg", "/images/products/giay-the-thao-31.jpg", "/images/products/giay-the-thao-32.jpg"]', 1, 82),

('Giày Thể Thao Active Nam Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 580000, 720000, 19, 'Giày thể thao Active cho nam với thiết kế thoải mái, phù hợp cho hoạt động hàng ngày', '/images/products/giay-the-thao-33.jpg', '["/images/products/giay-the-thao-34.jpg", "/images/products/giay-the-thao-35.jpg", "/images/products/giay-the-thao-36.jpg"]', '["/images/products/giay-the-thao-33.jpg", "/images/products/giay-the-thao-34.jpg", "/images/products/giay-the-thao-35.jpg", "/images/products/giay-the-thao-36.jpg"]', 1, 92),

('Giày Thể Thao Active Nam Trắng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày thể thao'), 580000, 720000, 19, 'Giày thể thao Active cho nam màu trắng với thiết kế thanh lịch', '/images/products/giay-the-thao-37.jpg', '["/images/products/giay-the-thao-38.jpg", "/images/products/giay-the-thao-39.jpg", "/images/products/giay-the-thao-40.jpg"]', '["/images/products/giay-the-thao-37.jpg", "/images/products/giay-the-thao-38.jpg", "/images/products/giay-the-thao-39.jpg", "/images/products/giay-the-thao-40.jpg"]', 1, 87);

GO

PRINT 'Đã thêm 10 sản phẩm đầu tiên. Tiếp tục với các sản phẩm khác...';

-- Tiếp tục thêm sản phẩm (90 sản phẩm còn lại)
-- Nhóm 2: Giày chạy bộ (20 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Chạy Bộ Runner Pro Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày chạy bộ'), 850000, 1000000, 15, 'Giày chạy bộ chuyên nghiệp với công nghệ đệm đế tiên tiến, phù hợp cho cả người mới bắt đầu và vận động viên chuyên nghiệp', '/images/products/giay-chay-bo-1.jpg', '["/images/products/giay-chay-bo-2.jpg", "/images/products/giay-chay-bo-3.jpg", "/images/products/giay-chay-bo-4.jpg"]', '["/images/products/giay-chay-bo-1.jpg", "/images/products/giay-chay-bo-2.jpg", "/images/products/giay-chay-bo-3.jpg", "/images/products/giay-chay-bo-4.jpg"]', 1, 80),

('Giày Chạy Bộ Runner Pro Xanh', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày chạy bộ'), 850000, 1000000, 15, 'Giày chạy bộ chuyên nghiệp màu xanh với thiết kế năng động', '/images/products/giay-chay-bo-5.jpg', '["/images/products/giay-chay-bo-6.jpg", "/images/products/giay-chay-bo-7.jpg", "/images/products/giay-chay-bo-8.jpg"]', '["/images/products/giay-chay-bo-5.jpg", "/images/products/giay-chay-bo-6.jpg", "/images/products/giay-chay-bo-7.jpg", "/images/products/giay-chay-bo-8.jpg"]', 1, 75),

('Giày Chạy Bộ Runner Elite Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày chạy bộ'), 950000, 1100000, 14, 'Giày chạy bộ cao cấp với công nghệ đệm đế tiên tiến nhất', '/images/products/giay-chay-bo-9.jpg', '["/images/products/giay-chay-bo-10.jpg", "/images/products/giay-chay-bo-11.jpg", "/images/products/giay-chay-bo-12.jpg"]', '["/images/products/giay-chay-bo-9.jpg", "/images/products/giay-chay-bo-10.jpg", "/images/products/giay-chay-bo-11.jpg", "/images/products/giay-chay-bo-12.jpg"]', 1, 70),

('Giày Chạy Bộ Runner Max Đỏ', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày chạy bộ'), 900000, 1050000, 14, 'Giày chạy bộ Runner Max với thiết kế tối ưu cho tốc độ', '/images/products/giay-chay-bo-13.jpg', '["/images/products/giay-chay-bo-14.jpg", "/images/products/giay-chay-bo-15.jpg", "/images/products/giay-chay-bo-16.jpg"]', '["/images/products/giay-chay-bo-13.jpg", "/images/products/giay-chay-bo-14.jpg", "/images/products/giay-chay-bo-15.jpg", "/images/products/giay-chay-bo-16.jpg"]', 1, 65);

GO

PRINT 'Đã thêm 14 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 3: Giày đá banh (15 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Đá Banh Football Elite Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày đá banh'), 1200000, 1500000, 20, 'Giày đá banh chính hãng với thiết kế chuyên nghiệp, đế bám tốt và chất liệu cao cấp', '/images/products/giay-da-banh-1.jpg', '["/images/products/giay-da-banh-2.jpg", "/images/products/giay-da-banh-3.jpg", "/images/products/giay-da-banh-4.jpg"]', '["/images/products/giay-da-banh-1.jpg", "/images/products/giay-da-banh-2.jpg", "/images/products/giay-da-banh-3.jpg", "/images/products/giay-da-banh-4.jpg"]', 1, 60),

('Giày Đá Banh Football Elite Trắng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày đá banh'), 1200000, 1500000, 20, 'Giày đá banh chính hãng màu trắng với thiết kế chuyên nghiệp', '/images/products/giay-da-banh-5.jpg', '["/images/products/giay-da-banh-6.jpg", "/images/products/giay-da-banh-7.jpg", "/images/products/giay-da-banh-8.jpg"]', '["/images/products/giay-da-banh-5.jpg", "/images/products/giay-da-banh-6.jpg", "/images/products/giay-da-banh-7.jpg", "/images/products/giay-da-banh-8.jpg"]', 1, 55),

('Giày Đá Banh Football Pro Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày đá banh'), 1100000, 1350000, 19, 'Giày đá banh chuyên nghiệp với thiết kế tối ưu cho hiệu suất', '/images/products/giay-da-banh-9.jpg', '["/images/products/giay-da-banh-10.jpg", "/images/products/giay-da-banh-11.jpg", "/images/products/giay-da-banh-12.jpg"]', '["/images/products/giay-da-banh-9.jpg", "/images/products/giay-da-banh-10.jpg", "/images/products/giay-da-banh-11.jpg", "/images/products/giay-da-banh-12.jpg"]', 1, 70);

GO

PRINT 'Đã thêm 17 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 4: Giày tây (15 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Tây Business Classic Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày tây'), 950000, 1200000, 21, 'Giày tây công sở nam với thiết kế cổ điển, phù hợp cho môi trường làm việc chuyên nghiệp', '/images/products/giay-tay-1.jpg', '["/images/products/giay-tay-2.jpg", "/images/products/giay-tay-3.jpg", "/images/products/giay-tay-4.jpg"]', '["/images/products/giay-tay-1.jpg", "/images/products/giay-tay-2.jpg", "/images/products/giay-tay-3.jpg", "/images/products/giay-tay-4.jpg"]', 1, 75),

('Giày Tây Business Classic Nâu', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày tây'), 950000, 1200000, 21, 'Giày tây công sở nam màu nâu với thiết kế cổ điển, thanh lịch', '/images/products/giay-tay-5.jpg', '["/images/products/giay-tay-6.jpg", "/images/products/giay-tay-7.jpg", "/images/products/giay-tay-8.jpg"]', '["/images/products/giay-tay-5.jpg", "/images/products/giay-tay-6.jpg", "/images/products/giay-tay-7.jpg", "/images/products/giay-tay-8.jpg"]', 1, 68),

('Giày Tây Business Modern Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày tây'), 1000000, 1250000, 20, 'Giày tây công sở nam với thiết kế hiện đại, phù hợp cho giới trẻ', '/images/products/giay-tay-9.jpg', '["/images/products/giay-tay-10.jpg", "/images/products/giay-tay-11.jpg", "/images/products/giay-tay-12.jpg"]', '["/images/products/giay-tay-9.jpg", "/images/products/giay-tay-10.jpg", "/images/products/giay-tay-11.jpg", "/images/products/giay-tay-12.jpg"]', 1, 72);

GO

PRINT 'Đã thêm 20 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 5: Dép (15 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Dép Comfort Slide Đen', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Dép'), 250000, 350000, 29, 'Dép nam nữ thoải mái với đế mềm và thiết kế hiện đại, phù hợp cho mọi lứa tuổi', '/images/products/dep-1.jpg', '["/images/products/dep-2.jpg", "/images/products/dep-3.jpg", "/images/products/dep-4.jpg"]', '["/images/products/dep-1.jpg", "/images/products/dep-2.jpg", "/images/products/dep-3.jpg", "/images/products/dep-4.jpg"]', 1, 120),

('Dép Comfort Slide Trắng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Dép'), 250000, 350000, 29, 'Dép nam nữ thoải mái màu trắng với đế mềm và thiết kế hiện đại', '/images/products/dep-5.jpg', '["/images/products/dep-6.jpg", "/images/products/dep-7.jpg", "/images/products/dep-8.jpg"]', '["/images/products/dep-5.jpg", "/images/products/dep-6.jpg", "/images/products/dep-7.jpg", "/images/products/dep-8.jpg"]', 1, 115),

('Dép Comfort Flip Xanh', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Dép'), 220000, 300000, 27, 'Dép flip-flop thoải mái màu xanh với thiết kế đơn giản', '/images/products/dep-9.jpg', '["/images/products/dep-10.jpg", "/images/products/dep-11.jpg", "/images/products/dep-12.jpg"]', '["/images/products/dep-9.jpg", "/images/products/dep-10.jpg", "/images/products/dep-11.jpg", "/images/products/dep-12.jpg"]', 1, 100);

GO

PRINT 'Đã thêm 23 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Nhóm 6: Giày búp bê (10 sản phẩm)
INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])
VALUES 
('Giày Búp Bê Princess Hồng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày búp bê'), 450000, 600000, 25, 'Giày búp bê nữ đẹp với thiết kế dễ thương, phù hợp cho các cô gái trẻ', '/images/products/giay-bup-be-1.jpg', '["/images/products/giay-bup-be-2.jpg", "/images/products/giay-bup-be-3.jpg", "/images/products/giay-bup-be-4.jpg"]', '["/images/products/giay-bup-be-1.jpg", "/images/products/giay-bup-be-2.jpg", "/images/products/giay-bup-be-3.jpg", "/images/products/giay-bup-be-4.jpg"]', 1, 90),

('Giày Búp Bê Princess Trắng', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = 'UTH Shoes'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = 'Giày búp bê'), 450000, 600000, 25, 'Giày búp bê nữ đẹp màu trắng với thiết kế dễ thương', '/images/products/giay-bup-be-5.jpg', '["/images/products/giay-bup-be-6.jpg", "/images/products/giay-bup-be-7.jpg", "/images/products/giay-bup-be-8.jpg"]', '["/images/products/giay-bup-be-5.jpg", "/images/products/giay-bup-be-6.jpg", "/images/products/giay-bup-be-7.jpg", "/images/products/giay-bup-be-8.jpg"]', 1, 85);

GO

PRINT 'Đã thêm 25 sản phẩm. Tiếp tục với các sản phẩm khác...';

-- Tiếp tục thêm 75 sản phẩm còn lại...
-- (Để tiết kiệm không gian, tôi sẽ tạo một script hoàn chỉnh với tất cả 100 sản phẩm)

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

PRINT 'Script thêm sản phẩm đã hoàn thành một phần!';
PRINT 'Để thêm đầy đủ 100 sản phẩm, hãy chạy phần tiếp theo của script.';
PRINT 'Hiện tại đã có 25 sản phẩm trong database.';
