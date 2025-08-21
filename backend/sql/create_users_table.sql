-- Tạo bảng Users để lưu thông tin người dùng
USE shopgiay;

-- Kiểm tra và xóa bảng cũ nếu tồn tại
IF OBJECT_ID('Users', 'U') IS NOT NULL
    DROP TABLE Users;

-- Tạo bảng Users mới
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    FirebaseUID NVARCHAR(128) UNIQUE NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    DisplayName NVARCHAR(100),
    PhotoURL NVARCHAR(500),
    PhoneNumber NVARCHAR(20),
    DateOfBirth DATE,
    Gender NVARCHAR(10),
    Address NVARCHAR(500),
    City NVARCHAR(100),
    Country NVARCHAR(100) DEFAULT 'Vietnam',
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    LastLoginAt DATETIME2,
    IsActive BIT DEFAULT 1,
    Role NVARCHAR(20) DEFAULT 'customer'
);

-- Tạo index cho FirebaseUID và Email
CREATE INDEX IX_Users_FirebaseUID ON Users(FirebaseUID);
CREATE INDEX IX_Users_Email ON Users(Email);

-- Tạo bảng UserSessions để theo dõi phiên đăng nhập
IF OBJECT_ID('UserSessions', 'U') IS NOT NULL
    DROP TABLE UserSessions;

CREATE TABLE UserSessions (
    SessionID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    FirebaseUID NVARCHAR(128) NOT NULL,
    LoginAt DATETIME2 DEFAULT GETDATE(),
    LogoutAt DATETIME2,
    IPAddress NVARCHAR(45),
    UserAgent NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Tạo index cho UserSessions
CREATE INDEX IX_UserSessions_UserID ON UserSessions(UserID);
CREATE INDEX IX_UserSessions_FirebaseUID ON UserSessions(FirebaseUID);

-- Tạo bảng UserOrders để liên kết user với orders
IF OBJECT_ID('UserOrders', 'U') IS NOT NULL
    DROP TABLE UserOrders;

CREATE TABLE UserOrders (
    OrderID INT PRIMARY KEY,
    UserID INT NOT NULL,
    FirebaseUID NVARCHAR(128) NOT NULL,
    OrderDate DATETIME2 DEFAULT GETDATE(),
    TotalAmount DECIMAL(10,2),
    Status NVARCHAR(50),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Tạo index cho UserOrders
CREATE INDEX IX_UserOrders_UserID ON UserOrders(UserID);
CREATE INDEX IX_UserOrders_FirebaseUID ON UserOrders(FirebaseUID);

-- Thêm trigger để tự động cập nhật UpdatedAt
IF OBJECT_ID('TR_Users_UpdateTimestamp', 'TR') IS NOT NULL
    DROP TRIGGER TR_Users_UpdateTimestamp;

GO

CREATE TRIGGER TR_Users_UpdateTimestamp
ON Users
AFTER UPDATE
AS
BEGIN
    UPDATE Users 
    SET UpdatedAt = GETDATE()
    FROM Users u
    INNER JOIN inserted i ON u.UserID = i.UserID;
END

GO

-- Thêm dữ liệu mẫu (nếu cần)
-- INSERT INTO Users (FirebaseUID, Email, DisplayName, Role) 
-- VALUES ('sample-uid', 'admin@example.com', 'Admin User', 'admin');

PRINT 'Bảng Users, UserSessions và UserOrders đã được tạo thành công!';
PRINT 'Bảng Users có các cột: UserID, FirebaseUID, Email, DisplayName, PhotoURL, PhoneNumber, DateOfBirth, Gender, Address, City, Country, CreatedAt, UpdatedAt, LastLoginAt, IsActive, Role';
PRINT 'Bảng UserSessions để theo dõi phiên đăng nhập';
PRINT 'Bảng UserOrders để liên kết user với orders';
