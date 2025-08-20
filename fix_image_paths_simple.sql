USE [shopgiay]
GO

-- Cập nhật tất cả đường dẫn hình ảnh theo format đơn giản
-- /images/products/Tên-sản-phẩm/1.png, 2.png, 3.png

-- 1. Cập nhật MainImage (sử dụng 1.png)
UPDATE Products 
SET MainImage = CONCAT('/images/products/', 
    REPLACE(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(Name, ' ', '-'),
                        '(', ''),
                        ')', ''),
                    '/', '-'),
                '\\', '-'),
            '&', 'and'),
    '/1.png');

-- 2. Cập nhật ThumbnailImages (1.png, 2.png, 3.png)
UPDATE Products 
SET ThumbnailImages = CONCAT('["/images/products/', 
    REPLACE(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(Name, ' ', '-'),
                        '(', ''),
                        ')', ''),
                    '/', '-'),
                '\\', '-'),
            '&', 'and'),
    '/1.png", "/images/products/',
    REPLACE(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(Name, ' ', '-'),
                        '(', ''),
                        ')', ''),
                    '/', '-'),
                '\\', '-'),
            '&', 'and'),
    '/2.png", "/images/products/',
    REPLACE(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(Name, ' ', '-'),
                        '(', ''),
                        ')', ''),
                    '/', '-'),
                '\\', '-'),
            '&', 'and'),
    '/3.png"]');

-- 3. Cập nhật DetailImages (1.png, 2.png, 3.png)
UPDATE Products 
SET DetailImages = CONCAT('["/images/products/', 
    REPLACE(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(Name, ' ', '-'),
                        '(', ''),
                        ')', ''),
                    '/', '-'),
                '\\', '-'),
            '&', 'and'),
    '/1.png", "/images/products/',
    REPLACE(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(Name, ' ', '-'),
                        '(', ''),
                        ')', ''),
                    '/', '-'),
                '\\', '-'),
            '&', 'and'),
    '/2.png", "/images/products/',
    REPLACE(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(Name, ' ', '-'),
                        '(', ''),
                        ')', ''),
                    '/', '-'),
                '\\', '-'),
            '&', 'and'),
    '/3.png"]');

-- 4. Cập nhật thời gian
UPDATE Products 
SET ImageUpdatedAt = GETDATE();

-- 5. Kiểm tra kết quả
SELECT 
    ProductID,
    Name,
    MainImage,
    LEFT(ThumbnailImages, 100) as ThumbnailImages_Preview,
    LEFT(DetailImages, 100) as DetailImages_Preview,
    ImageUpdatedAt
FROM Products 
ORDER BY ProductID;

-- 6. Hiển thị cấu trúc thư mục cần tạo
SELECT DISTINCT
    CONCAT('Thư mục: /public/images/products/', 
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(
                            REPLACE(Name, ' ', '-'),
                            '(', ''),
                            ')', ''),
                        '/', '-'),
                    '\\', '-'),
                '&', 'and'),
        '/') as Directory_Structure,
    'Files: 1.png, 2.png, 3.png' as Required_Files
FROM Products 
ORDER BY Directory_Structure;

PRINT 'Đã cập nhật tất cả đường dẫn hình ảnh!';
PRINT 'Format mới: /images/products/Tên-sản-phẩm/1.png, 2.png, 3.png';
PRINT '';
PRINT 'Bạn cần tạo thư mục và tải hình ảnh theo cấu trúc trên.';
PRINT 'Ví dụ:';
PRINT '  - /public/images/products/Nike-Air-Zoom-Pegasus-40/1.png';
PRINT '  - /public/images/products/Nike-Air-Zoom-Pegasus-40/2.png';
PRINT '  - /public/images/products/Nike-Air-Zoom-Pegasus-40/3.png';
GO
