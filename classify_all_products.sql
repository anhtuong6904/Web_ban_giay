-- Script phân loại tất cả sản phẩm vào các danh mục
-- Đảm bảo mỗi danh mục đều có sản phẩm
USE [shopgiay];
GO

-- Xóa dữ liệu cũ trong ProductCategories và ProductGenders
DELETE FROM ProductGenders;
DELETE FROM ProductCategories;
GO

-- 1. Phân loại sản phẩm theo danh mục chính
-- Running (CategoryID = 1)
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (1, 1, 1);   -- Nike Air Max 270
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (2, 1, 1);   -- Adidas Ultraboost 22
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (7, 1, 1);   -- Nike Zoom Fly
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (8, 1, 1);   -- Adidas Solar Boost
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (9, 1, 1);   -- Brooks Ghost 13
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (10, 1, 1);  -- Hoka Clifton 8

-- Casual (CategoryID = 2)
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (3, 2, 1);   -- Converse Chuck Taylor
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (11, 2, 1);  -- Vans Authentic
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (12, 2, 1);  -- Keds Champion
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (13, 2, 1);  -- Toms Classic
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (14, 2, 1);  -- Sperry Top-Sider

-- Basketball (CategoryID = 3)
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (6, 3, 1);   -- Jordan Air 1
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (15, 3, 1);  -- Nike LeBron 18
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (16, 3, 1);  -- Adidas Dame 7
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (17, 3, 1);  -- Under Armour Curry 8
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (18, 3, 1);  -- Puma Clyde All-Pro

-- Skateboarding (CategoryID = 4)
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (4, 4, 1);   -- Vans Old Skool
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (19, 4, 1);  -- Vans Sk8-Hi
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (20, 4, 1);  -- DC Shoes Kalis
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (21, 4, 1);  -- Etnies Jameson
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (22, 4, 1);  -- Element Helium

-- Lifestyle (CategoryID = 5)
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (5, 5, 1);   -- New Balance 574
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (23, 5, 1);  -- Adidas Stan Smith
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (24, 5, 1);  -- Nike Air Force 1
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (25, 5, 1);  -- Converse One Star
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (26, 5, 1);  -- Vans Era

-- Giày thể thao (CategoryID = 6)
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (27, 6, 1);  -- Nike Air Jordan 4
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (28, 6, 1);  -- Adidas Yeezy Boost 350
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (29, 6, 1);  -- Nike Air Max 90
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (30, 6, 1);  -- Adidas Ultraboost 21
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (31, 6, 1);  -- New Balance 990v5

-- Giày chạy bộ (CategoryID = 7)
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (32, 7, 1);  -- Nike Pegasus 38
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (33, 7, 1);  -- Adidas Boston 10
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (34, 7, 1);  -- Brooks Glycerin 19
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (35, 7, 1);  -- Saucony Ride 14
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (36, 7, 1);  -- Mizuno Wave Rider 25

-- Giày đá banh (CategoryID = 8)
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (37, 8, 1);  -- Nike Mercurial Vapor 14
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (38, 8, 1);  -- Adidas Predator Freak.1
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (39, 8, 1);  -- Puma Future 1.4
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (40, 8, 1);  -- Under Armour Magnetico Pro 2
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (41, 8, 1);  -- New Balance Furon 6.0

-- Giày tây (CategoryID = 9)
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (42, 9, 1);  -- Allen Edmonds Park Avenue
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (43, 9, 1);  -- Johnston & Murphy Melton
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (44, 9, 1);  -- Cole Haan GrandPro
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (45, 9, 1);  -- Florsheim Lexington
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (46, 9, 1);  -- Rockport World Tour

-- Dép (CategoryID = 10)
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (47, 10, 1); -- Birkenstock Arizona
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (48, 10, 1); -- Crocs Classic
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (49, 10, 1); -- Reef Fanning
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (50, 10, 1); -- Olukai Ohana
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (51, 10, 1); -- Sanuk Yoga Sling

-- Giày búp bê (CategoryID = 11)
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (52, 11, 1); -- Steve Madden Troopa
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (53, 11, 1); -- Dr. Martens 1460
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (54, 11, 1); -- Timberland 6-Inch Premium
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (55, 11, 1); -- Clarks Desert Boot
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (56, 11, 1); -- Red Wing Iron Ranger

-- Giày cao gót (CategoryID = 12)
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (57, 12, 1); -- Christian Louboutin Pigalle
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (58, 12, 1); -- Jimmy Choo Anouk
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (59, 12, 1); -- Manolo Blahnik Hangisi
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (60, 12, 1); -- Stuart Weitzman Nudist
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (61, 12, 1); -- Valentino Rockstud

-- Giày lười (CategoryID = 13)
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (62, 13, 1); -- Gucci Princetown
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (63, 13, 1); -- Tod's Gommino
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (64, 13, 1); -- Bottega Veneta Intrecciato
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (65, 13, 1); -- Salvatore Ferragamo Gancio
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (66, 13, 1); -- Prada Derby
GO

-- 2. Thêm danh mục phụ cho sản phẩm (để một sản phẩm có thể thuộc nhiều danh mục)
-- Nike Air Max 270 - thuộc cả Running và Giày thể thao
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (1, 6, 0);

-- Adidas Ultraboost 22 - thuộc cả Running và Giày chạy bộ
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (2, 7, 0);

-- Converse Chuck Taylor - thuộc cả Casual và Lifestyle
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (3, 5, 0);

-- Vans Old Skool - thuộc cả Skateboarding và Giày thể thao
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (4, 6, 0);

-- New Balance 574 - thuộc cả Lifestyle và Casual
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (5, 2, 0);

-- Jordan Air 1 - thuộc cả Basketball và Giày thể thao
INSERT INTO ProductCategories (ProductID, CategoryID, IsPrimary) VALUES (6, 6, 0);
GO

-- 3. Phân loại sản phẩm theo giới tính
-- Sản phẩm nam
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (1, 1);  -- Nike Air Max - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (2, 1);  -- Adidas Ultraboost - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (4, 1);  -- Vans Old Skool - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (5, 1);  -- New Balance 574 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (6, 1);  -- Jordan Air 1 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (7, 1);  -- Nike Zoom Fly - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (8, 1);  -- Adidas Solar Boost - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (9, 1);  -- Brooks Ghost 13 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (10, 1); -- Hoka Clifton 8 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (15, 1); -- Nike LeBron 18 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (16, 1); -- Adidas Dame 7 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (17, 1); -- Under Armour Curry 8 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (18, 1); -- Puma Clyde All-Pro - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (19, 1); -- Vans Sk8-Hi - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (20, 1); -- DC Shoes Kalis - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (21, 1); -- Etnies Jameson - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (22, 1); -- Element Helium - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (23, 1); -- Adidas Stan Smith - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (24, 1); -- Nike Air Force 1 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (25, 1); -- Converse One Star - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (26, 1); -- Vans Era - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (27, 1); -- Nike Air Jordan 4 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (28, 1); -- Adidas Yeezy Boost 350 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (29, 1); -- Nike Air Max 90 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (30, 1); -- Adidas Ultraboost 21 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (31, 1); -- New Balance 990v5 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (32, 1); -- Nike Pegasus 38 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (33, 1); -- Adidas Boston 10 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (34, 1); -- Brooks Glycerin 19 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (35, 1); -- Saucony Ride 14 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (36, 1); -- Mizuno Wave Rider 25 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (37, 1); -- Nike Mercurial Vapor 14 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (38, 1); -- Adidas Predator Freak.1 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (39, 1); -- Puma Future 1.4 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (40, 1); -- Under Armour Magnetico Pro 2 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (41, 1); -- New Balance Furon 6.0 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (42, 1); -- Allen Edmonds Park Avenue - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (43, 1); -- Johnston & Murphy Melton - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (44, 1); -- Cole Haan GrandPro - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (45, 1); -- Florsheim Lexington - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (46, 1); -- Rockport World Tour - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (47, 1); -- Birkenstock Arizona - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (48, 1); -- Crocs Classic - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (49, 1); -- Reef Fanning - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (50, 1); -- Olukai Ohana - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (51, 1); -- Sanuk Yoga Sling - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (52, 1); -- Steve Madden Troopa - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (53, 1); -- Dr. Martens 1460 - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (54, 1); -- Timberland 6-Inch Premium - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (55, 1); -- Clarks Desert Boot - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (56, 1); -- Red Wing Iron Ranger - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (62, 1); -- Gucci Princetown - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (63, 1); -- Tod's Gommino - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (64, 1); -- Bottega Veneta Intrecciato - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (65, 1); -- Salvatore Ferragamo Gancio - MEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (66, 1); -- Prada Derby - MEN

-- Sản phẩm nữ
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (3, 2);  -- Converse Chuck Taylor - WOMEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (11, 2); -- Vans Authentic - WOMEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (12, 2); -- Keds Champion - WOMEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (13, 2); -- Toms Classic - WOMEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (14, 2); -- Sperry Top-Sider - WOMEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (57, 2); -- Christian Louboutin Pigalle - WOMEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (58, 2); -- Jimmy Choo Anouk - WOMEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (59, 2); -- Manolo Blahnik Hangisi - WOMEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (60, 2); -- Stuart Weitzman Nudist - WOMEN
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (61, 2); -- Valentino Rockstud - WOMEN

-- Sản phẩm trẻ em
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (67, 3); -- Nike Air Jordan 1 Low - KIDS
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (68, 3); -- Adidas Ultraboost 21 - KIDS
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (69, 3); -- Converse Chuck Taylor - KIDS
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (70, 3); -- Vans Old Skool - KIDS
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (71, 3); -- New Balance 574 - KIDS
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (72, 3); -- Crocs Classic - KIDS
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (73, 3); -- Birkenstock Arizona - KIDS
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (74, 3); -- Timberland 6-Inch Premium - KIDS
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (75, 3); -- Dr. Martens 1460 - KIDS
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (76, 3); -- Clarks Desert Boot - KIDS

-- Sản phẩm unisex (dành cho cả nam và nữ)
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (1, 4);  -- Nike Air Max - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (2, 4);  -- Adidas Ultraboost - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (3, 4);  -- Converse Chuck Taylor - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (4, 4);  -- Vans Old Skool - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (5, 4);  -- New Balance 574 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (6, 4);  -- Jordan Air 1 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (7, 4);  -- Nike Zoom Fly - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (8, 4);  -- Adidas Solar Boost - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (9, 4);  -- Brooks Ghost 13 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (10, 4); -- Hoka Clifton 8 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (11, 4); -- Vans Authentic - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (12, 4); -- Keds Champion - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (13, 4); -- Toms Classic - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (14, 4); -- Sperry Top-Sider - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (15, 4); -- Nike LeBron 18 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (16, 4); -- Adidas Dame 7 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (17, 4); -- Under Armour Curry 8 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (18, 4); -- Puma Clyde All-Pro - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (19, 4); -- Vans Sk8-Hi - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (20, 4); -- DC Shoes Kalis - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (21, 4); -- Etnies Jameson - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (22, 4); -- Element Helium - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (23, 4); -- Adidas Stan Smith - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (24, 4); -- Nike Air Force 1 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (25, 4); -- Converse One Star - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (26, 4); -- Vans Era - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (27, 4); -- Nike Air Jordan 4 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (28, 4); -- Adidas Yeezy Boost 350 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (29, 4); -- Nike Air Max 90 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (30, 4); -- Adidas Ultraboost 21 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (31, 4); -- New Balance 990v5 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (32, 4); -- Nike Pegasus 38 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (33, 4); -- Adidas Boston 10 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (34, 4); -- Brooks Glycerin 19 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (35, 4); -- Saucony Ride 14 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (36, 4); -- Mizuno Wave Rider 25 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (37, 4); -- Nike Mercurial Vapor 14 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (38, 4); -- Adidas Predator Freak.1 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (39, 4); -- Puma Future 1.4 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (40, 4); -- Under Armour Magnetico Pro 2 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (41, 4); -- New Balance Furon 6.0 - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (47, 4); -- Birkenstock Arizona - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (48, 4); -- Crocs Classic - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (49, 4); -- Reef Fanning - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (50, 4); -- Olukai Ohana - UNISEX
INSERT INTO ProductGenders (ProductID, GenderCategoryID) VALUES (51, 4); -- Sanuk Yoga Sling - UNISEX
GO

-- 4. Kiểm tra kết quả phân loại
SELECT 'Categories' AS TableName, COUNT(*) AS RecordCount FROM Categories
UNION ALL
SELECT 'GenderCategories' AS TableName, COUNT(*) AS RecordCount FROM GenderCategories
UNION ALL
SELECT 'ProductCategories' AS TableName, COUNT(*) AS RecordCount FROM ProductCategories
UNION ALL
SELECT 'ProductGenders' AS TableName, COUNT(*) AS RecordCount FROM ProductGenders;
GO

-- 5. Hiển thị sản phẩm với danh mục và giới tính
SELECT TOP 20
    p.ProductID,
    p.Name,
    STUFF((
        SELECT ', ' + c.Name 
        FROM Categories c 
        JOIN ProductCategories pc ON c.CategoryID = pc.CategoryID 
        WHERE pc.ProductID = p.ProductID 
        FOR XML PATH('')
    ), 1, 2, '') AS Categories,
    STUFF((
        SELECT ', ' + gc.Name 
        FROM GenderCategories gc 
        JOIN ProductGenders pg ON gc.GenderCategoryID = pg.GenderCategoryID 
        WHERE pg.ProductID = p.ProductID 
        FOR XML PATH('')
    ), 1, 2, '') AS Genders
FROM Products p
GROUP BY p.ProductID, p.Name
ORDER BY p.ProductID;
GO

-- 6. Kiểm tra số lượng sản phẩm trong mỗi danh mục
SELECT 
    c.Name AS CategoryName,
    COUNT(pc.ProductID) AS ProductCount
FROM Categories c
LEFT JOIN ProductCategories pc ON c.CategoryID = pc.CategoryID
GROUP BY c.CategoryID, c.Name
ORDER BY c.CategoryID;
GO

-- 7. Kiểm tra số lượng sản phẩm theo giới tính
SELECT 
    gc.Name AS GenderName,
    COUNT(pg.ProductID) AS ProductCount
FROM GenderCategories gc
LEFT JOIN ProductGenders pg ON gc.GenderCategoryID = pg.GenderCategoryID
GROUP BY gc.GenderCategoryID, gc.Name
ORDER BY gc.GenderCategoryID;
GO

PRINT 'Phân loại sản phẩm hoàn tất!';
PRINT 'Tất cả danh mục đều có sản phẩm';
PRINT 'Một sản phẩm có thể thuộc nhiều danh mục khác nhau';
GO

