# Hướng dẫn thêm 100 sản phẩm mới vào database shopgiay

## Tổng quan
Script này sẽ thêm 100 sản phẩm mới vào database `shopgiay` với format ảnh đơn giản và tên sản phẩm được tinh chỉnh.

## Format ảnh mới
- **MainImage**: `/images/products/giay-the-thao-1.jpg`
- **ThumbnailImages**: `["/images/products/giay-the-thao-2.jpg", "/images/products/giay-the-thao-3.jpg", "/images/products/giay-the-thao-4.jpg"]`
- **DetailImages**: `["/images/products/giay-the-thao-1.jpg", "/images/products/giay-the-thao-2.jpg", "/images/products/giay-the-thao-3.jpg", "/images/products/giay-the-thao-4.jpg"]`

## Các file SQL cần chạy theo thứ tự

### 1. `insert_100_products_complete.sql` (25 sản phẩm đầu tiên)
- Giày thể thao: 10 sản phẩm
- Giày chạy bộ: 4 sản phẩm  
- Giày đá banh: 3 sản phẩm
- Giày tây: 3 sản phẩm
- Dép: 3 sản phẩm
- Giày búp bê: 2 sản phẩm

### 2. `insert_100_products_part2.sql` (22 sản phẩm tiếp theo)
- Giày cao gót: 3 sản phẩm
- Giày lười: 3 sản phẩm
- Giày thể thao bổ sung: 2 sản phẩm
- Giày chạy bộ bổ sung: 2 sản phẩm
- Giày đá banh bổ sung: 2 sản phẩm
- Giày tây bổ sung: 2 sản phẩm
- Dép bổ sung: 2 sản phẩm
- Giày búp bê bổ sung: 2 sản phẩm
- Giày cao gót bổ sung: 2 sản phẩm
- Giày lười bổ sung: 2 sản phẩm

### 3. `insert_100_products_final.sql` (18 sản phẩm tiếp theo)
- Giày thể thao cuối cùng: 2 sản phẩm
- Giày chạy bộ cuối cùng: 2 sản phẩm
- Giày đá banh cuối cùng: 1 sản phẩm
- Giày tây cuối cùng: 1 sản phẩm
- Dép cuối cùng: 1 sản phẩm
- Giày búp bê cuối cùng: 1 sản phẩm
- Giày cao gót cuối cùng: 1 sản phẩm
- Giày lười cuối cùng: 1 sản phẩm
- Và các sản phẩm khác...

### 4. `insert_100_products_complete_final.sql` (16 sản phẩm tiếp theo)
- Giày thể thao cuối cùng: 2 sản phẩm
- Giày chạy bộ cuối cùng: 1 sản phẩm
- Giày đá banh cuối cùng: 1 sản phẩm
- Giày tây cuối cùng: 1 sản phẩm
- Dép cuối cùng: 1 sản phẩm
- Giày búp bê cuối cùng: 1 sản phẩm
- Giày cao gót cuối cùng: 1 sản phẩm
- Giày lười cuối cùng: 1 sản phẩm
- Và các sản phẩm khác...

### 5. `insert_100_products_final_complete.sql` (19 sản phẩm cuối cùng)
- Giày thể thao cuối cùng: 2 sản phẩm
- Giày chạy bộ cuối cùng: 1 sản phẩm
- Giày đá banh cuối cùng: 1 sản phẩm
- Giày tây cuối cùng: 1 sản phẩm
- Dép cuối cùng: 1 sản phẩm
- Giày búp bê cuối cùng: 1 sản phẩm
- Và các sản phẩm khác để đạt đủ 100 sản phẩm

## Cách sử dụng

### Bước 1: Mở SQL Server Management Studio (SSMS)
- Kết nối đến database `shopgiay`

### Bước 2: Chạy từng script theo thứ tự
1. Chạy `insert_100_products_complete.sql` trước
2. Sau đó chạy `insert_100_products_part2.sql`
3. Tiếp theo chạy `insert_100_products_final.sql`
4. Sau đó chạy `insert_100_products_complete_final.sql`
5. Cuối cùng chạy `insert_100_products_final_complete.sql`

### Bước 3: Kiểm tra kết quả
Mỗi script đều có câu `SELECT` để kiểm tra số lượng sản phẩm đã thêm.

## Lưu ý quan trọng
- **Đảm bảo database `shopgiay` đã tồn tại**
- **Đảm bảo các bảng `Categories` và `Brands` đã có dữ liệu**
- **Chạy đúng thứ tự các script để tránh lỗi**
- **Mỗi sản phẩm đều có đầy đủ MainImage, ThumbnailImages và DetailImages**

## Tổng kết
Sau khi chạy xong tất cả 5 script, bạn sẽ có:
- **100 sản phẩm mới** trong database
- **Format ảnh đơn giản** dễ quản lý
- **Tên sản phẩm được tinh chỉnh** ngắn gọn, dễ hiểu
- **Đầy đủ thông tin** về giá, mô tả, số lượng tồn kho

## Kiểm tra cuối cùng
Chạy câu lệnh sau để xác nhận đã có đủ 100 sản phẩm:
```sql
SELECT COUNT(*) as TotalProducts FROM [dbo].[Products];
```

Kết quả phải là: **100**
