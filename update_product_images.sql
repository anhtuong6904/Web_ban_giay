-- Script cập nhật ảnh sản phẩm cho database shopgiay
USE [shopgiay]
GO

-- Cập nhật ảnh cho sản phẩm Giày Thể Thao UTH Shoes Helio Teen Nam
UPDATE [dbo].[Products]
SET 
    [MainImage] = '/images/products/giay-the-thao-1.jpg',
    [ThumbnailImages] = '["/images/products/giay-the-thao-2.jpg", "/images/products/giay-the-thao-3.jpg", "/images/products/giay-the-thao-4.jpg"]',
    [DetailImages] = '["/images/products/giay-the-thao-1.jpg", "/images/products/giay-the-thao-2.jpg", "/images/products/giay-the-thao-3.jpg", "/images/products/giay-the-thao-4.jpg"]',
    [ImageUpdatedAt] = GETDATE()
WHERE [ProductID] = 1 AND [Name] LIKE '%Giày Thể Thao UTH Shoes Helio Teen Nam%';

-- Cập nhật ảnh cho sản phẩm Giày Chạy Bộ UTH Shoes Runner Pro
UPDATE [dbo].[Products]
SET 
    [MainImage] = '/images/products/giay-chay-bo-1.jpg',
    [ThumbnailImages] = '["/images/products/giay-chay-bo-2.jpg", "/images/products/giay-chay-bo-3.jpg", "/images/products/giay-chay-bo-4.jpg"]',
    [DetailImages] = '["/images/products/giay-chay-bo-1.jpg", "/images/products/giay-chay-bo-2.jpg", "/images/products/giay-chay-bo-3.jpg", "/images/products/giay-chay-bo-4.jpg"]',
    [ImageUpdatedAt] = GETDATE()
WHERE [ProductID] = 2 AND [Name] LIKE '%Giày Chạy Bộ UTH Shoes Runner Pro%';

-- Cập nhật ảnh cho sản phẩm Giày Đá Banh UTH Shoes Football Elite
UPDATE [dbo].[Products]
SET 
    [MainImage] = '/images/products/giay-da-banh-1.jpg',
    [ThumbnailImages] = '["/images/products/giay-da-banh-2.jpg", "/images/products/giay-da-banh-3.jpg", "/images/products/giay-da-banh-4.jpg"]',
    [DetailImages] = '["/images/products/giay-da-banh-1.jpg", "/images/products/giay-da-banh-2.jpg", "/images/products/giay-da-banh-3.jpg", "/images/products/giay-da-banh-4.jpg"]',
    [ImageUpdatedAt] = GETDATE()
WHERE [ProductID] = 3 AND [Name] LIKE '%Giày Đá Banh UTH Shoes Football Elite%';

-- Cập nhật ảnh cho sản phẩm Giày Tây UTH Shoes Business Classic
UPDATE [dbo].[Products]
SET 
    [MainImage] = '/images/products/giay-tay-1.jpg',
    [ThumbnailImages] = '["/images/products/giay-tay-2.jpg", "/images/products/giay-tay-3.jpg", "/images/products/giay-tay-4.jpg"]',
    [DetailImages] = '["/images/products/giay-tay-1.jpg", "/images/products/giay-tay-2.jpg", "/images/products/giay-tay-3.jpg", "/images/products/giay-tay-4.jpg"]',
    [ImageUpdatedAt] = GETDATE()
WHERE [ProductID] = 4 AND [Name] LIKE '%Giày Tây UTH Shoes Business Classic%';

-- Cập nhật ảnh cho sản phẩm Dép UTH Shoes Comfort Slide
UPDATE [dbo].[Products]
SET 
    [MainImage] = '/images/products/dep-1.jpg',
    [ThumbnailImages] = '["/images/products/dep-2.jpg", "/images/products/dep-3.jpg", "/images/products/dep-4.jpg"]',
    [DetailImages] = '["/images/products/dep-1.jpg", "/images/products/dep-2.jpg", "/images/products/dep-3.jpg", "/images/products/dep-4.jpg"]',
    [ImageUpdatedAt] = GETDATE()
WHERE [ProductID] = 5 AND [Name] LIKE '%Dép UTH Shoes Comfort Slide%';

-- Cập nhật ảnh cho sản phẩm Giày Búp Bê UTH Shoes Princess
UPDATE [dbo].[Products]
SET 
    [MainImage] = '/images/products/giay-bup-be-1.jpg',
    [ThumbnailImages] = '["/images/products/giay-bup-be-2.jpg", "/images/products/giay-bup-be-3.jpg", "/images/products/giay-bup-be-4.jpg"]',
    [DetailImages] = '["/images/products/giay-bup-be-1.jpg", "/images/products/giay-bup-be-2.jpg", "/images/products/giay-bup-be-3.jpg", "/images/products/giay-bup-be-4.jpg"]',
    [ImageUpdatedAt] = GETDATE()
WHERE [ProductID] = 6 AND [Name] LIKE '%Giày Búp Bê UTH Shoes Princess%';

-- Cập nhật ảnh cho tất cả sản phẩm (nếu không có điều kiện cụ thể)
-- UPDATE [dbo].[Products]
-- SET 
--     [ThumbnailImages] = '["/images/products/thumbnail-default-1.jpg", "/images/products/thumbnail-default-2.jpg", "/images/products/thumbnail-default-3.jpg"]',
--     [DetailImages] = '["/images/products/detail-default-1.jpg", "/images/products/detail-default-2.jpg", "/images/products/detail-default-3.jpg", "/images/products/detail-default-4.jpg"]',
--     [ImageUpdatedAt] = GETDATE()
-- WHERE [ThumbnailImages] IS NULL OR [DetailImages] IS NULL;

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
PRINT 'Đã cập nhật ảnh cho 6 sản phẩm chính.';
PRINT 'Kiểm tra kết quả bằng các câu SELECT ở trên.';
