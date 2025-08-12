-- Script kiểm tra và update bảng Products
-- Chạy từng phần để tránh lỗi

-- PHẦN 1: Kiểm tra cấu trúc bảng hiện tại
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Products'
ORDER BY ORDINAL_POSITION;

-- PHẦN 2: Kiểm tra field nào đã có, field nào chưa có
-- Chạy từng lệnh một và kiểm tra kết quả

-- Kiểm tra MainImage
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Products' AND COLUMN_NAME = 'MainImage')
BEGIN
    ALTER TABLE Products ADD MainImage NVARCHAR(500) NULL;
    PRINT 'Đã thêm field MainImage';
END
ELSE
BEGIN
    PRINT 'Field MainImage đã tồn tại';
END

-- Kiểm tra ThumbnailImages
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Products' AND COLUMN_NAME = 'ThumbnailImages')
BEGIN
    ALTER TABLE Products ADD ThumbnailImages NVARCHAR(MAX) NULL;
    PRINT 'Đã thêm field ThumbnailImages';
END
ELSE
BEGIN
    PRINT 'Field ThumbnailImages đã tồn tại';
END

-- Kiểm tra DetailImages
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Products' AND COLUMN_NAME = 'DetailImages')
BEGIN
    ALTER TABLE Products ADD DetailImages NVARCHAR(MAX) NULL;
    PRINT 'Đã thêm field DetailImages';
END
ELSE
BEGIN
    PRINT 'Field DetailImages đã tồn tại';
END

-- Kiểm tra ColorImages
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Products' AND COLUMN_NAME = 'ColorImages')
BEGIN
    ALTER TABLE Products ADD ColorImages NVARCHAR(MAX) NULL;
    PRINT 'Đã thêm field ColorImages';
END
ELSE
BEGIN
    PRINT 'Field ColorImages đã tồn tại';
END

-- Kiểm tra ImageUpdatedAt
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Products' AND COLUMN_NAME = 'ImageUpdatedAt')
BEGIN
    ALTER TABLE Products ADD ImageUpdatedAt DATETIME NULL;
    PRINT 'Đã thêm field ImageUpdatedAt';
END
ELSE
BEGIN
    PRINT 'Field ImageUpdatedAt đã tồn tại';
END

-- PHẦN 3: Kiểm tra cấu trúc bảng sau khi update
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Products'
ORDER BY ORDINAL_POSITION;

-- PHẦN 4: Cập nhật dữ liệu mẫu (chỉ cho sản phẩm chưa có ảnh)
-- Sản phẩm 1: Campus 00S
UPDATE Products 
SET MainImage = '/images/products/campus-main.jpg',
    ThumbnailImages = '["/images/products/campus-side.jpg", "/images/products/campus-back.jpg", "/images/products/campus-sole.jpg"]',
    DetailImages = '["/images/products/campus-main.jpg", "/images/products/campus-side.jpg", "/images/products/campus-back.jpg", "/images/products/campus-sole.jpg"]',
    ColorImages = '{"white": "/images/products/campus-white.jpg", "black": "/images/products/campus-black.jpg", "cloud": "/images/products/campus-cloud.jpg"}',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 1 AND (MainImage IS NULL OR MainImage = '');

-- Sản phẩm 2: Ultraboost  
UPDATE Products 
SET MainImage = '/images/products/ultraboost-main.jpg',
    ThumbnailImages = '["/images/products/ultraboost-side.jpg", "/images/products/ultraboost-back.jpg", "/images/products/ultraboost-sole.jpg"]',
    DetailImages = '["/images/products/ultraboost-main.jpg", "/images/products/ultraboost-side.jpg", "/images/products/ultraboost-back.jpg", "/images/products/ultraboost-sole.jpg"]',
    ColorImages = '{"black": "/images/products/ultraboost-black.jpg", "white": "/images/products/ultraboost-white.jpg"}',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 2 AND (MainImage IS NULL OR MainImage = '');

-- PHẦN 5: Kiểm tra kết quả cuối cùng
SELECT 
    ProductID,
    Name,
    MainImage,
    LEFT(ThumbnailImages, 100) AS ThumbnailImages_Preview,
    LEFT(DetailImages, 100) AS DetailImages_Preview,
    LEFT(ColorImages, 100) AS ColorImages_Preview,
    ImageUpdatedAt
FROM Products 
ORDER BY ProductID; 