-- Auto-assign Brand/Category/Gender by product name and set realistic prices
-- Safe to run multiple times

USE [shopgiay];
GO

PRINT '== Ensure core brands exist ==';
IF NOT EXISTS (SELECT 1 FROM Brands WHERE Name = 'Nike') INSERT INTO Brands(Name) VALUES ('Nike');
IF NOT EXISTS (SELECT 1 FROM Brands WHERE Name = 'Adidas') INSERT INTO Brands(Name) VALUES ('Adidas');
IF NOT EXISTS (SELECT 1 FROM Brands WHERE Name = 'Converse') INSERT INTO Brands(Name) VALUES ('Converse');
IF NOT EXISTS (SELECT 1 FROM Brands WHERE Name = 'Puma') INSERT INTO Brands(Name) VALUES ('Puma');
IF NOT EXISTS (SELECT 1 FROM Brands WHERE Name = 'New Balance') INSERT INTO Brands(Name) VALUES ('New Balance');
GO

PRINT '== Map BrandID by product name prefix ==';
UPDATE p SET BrandID = b.BrandID
FROM Products p
JOIN Brands b ON b.Name = 'Nike'
WHERE (p.BrandID IS NULL OR p.BrandID = 0) AND p.Name LIKE 'Nike %';

UPDATE p SET BrandID = b.BrandID
FROM Products p
JOIN Brands b ON b.Name = 'Adidas'
WHERE (p.BrandID IS NULL OR p.BrandID = 0) AND p.Name LIKE 'Adidas %';

UPDATE p SET BrandID = b.BrandID
FROM Products p
JOIN Brands b ON b.Name = 'Converse'
WHERE (p.BrandID IS NULL OR p.BrandID = 0) AND p.Name LIKE 'Converse %';

UPDATE p SET BrandID = b.BrandID
FROM Products p
JOIN Brands b ON b.Name = 'Puma'
WHERE (p.BrandID IS NULL OR p.BrandID = 0) AND p.Name LIKE 'Puma %';

UPDATE p SET BrandID = b.BrandID
FROM Products p
JOIN Brands b ON b.Name = 'New Balance'
WHERE (p.BrandID IS NULL OR p.BrandID = 0) AND p.Name LIKE 'New Balance %';
GO

PRINT '== Ensure base categories exist (Running/Casual/Basketball/Lifestyle) ==';
IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Running') INSERT INTO Categories(Name) VALUES ('Running');
IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Casual') INSERT INTO Categories(Name) VALUES ('Casual');
IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Basketball') INSERT INTO Categories(Name) VALUES ('Basketball');
IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Lifestyle') INSERT INTO Categories(Name) VALUES ('Lifestyle');
GO

PRINT '== Map CategoryID by simple name rules ==';
-- Basketball for "All Star BB" / "BB" lines
UPDATE p
SET CategoryID = c.CategoryID
FROM Products p
JOIN Categories c ON c.Name = 'Basketball'
WHERE (p.CategoryID IS NULL OR p.CategoryID = 0)
  AND (
        p.Name LIKE '% All Star BB%'
     OR p.Name LIKE '% BB%'
     OR p.Name LIKE '%Pro BB%'
  );

-- Running for Air Max, Pegasus, Ultraboost, Runner, RS, 2090/270/720, etc.
UPDATE p
SET CategoryID = c.CategoryID
FROM Products p
JOIN Categories c ON c.Name = 'Running'
WHERE (p.CategoryID IS NULL OR p.CategoryID = 0)
  AND (
        p.Name LIKE '%Air Max%'
     OR p.Name LIKE '%Pegasus%'
     OR p.Name LIKE '%Ultraboost%'
     OR p.Name LIKE '%Runner%'
     OR p.Name LIKE 'Nike Air Zoom%'
     OR p.Name LIKE '%2090%'
     OR p.Name LIKE '%270%'
     OR p.Name LIKE '%720%'
  );

-- Default Lifestyle for Converse, New Balance, Puma, Adidas Yeezy, and everything else not yet categorized
UPDATE p
SET CategoryID = c.CategoryID
FROM Products p
JOIN Categories c ON c.Name = 'Lifestyle'
LEFT JOIN Categories already ON already.CategoryID = p.CategoryID
WHERE (p.CategoryID IS NULL OR p.CategoryID = 0)
  AND (
        p.Name LIKE 'Converse %'
     OR p.Name LIKE 'New Balance %'
     OR p.Name LIKE 'Puma %'
     OR p.Name LIKE 'Adidas Yeezy%'
     OR 1 = 1 -- fallback any remaining uncategorized
  );
GO

PRINT '== Set Gender defaults and simple rules ==';
-- Use dynamic SQL to avoid compile-time error if column does not exist
IF EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'Products' AND COLUMN_NAME = 'Gender'
)
BEGIN
    DECLARE @sql NVARCHAR(MAX);
    SET @sql = N'UPDATE Products SET Gender = ''UNISEX'' WHERE Gender IS NULL OR LTRIM(RTRIM(COALESCE(Gender, ''''))) = '''';';
    EXEC sp_executesql @sql;

    SET @sql = N'UPDATE Products SET Gender = ''MEN'' WHERE Name LIKE ''% Men %'' OR Name LIKE ''Men %'' OR Name LIKE ''% Men'';';
    EXEC sp_executesql @sql;

    SET @sql = N'UPDATE Products SET Gender = ''WOMEN'' WHERE Name LIKE ''% Women %'' OR Name LIKE ''Women %'' OR Name LIKE ''% Women'';';
    EXEC sp_executesql @sql;

    SET @sql = N'UPDATE Products SET Gender = ''KIDS'' WHERE Name LIKE ''% Kids %'' OR Name LIKE ''Kids %'' OR Name LIKE ''% Kids'';';
    EXEC sp_executesql @sql;
END
GO

PRINT '== Update realistic prices for products with Price = 0 or NULL ==';
DECLARE @hasOriginalPrice BIT = CASE WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='Products' AND COLUMN_NAME='OriginalPrice') THEN 1 ELSE 0 END;
DECLARE @hasDiscount BIT = CASE WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='Products' AND COLUMN_NAME='Discount') THEN 1 ELSE 0 END;

DECLARE @sql NVARCHAR(MAX) = N'';
IF (@hasOriginalPrice = 1 AND @hasDiscount = 1)
BEGIN
    SET @sql = N'
    UPDATE p
    SET 
        OriginalPrice = calc.OriginalPrice,
        Discount = calc.Discount,
        Price = calc.Price
    FROM Products p
    LEFT JOIN Brands b ON p.BrandID = b.BrandID
    CROSS APPLY (
        SELECT 
            BaseMin = CASE b.Name
                WHEN ''Nike'' THEN 2500000
                WHEN ''Adidas'' THEN 2200000
                WHEN ''Converse'' THEN 1000000
                WHEN ''Puma'' THEN 1400000
                WHEN ''New Balance'' THEN 2300000
                ELSE 1500000
            END,
            BaseMax = CASE b.Name
                WHEN ''Nike'' THEN 3600000
                WHEN ''Adidas'' THEN 3200000
                WHEN ''Converse'' THEN 2000000
                WHEN ''Puma'' THEN 2400000
                WHEN ''New Balance'' THEN 3000000
                ELSE 2600000
            END,
            R1 = ABS(CHECKSUM(NEWID())),
            R2 = ABS(CHECKSUM(NEWID()))
    ) rnd
    CROSS APPLY (
        SELECT 
            OriginalPrice = ROUND( (rnd.BaseMin + (rnd.R1 % (rnd.BaseMax - rnd.BaseMin + 1))), -3 ),
            Discount = (rnd.R2 % 26)
    ) d
    CROSS APPLY (
        SELECT Price = CASE WHEN d.Discount = 0 THEN d.OriginalPrice ELSE ROUND(d.OriginalPrice * (100 - d.Discount) / 100.0, -3) END
    ) calc
    WHERE (p.Price IS NULL OR p.Price = 0);';
END
ELSE
BEGIN
    SET @sql = N'
    UPDATE p
    SET Price = calc.Price
    FROM Products p
    LEFT JOIN Brands b ON p.BrandID = b.BrandID
    CROSS APPLY (
        SELECT 
            BaseMin = CASE b.Name
                WHEN ''Nike'' THEN 2500000
                WHEN ''Adidas'' THEN 2200000
                WHEN ''Converse'' THEN 1000000
                WHEN ''Puma'' THEN 1400000
                WHEN ''New Balance'' THEN 2300000
                ELSE 1500000
            END,
            BaseMax = CASE b.Name
                WHEN ''Nike'' THEN 3600000
                WHEN ''Adidas'' THEN 3200000
                WHEN ''Converse'' THEN 2000000
                WHEN ''Puma'' THEN 2400000
                WHEN ''New Balance'' THEN 3000000
                ELSE 2600000
            END,
            R1 = ABS(CHECKSUM(NEWID()))
    ) rnd
    CROSS APPLY (
        SELECT Price = ROUND( (rnd.BaseMin + (rnd.R1 % (rnd.BaseMax - rnd.BaseMin + 1))), -3 )
    ) calc
    WHERE (p.Price IS NULL OR p.Price = 0);';
END

EXEC sp_executesql @sql;
GO

PRINT '== Summary ==';
SELECT 
    COUNT(*) AS TotalProducts,
    SUM(CASE WHEN Price <= 0 OR Price IS NULL THEN 1 ELSE 0 END) AS RemainingZeroPrice
FROM Products;

SELECT TOP 20 ProductID, Name, Price, OriginalPrice, Discount, BrandID, CategoryID, Gender
FROM Products
ORDER BY ProductID;
GO

PRINT 'Completed auto classification and pricing.';
GO

