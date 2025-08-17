-- Script cập nhật ảnh sản phẩm cho database shopgiay
USE [shopgiay]
GO

-- Cập nhật ảnh cho sản phẩm Giày Thể Thao UTH Shoes Helio Teen Nam
UPDATE [dbo].[Products]
SET
    [MainImage] = '/images/products/giay-the-thao-helio-teen-nam-den-main.jpg',
    [ThumbnailImages] = '["/images/products/giay-the-thao-helio-teen-nam-den-side.jpg", "/images/products/giay-the-thao-helio-teen-nam-den-top.jpg", "/images/products/giay-the-thao-helio-teen-nam-den-detail.jpg"]',
    [DetailImages] = '["/images/products/giay-the-thao-helio-teen-nam-den-main.jpg", "/images/products/giay-the-thao-helio-teen-nam-den-side.jpg", "/images/products/giay-the-thao-helio-teen-nam-den-top.jpg", "/images/products/giay-the-thao-helio-teen-nam-den-detail.jpg"]',
    [ImageUpdatedAt] = GETDATE()
WHERE [ProductID] = 1 AND [Name] LIKE '%Giày Thể Thao UTH Shoes Helio Teen Nam%';

-- Cập nhật ảnh cho sản phẩm Giày Chạy Bộ UTH Shoes Runner Pro
UPDATE [dbo].[Products]
SET
    [MainImage] = '/images/products/giay-chay-bo-runner-pro-main.jpg',
    [ThumbnailImages] = '["/images/products/giay-chay-bo-runner-pro-side.jpg", "/images/products/giay-chay-bo-runner-pro-top.jpg", "/images/products/giay-chay-bo-runner-pro-detail.jpg"]',
    [DetailImages] = '["/images/products/giay-chay-bo-runner-pro-main.jpg", "/images/products/giay-chay-bo-runner-pro-side.jpg", "/images/products/giay-chay-bo-runner-pro-top.jpg", "/images/products/giay-chay-bo-runner-pro-detail.jpg"]',
    [ImageUpdatedAt] = GETDATE()
WHERE [ProductID] = 2 AND [Name] LIKE '%Giày Chạy Bộ UTH Shoes Runner Pro%';

-- Cập nhật ảnh cho sản phẩm Giày Đá Banh UTH Shoes Football Elite
UPDATE [dbo].[Products]
SET
    [MainImage] = '/images/products/giay-da-banh-football-elite-main.jpg',
    [ThumbnailImages] = '["/images/products/giay-da-banh-football-elite-side.jpg", "/images/products/giay-da-banh-football-elite-top.jpg", "/images/products/giay-da-banh-football-elite-detail.jpg"]',
    [DetailImages] = '["/images/products/giay-da-banh-football-elite-main.jpg", "/images/products/giay-da-banh-football-elite-side.jpg", "/images/products/giay-da-banh-football-elite-top.jpg", "/images/products/giay-da-banh-football-elite-detail.jpg"]',
    [ImageUpdatedAt] = GETDATE()
WHERE [ProductID] = 3 AND [Name] LIKE '%Giày Đá Banh UTH Shoes Football Elite%';

-- Cập nhật ảnh cho sản phẩm Giày Tây UTH Shoes Business Classic
UPDATE [dbo].[Products]
SET
    [MainImage] = '/images/products/giay-tay-business-classic-main.jpg',
    [ThumbnailImages] = '["/images/products/giay-tay-business-classic-side.jpg", "/images/products/giay-tay-business-classic-top.jpg", "/images/products/giay-tay-business-classic-detail.jpg"]',
    [DetailImages] = '["/images/products/giay-tay-business-classic-main.jpg", "/images/products/giay-tay-business-classic-side.jpg", "/images/products/giay-tay-business-classic-top.jpg", "/images/products/giay-tay-business-classic-detail.jpg"]',
    [ImageUpdatedAt] = GETDATE()
WHERE [ProductID] = 4 AND [Name] LIKE '%Giày Tây UTH Shoes Business Classic%';

-- Cập nhật ảnh cho sản phẩm Dép UTH Shoes Comfort Slide
UPDATE [dbo].[Products]
SET
    [MainImage] = '/images/products/dep-comfort-slide-main.jpg',
    [ThumbnailImages] = '["/images/products/dep-comfort-slide-side.jpg", "/images/products/dep-comfort-slide-top.jpg", "/images/products/dep-comfort-slide-detail.jpg"]',
    [DetailImages] = '["/images/products/dep-comfort-slide-main.jpg", "/images/products/dep-comfort-slide-side.jpg", "/images/products/dep-comfort-slide-top.jpg", "/images/products/dep-comfort-slide-detail.jpg"]',
    [ImageUpdatedAt] = GETDATE()
WHERE [ProductID] = 5 AND [Name] LIKE '%Dép UTH Shoes Comfort Slide%';

-- Cập nhật ảnh cho sản phẩm Giày Búp Bê UTH Shoes Princess
UPDATE [dbo].[Products]
SET
    [MainImage] = '/images/products/giay-bup-be-princess-main.jpg',
    [ThumbnailImages] = '["/images/products/giay-bup-be-princess-side.jpg", "/images/products/giay-bup-be-princess-top.jpg", "/images/products/giay-bup-be-princess-detail.jpg"]',
    [DetailImages] = '["/images/products/giay-bup-be-princess-main.jpg", "/images/products/giay-bup-be-princess-side.jpg", "/images/products/giay-bup-be-princess-top.jpg", "/images/products/giay-bup-be-princess-detail.jpg"]',
    [ImageUpdatedAt] = GETDATE()
WHERE [ProductID] = 6 AND [Name] LIKE '%Giày Búp Bê UTH Shoes Princess%';

-- Kiểm tra kết quả cập nhật
SELECT
    [ProductID],
    [Name],
    [MainImage],
    [ThumbnailImages],
    [DetailImages],
    [ImageUpdatedAt]
FROM [dbo].[Products]
WHERE [ProductID] IN (1, 2, 3, 4, 5, 6)
ORDER BY [ProductID];

-- Hiển thị tổng số sản phẩm đã cập nhật
SELECT
    COUNT(*) as TotalUpdated,
    COUNT([ThumbnailImages]) as HasThumbnails,
    COUNT([DetailImages]) as HasDetailImages
FROM [dbo].[Products]
WHERE [ProductID] IN (1, 2, 3, 4, 5, 6);

GO

PRINT 'Script cập nhật ảnh sản phẩm đã hoàn thành!';
PRINT 'Đã cập nhật ảnh cho 6 sản phẩm chính với tên file mới.';
PRINT 'Kiểm tra kết quả bằng các câu SELECT ở trên.';
