USE [shopgiay]
GO

-- Sửa tất cả đường dẫn hình ảnh để có format chuẩn
-- Đường dẫn phải bắt đầu bằng / và sử dụng forward slash

-- 1. Sửa đường dẫn MainImage
UPDATE Products 
SET MainImage = REPLACE(
    REPLACE(
        REPLACE(MainImage, 'images\', '/images/'),
        'images/', '/images/'
    ),
    '\\', '/'
)
WHERE MainImage LIKE '%images%';

-- 2. Sửa đường dẫn ThumbnailImages
UPDATE Products 
SET ThumbnailImages = REPLACE(
    REPLACE(
        REPLACE(ThumbnailImages, 'images\', '/images/'),
        'images/', '/images/'
    ),
    '\\', '/'
)
WHERE ThumbnailImages LIKE '%images%';

-- 3. Sửa đường dẫn DetailImages
UPDATE Products 
SET DetailImages = REPLACE(
    REPLACE(
        REPLACE(DetailImages, 'images\', '/images/'),
        'images/', '/images/'
    ),
    '\\', '/'
)
WHERE DetailImages LIKE '%images%';

-- 4. Cập nhật tất cả sản phẩm với đường dẫn hình ảnh chuẩn
UPDATE Products 
SET 
    MainImage = CASE 
        WHEN BrandID = 1 THEN '/images/products/nike/nike-air-zoom-pegasus-40.jpg'  -- Nike
        WHEN BrandID = 2 THEN '/images/products/adidas/adidas-ultraboost-light.jpg'  -- Adidas
        WHEN BrandID = 3 THEN '/images/products/converse/converse-chuck-taylor.jpg'  -- Converse
        WHEN BrandID = 4 THEN '/images/products/vans/vans-old-skool.jpg'  -- Vans
        WHEN BrandID = 5 THEN '/images/products/new-balance/new-balance-574.jpg'  -- New Balance
        ELSE '/images/products/default/default-shoe.jpg'
    END,
    ThumbnailImages = CASE 
        WHEN BrandID = 1 THEN '["/images/products/nike/nike-air-zoom-pegasus-40.jpg", "/images/products/nike/nike-air-zoom-pegasus-40-side.jpg", "/images/products/nike/nike-air-zoom-pegasus-40-back.jpg"]'
        WHEN BrandID = 2 THEN '["/images/products/adidas/adidas-ultraboost-light.jpg", "/images/products/adidas/adidas-ultraboost-light-side.jpg", "/images/products/adidas/adidas-ultraboost-light-back.jpg"]'
        WHEN BrandID = 3 THEN '["/images/products/converse/converse-chuck-taylor.jpg", "/images/products/converse/converse-chuck-taylor-side.jpg", "/images/products/converse/converse-chuck-taylor-back.jpg"]'
        WHEN BrandID = 4 THEN '["/images/products/vans/vans-old-skool.jpg", "/images/products/vans/vans-old-skool-side.jpg", "/images/products/vans/vans-old-skool-back.jpg"]'
        WHEN BrandID = 5 THEN '["/images/products/new-balance/new-balance-574.jpg", "/images/products/new-balance/new-balance-574-side.jpg", "/images/products/new-balance/new-balance-574-back.jpg"]'
        ELSE '["/images/products/default/default-shoe.jpg", "/images/products/default/default-shoe-side.jpg", "/images/products/default/default-shoe-back.jpg"]'
    END,
    DetailImages = CASE 
        WHEN BrandID = 1 THEN '["/images/products/nike/nike-air-zoom-pegasus-40-detail-1.jpg", "/images/products/nike/nike-air-zoom-pegasus-40-detail-2.jpg", "/images/products/nike/nike-air-zoom-pegasus-40-detail-3.jpg"]'
        WHEN BrandID = 2 THEN '["/images/products/adidas/adidas-ultraboost-light-detail-1.jpg", "/images/products/adidas/adidas-ultraboost-light-detail-2.jpg", "/images/products/adidas/adidas-ultraboost-light-detail-3.jpg"]'
        WHEN BrandID = 3 THEN '["/images/products/converse/converse-chuck-taylor-detail-1.jpg", "/images/products/converse/converse-chuck-taylor-detail-2.jpg", "/images/products/converse/converse-chuck-taylor-detail-3.jpg"]'
        WHEN BrandID = 4 THEN '["/images/products/vans/vans-old-skool-detail-1.jpg", "/images/products/vans/vans-old-skool-detail-2.jpg", "/images/products/vans/vans-old-skool-detail-3.jpg"]'
        WHEN BrandID = 5 THEN '["/images/products/new-balance/new-balance-574-detail-1.jpg", "/images/products/new-balance/new-balance-574-detail-2.jpg", "/images/products/new-balance/new-balance-574-detail-3.jpg"]'
        ELSE '["/images/products/default/default-shoe-detail-1.jpg", "/images/products/default/default-shoe-detail-2.jpg", "/images/products/default/default-shoe-detail-3.jpg"]'
    END,
    ImageUpdatedAt = GETDATE();

-- 5. Kiểm tra kết quả
SELECT 
    ProductID,
    Name,
    BrandID,
    MainImage,
    LEFT(ThumbnailImages, 100) as ThumbnailImages_Preview,
    LEFT(DetailImages, 100) as DetailImages_Preview,
    ImageUpdatedAt
FROM Products 
ORDER BY BrandID, ProductID;

PRINT 'Đã sửa tất cả đường dẫn hình ảnh!';
PRINT 'Lưu ý: Bạn cần tạo thư mục và tải hình ảnh vào:';
PRINT '  - /public/images/products/nike/';
PRINT '  - /public/images/products/adidas/';
PRINT '  - /public/images/products/converse/';
PRINT '  - /public/images/products/vans/';
PRINT '  - /public/images/products/new-balance/';
PRINT '  - /public/images/products/default/';
GO
