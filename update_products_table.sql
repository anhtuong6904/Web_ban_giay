-- Script để update bảng Products hiện tại
-- Thêm các field chứa ảnh sản phẩm

USE [WebShoesUTH]; -- Thay đổi tên database nếu cần

-- 1. Thêm các field mới vào bảng Products
ALTER TABLE Products 
ADD MainImage NVARCHAR(500) NULL,
    ThumbnailImages NVARCHAR(MAX) NULL,
    DetailImages NVARCHAR(MAX) NULL,
    ColorImages NVARCHAR(MAX) NULL,
    ImageUpdatedAt DATETIME NULL;

-- 2. Cập nhật dữ liệu mẫu cho các sản phẩm hiện tại
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

-- Sản phẩm 3: Stan Smith
UPDATE Products 
SET MainImage = '/images/products/stan-smith-main.jpg',
    ThumbnailImages = '["/images/products/stan-smith-side.jpg", "/images/products/stan-smith-back.jpg", "/images/products/stan-smith-sole.jpg"]',
    DetailImages = '["/images/products/stan-smith-main.jpg", "/images/products/stan-smith-side.jpg", "/images/products/stan-smith-back.jpg", "/images/products/stan-smith-sole.jpg"]',
    ColorImages = '{"white": "/images/products/stan-smith-white.jpg", "green": "/images/products/stan-smith-green.jpg"}',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 3;

-- Sản phẩm 4: Gazelle
UPDATE Products 
SET MainImage = '/images/products/gazelle-main.jpg',
    ThumbnailImages = '["/images/products/gazelle-side.jpg", "/images/products/gazelle-back.jpg", "/images/products/gazelle-sole.jpg"]',
    DetailImages = '["/images/products/gazelle-main.jpg", "/images/products/gazelle-side.jpg", "/images/products/gazelle-back.jpg", "/images/products/gazelle-sole.jpg"]',
    ColorImages = '{"blue": "/images/products/gazelle-blue.jpg", "red": "/images/products/gazelle-red.jpg"}',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 4;

-- Sản phẩm 5: Superstar
UPDATE Products 
SET MainImage = '/images/products/superstar-main.jpg',
    ThumbnailImages = '["/images/products/superstar-side.jpg", "/images/products/superstar-back.jpg", "/images/products/superstar-sole.jpg"]',
    DetailImages = '["/images/products/superstar-main.jpg", "/images/products/superstar-side.jpg", "/images/products/superstar-back.jpg", "/images/products/superstar-sole.jpg"]',
    ColorImages = '{"white": "/images/products/superstar-white.jpg", "black": "/images/products/superstar-black.jpg"}',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 5;

-- Sản phẩm 6: NMD
UPDATE Products 
SET MainImage = '/images/products/nmd-main.jpg',
    ThumbnailImages = '["/images/products/nmd-side.jpg", "/images/products/nmd-back.jpg", "/images/products/nmd-sole.jpg"]',
    DetailImages = '["/images/products/nmd-main.jpg", "/images/products/nmd-side.jpg", "/images/products/nmd-back.jpg", "/images/products/nmd-sole.jpg"]',
    ColorImages = '{"black": "/images/products/nmd-black.jpg", "white": "/images/products/nmd-white.jpg"}',
    ImageUpdatedAt = GETDATE()
WHERE ProductID = 6;

-- 3. Tạo index để tối ưu performance
CREATE INDEX IX_Products_MainImage ON Products(MainImage);
CREATE INDEX IX_Products_ImageUpdatedAt ON Products(ImageUpdatedAt);

-- 4. Thêm constraint để đảm bảo MainImage không rỗng
ALTER TABLE Products 
ADD CONSTRAINT CK_Products_MainImage_NotEmpty 
CHECK (MainImage IS NOT NULL AND LEN(TRIM(MainImage)) > 0);

-- 5. Tạo view để dễ dàng query ảnh sản phẩm
CREATE VIEW vw_ProductImages AS
SELECT 
    p.ProductID,
    p.Name,
    p.MainImage,
    p.ThumbnailImages,
    p.DetailImages,
    p.ColorImages,
    p.ImageUpdatedAt,
    p.Price,
    p.Discount,
    p.CategoryID
FROM Products p
WHERE p.IsActive = 1;

-- 6. Tạo stored procedure để lấy ảnh sản phẩm
CREATE PROCEDURE sp_GetProductImages
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ProductID,
        Name,
        MainImage,
        ThumbnailImages,
        DetailImages,
        ColorImages,
        ImageUpdatedAt
    FROM Products 
    WHERE ProductID = @ProductID AND IsActive = 1;
END;

-- 7. Tạo stored procedure để cập nhật ảnh sản phẩm
CREATE PROCEDURE sp_UpdateProductImages
    @ProductID INT,
    @MainImage NVARCHAR(500),
    @ThumbnailImages NVARCHAR(MAX) = NULL,
    @DetailImages NVARCHAR(MAX) = NULL,
    @ColorImages NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Products 
    SET MainImage = @MainImage,
        ThumbnailImages = @ThumbnailImages,
        DetailImages = @DetailImages,
        ColorImages = @ColorImages,
        ImageUpdatedAt = GETDATE()
    WHERE ProductID = @ProductID;
    
    IF @@ROWCOUNT > 0
        SELECT 'Success' AS Result, 'Product images updated successfully' AS Message;
    ELSE
        SELECT 'Error' AS Result, 'Product not found or no changes made' AS Message;
END;

-- 8. Kiểm tra kết quả
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

PRINT 'Update bảng Products hoàn tất!';
PRINT 'Đã thêm các field: MainImage, ThumbnailImages, DetailImages, ColorImages, ImageUpdatedAt';
PRINT 'Đã tạo view: vw_ProductImages';
PRINT 'Đã tạo stored procedures: sp_GetProductImages, sp_UpdateProductImages'; 