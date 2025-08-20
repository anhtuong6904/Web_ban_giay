USE [shopgiay]
GO

-- Cập nhật hình ảnh cho tất cả sản phẩm
-- Sử dụng hình ảnh phù hợp với tên sản phẩm thực tế

-- 1. Nike Products
UPDATE Products 
SET 
    MainImage = '/images/products/nike-air-zoom-pegasus-40.jpg',
    ThumbnailImages = '["/images/products/nike-air-zoom-pegasus-40.jpg", "/images/products/nike-air-zoom-pegasus-40-side.jpg", "/images/products/nike-air-zoom-pegasus-40-back.jpg"]',
    DetailImages = '["/images/products/nike-air-zoom-pegasus-40-detail-1.jpg", "/images/products/nike-air-zoom-pegasus-40-detail-2.jpg", "/images/products/nike-air-zoom-pegasus-40-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 1 AND Name LIKE '%Nike Air Zoom Pegasus 40%';

UPDATE Products 
SET 
    MainImage = '/images/products/nike-air-force-1.jpg',
    ThumbnailImages = '["/images/products/nike-air-force-1.jpg", "/images/products/nike-air-force-1-side.jpg", "/images/products/nike-air-force-1-back.jpg"]',
    DetailImages = '["/images/products/nike-air-force-1-detail-1.jpg", "/images/products/nike-air-force-1-detail-2.jpg", "/images/products/nike-air-force-1-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 2 AND Name LIKE '%Nike Air Force 1%';

UPDATE Products 
SET 
    MainImage = '/images/products/nike-air-max-270.jpg',
    ThumbnailImages = '["/images/products/nike-air-max-270.jpg", "/images/products/nike-air-max-270-side.jpg", "/images/products/nike-air-max-270-back.jpg"]',
    DetailImages = '["/images/products/nike-air-max-270-detail-1.jpg", "/images/products/nike-air-max-270-detail-2.jpg", "/images/products/nike-air-max-270-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 3 AND Name LIKE '%Nike Air Max 270%';

UPDATE Products 
SET 
    MainImage = '/images/products/nike-air-max-90.jpg',
    ThumbnailImages = '["/images/products/nike-air-max-90.jpg", "/images/products/nike-air-max-90-side.jpg", "/images/products/nike-air-max-90-back.jpg"]',
    DetailImages = '["/images/products/nike-air-max-90-detail-1.jpg", "/images/products/nike-air-max-90-detail-2.jpg", "/images/products/nike-air-max-90-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 4 AND Name LIKE '%Nike Air Max 90%';

UPDATE Products 
SET 
    MainImage = '/images/products/nike-react-infinity-run-3.jpg',
    ThumbnailImages = '["/images/products/nike-react-infinity-run-3.jpg", "/images/products/nike-react-infinity-run-3-side.jpg", "/images/products/nike-react-infinity-run-3-back.jpg"]',
    DetailImages = '["/images/products/nike-react-infinity-run-3-detail-1.jpg", "/images/products/nike-react-infinity-run-3-detail-2.jpg", "/images/products/nike-react-infinity-run-3-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 5 AND Name LIKE '%Nike React Infinity Run 3%';

-- 2. Adidas Products
UPDATE Products 
SET 
    MainImage = '/images/products/adidas-ultraboost-light.jpg',
    ThumbnailImages = '["/images/products/adidas-ultraboost-light.jpg", "/images/products/adidas-ultraboost-light-side.jpg", "/images/products/adidas-ultraboost-light-back.jpg"]',
    DetailImages = '["/images/products/adidas-ultraboost-light-detail-1.jpg", "/images/products/adidas-ultraboost-light-detail-2.jpg", "/images/products/adidas-ultraboost-light-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 13 AND Name LIKE '%Adidas Ultraboost Light%';

UPDATE Products 
SET 
    MainImage = '/images/products/adidas-nmd-r1.jpg',
    ThumbnailImages = '["/images/products/adidas-nmd-r1.jpg", "/images/products/adidas-nmd-r1-side.jpg", "/images/products/adidas-nmd-r1-back.jpg"]',
    DetailImages = '["/images/products/adidas-nmd-r1-detail-1.jpg", "/images/products/adidas-nmd-r1-detail-2.jpg", "/images/products/adidas-nmd-r1-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 14 AND Name LIKE '%Adidas NMD R1%';

UPDATE Products 
SET 
    MainImage = '/images/products/adidas-stan-smith.jpg',
    ThumbnailImages = '["/images/products/adidas-stan-smith.jpg", "/images/products/adidas-stan-smith-side.jpg", "/images/products/adidas-stan-smith-back.jpg"]',
    DetailImages = '["/images/products/adidas-stan-smith-detail-1.jpg", "/images/products/adidas-stan-smith-detail-2.jpg", "/images/products/adidas-stan-smith-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 15 AND Name LIKE '%Adidas Stan Smith%';

UPDATE Products 
SET 
    MainImage = '/images/products/adidas-superstar.jpg',
    ThumbnailImages = '["/images/products/adidas-superstar.jpg", "/images/products/adidas-superstar-side.jpg", "/images/products/adidas-superstar-back.jpg"]',
    DetailImages = '["/images/products/adidas-superstar-detail-1.jpg", "/images/products/adidas-superstar-detail-2.jpg", "/images/products/adidas-superstar-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 16 AND Name LIKE '%Adidas Superstar%';

-- 3. Converse Products
UPDATE Products 
SET 
    MainImage = '/images/products/converse-chuck-taylor-all-star.jpg',
    ThumbnailImages = '["/images/products/converse-chuck-taylor-all-star.jpg", "/images/products/converse-chuck-taylor-all-star-side.jpg", "/images/products/converse-chuck-taylor-all-star-back.jpg"]',
    DetailImages = '["/images/products/converse-chuck-taylor-all-star-detail-1.jpg", "/images/products/converse-chuck-taylor-all-star-detail-2.jpg", "/images/products/converse-chuck-taylor-all-star-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 25 AND Name LIKE '%Converse Chuck Taylor All Star%';

UPDATE Products 
SET 
    MainImage = '/images/products/converse-chuck-70.jpg',
    ThumbnailImages = '["/images/products/converse-chuck-70.jpg", "/images/products/converse-chuck-70-side.jpg", "/images/products/converse-chuck-70-back.jpg"]',
    DetailImages = '["/images/products/converse-chuck-70-detail-1.jpg", "/images/products/converse-chuck-70-detail-2.jpg", "/images/products/converse-chuck-70-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 26 AND Name LIKE '%Converse Chuck 70%';

-- 4. Vans Products
UPDATE Products 
SET 
    MainImage = '/images/products/vans-old-skool.jpg',
    ThumbnailImages = '["/images/products/vans-old-skool.jpg", "/images/products/vans-old-skool-side.jpg", "/images/products/vans-old-skool-back.jpg"]',
    DetailImages = '["/images/products/vans-old-skool-detail-1.jpg", "/images/products/vans-old-skool-detail-2.jpg", "/images/products/vans-old-skool-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 37 AND Name LIKE '%Vans Old Skool%';

UPDATE Products 
SET 
    MainImage = '/images/products/vans-sk8-hi.jpg',
    ThumbnailImages = '["/images/products/vans-sk8-hi.jpg", "/images/products/vans-sk8-hi-side.jpg", "/images/products/vans-sk8-hi-back.jpg"]',
    DetailImages = '["/images/products/vans-sk8-hi-detail-1.jpg", "/images/products/vans-sk8-hi-detail-2.jpg", "/images/products/vans-sk8-hi-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 38 AND Name LIKE '%Vans Sk8-Hi%';

UPDATE Products 
SET 
    MainImage = '/images/products/vans-authentic.jpg',
    ThumbnailImages = '["/images/products/vans-authentic.jpg", "/images/products/vans-authentic-side.jpg", "/images/products/vans-authentic-back.jpg"]',
    DetailImages = '["/images/products/vans-authentic-detail-1.jpg", "/images/products/vans-authentic-detail-2.jpg", "/images/products/vans-authentic-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 39 AND Name LIKE '%Vans Authentic%';

-- 5. New Balance Products
UPDATE Products 
SET 
    MainImage = '/images/products/new-balance-574.jpg',
    ThumbnailImages = '["/images/products/new-balance-574.jpg", "/images/products/new-balance-574-side.jpg", "/images/products/new-balance-574-back.jpg"]',
    DetailImages = '["/images/products/new-balance-574-detail-1.jpg", "/images/products/new-balance-574-detail-2.jpg", "/images/products/new-balance-574-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 49 AND Name LIKE '%New Balance 574%';

UPDATE Products 
SET 
    MainImage = '/images/products/new-balance-327.jpg',
    ThumbnailImages = '["/images/products/new-balance-327.jpg", "/images/products/new-balance-327-side.jpg", "/images/products/new-balance-327-back.jpg"]',
    DetailImages = '["/images/products/new-balance-327-detail-1.jpg", "/images/products/new-balance-327-detail-2.jpg", "/images/products/new-balance-327-detail-3.jpg"]',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 50 AND Name LIKE '%New Balance 327%';

-- Cập nhật tất cả sản phẩm còn lại với hình ảnh mặc định
UPDATE Products 
SET 
    MainImage = CASE 
        WHEN BrandID = 1 THEN '/images/products/nike-default.jpg'  -- Nike
        WHEN BrandID = 2 THEN '/images/products/adidas-default.jpg'  -- Adidas
        WHEN BrandID = 3 THEN '/images/products/converse-default.jpg'  -- Converse
        WHEN BrandID = 4 THEN '/images/products/vans-default.jpg'  -- Vans
        WHEN BrandID = 5 THEN '/images/products/new-balance-default.jpg'  -- New Balance
        ELSE '/images/products/default-shoe.jpg'
    END,
    ThumbnailImages = CASE 
        WHEN BrandID = 1 THEN '["/images/products/nike-default.jpg", "/images/products/nike-default-side.jpg", "/images/products/nike-default-back.jpg"]'
        WHEN BrandID = 2 THEN '["/images/products/adidas-default.jpg", "/images/products/adidas-default-side.jpg", "/images/products/adidas-default-back.jpg"]'
        WHEN BrandID = 3 THEN '["/images/products/converse-default.jpg", "/images/products/converse-default-side.jpg", "/images/products/converse-default-back.jpg"]'
        WHEN BrandID = 4 THEN '["/images/products/vans-default.jpg", "/images/products/vans-default-side.jpg", "/images/products/vans-default-back.jpg"]'
        WHEN BrandID = 5 THEN '["/images/products/new-balance-default.jpg", "/images/products/new-balance-default-side.jpg", "/images/products/new-balance-default-back.jpg"]'
        ELSE '["/images/products/default-shoe.jpg", "/images/products/default-shoe-side.jpg", "/images/products/default-shoe-back.jpg"]'
    END,
    DetailImages = CASE 
        WHEN BrandID = 1 THEN '["/images/products/nike-default-detail-1.jpg", "/images/products/nike-default-detail-2.jpg", "/images/products/nike-default-detail-3.jpg"]'
        WHEN BrandID = 2 THEN '["/images/products/adidas-default-detail-1.jpg", "/images/products/adidas-default-detail-2.jpg", "/images/products/adidas-default-detail-3.jpg"]'
        WHEN BrandID = 3 THEN '["/images/products/converse-default-detail-1.jpg", "/images/products/converse-default-detail-2.jpg", "/images/products/converse-default-detail-3.jpg"]'
        WHEN BrandID = 4 THEN '["/images/products/vans-default-detail-1.jpg", "/images/products/vans-default-detail-2.jpg", "/images/products/vans-default-detail-3.jpg"]'
        WHEN BrandID = 5 THEN '["/images/products/new-balance-default-detail-1.jpg", "/images/products/new-balance-default-detail-2.jpg", "/images/products/new-balance-default-detail-3.jpg"]'
        ELSE '["/images/products/default-shoe-detail-1.jpg", "/images/products/default-shoe-detail-2.jpg", "/images/products/default-shoe-detail-3.jpg"]'
    END,
    ImageUpdatedAt = GETDATE()
WHERE MainImage IS NULL OR MainImage = '' OR MainImage LIKE '%giay-the-thao-%';

-- Kiểm tra kết quả
SELECT 
    ProductID,
    Name,
    BrandID,
    MainImage,
    ThumbnailImages,
    DetailImages,
    ImageUpdatedAt
FROM Products 
ORDER BY BrandID, ProductID;

PRINT 'Đã cập nhật hình ảnh cho tất cả sản phẩm!';
GO
