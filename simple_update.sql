-- Script đơn giản để update bảng Products
-- Chạy từng phần một

-- PHẦN 1: Thêm các field mới
ALTER TABLE Products 
ADD MainImage NVARCHAR(500) NULL;

ALTER TABLE Products 
ADD ThumbnailImages NVARCHAR(MAX) NULL;

ALTER TABLE Products 
ADD DetailImages NVARCHAR(MAX) NULL;

ALTER TABLE Products 
ADD ColorImages NVARCHAR(MAX) NULL;

ALTER TABLE Products 
ADD ImageUpdatedAt DATETIME NULL;

-- PHẦN 2: Cập nhật dữ liệu mẫu
-- Sản phẩm 1: Campus 00S
UPDATE Products 
SET MainImage = '/images/products/campus-main.jpg',
    ThumbnailImages = '["/images/products/campus-side.jpg", "/images/products/campus-back.jpg", "/images/products/campus-sole.jpg"]',
    DetailImages = '["/images/products/campus-main.jpg", "/images/products/campus-side.jpg", "/images/products/campus-back.jpg", "/images/products/campus-sole.jpg"]',
    ColorImages = '{"white": "/images/products/campus-white.jpg", "black": "/images/products/campus-black.jpg", "cloud": "/images/products/campus-cloud.jpg"}',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 1;

-- Sản phẩm 2: Ultraboost  
UPDATE Products 
SET MainImage = '/images/products/ultraboost-main.jpg',
    ThumbnailImages = '["/images/products/ultraboost-side.jpg", "/images/products/ultraboost-back.jpg", "/images/products/ultraboost-sole.jpg"]',
    DetailImages = '["/images/products/ultraboost-main.jpg", "/images/products/ultraboost-side.jpg", "/images/products/ultraboost-back.jpg", "/images/products/ultraboost-sole.jpg"]',
    ColorImages = '{"black": "/images/products/ultraboost-black.jpg", "white": "/images/products/ultraboost-white.jpg"}',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 2;

-- PHẦN 3: Kiểm tra kết quả
SELECT 
    ProductID,
    Name,
    MainImage,
    LEFT(ThumbnailImages, 100) AS ThumbnailImages_Preview,
    LEFT(DetailImages, 100) AS DetailImages_Preview,
    LEFT(ColorImages, 100) AS ColorImages_Preview,
    ImageUpdatedAt
FROM Products 
WHERE MainImage IS NOT NULL
ORDER BY ProductID; 