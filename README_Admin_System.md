# 🚀 Hệ Thống Admin Dashboard - UTH Shoes

## 📋 Tổng Quan

Hệ thống admin dashboard được thiết kế để quản lý toàn bộ hoạt động của website bán giày UTH Shoes. Dashboard hiển thị dữ liệu thực tế từ localStorage và cho phép admin quản lý đơn hàng, sản phẩm, và khách hàng.

## ✨ Tính Năng Chính

### 1. 📊 Dashboard Tổng Quan
- **Thống kê doanh thu** theo thời gian thực
- **Số lượng đơn hàng** theo trạng thái
- **Tổng số khách hàng** và sản phẩm
- **Biểu đồ doanh thu** theo tháng (6 tháng gần nhất)
- **Top sản phẩm bán chạy** với số lượng đã bán
- **Auto-refresh** dữ liệu mỗi 30 giây

### 2. 📦 Quản Lý Đơn Hàng
- **Xem tất cả đơn hàng** từ tất cả khách hàng
- **Lọc theo trạng thái**: Chờ xử lý, Đang xử lý, Đã giao, Hoàn tất, Đã hủy
- **Cập nhật trạng thái** đơn hàng
- **Xem chi tiết** thông tin khách hàng và sản phẩm
- **Thống kê nhanh** số lượng đơn hàng theo trạng thái

### 3. 🔔 Thông Báo Real-time
- **Bell icon** với badge hiển thị số đơn hàng mới
- **Thông báo tự động** khi có đơn hàng mới
- **Kiểm tra mỗi 10 giây** để phát hiện đơn hàng mới
- **Đánh dấu đã đọc** và quản lý thông báo

### 4. 👥 Quản Lý Người Dùng
- **Xem danh sách** tất cả khách hàng đã đăng ký
- **Thông tin chi tiết** về khách hàng

### 5. 📦 Quản Lý Sản Phẩm
- **Xem danh sách** tất cả sản phẩm
- **Thống kê** sản phẩm bán chạy

## 🛠️ Cách Sử Dụng

### Truy Cập Admin Dashboard
1. Đăng nhập vào hệ thống
2. Truy cập `/admin` trong URL
3. Sẽ thấy sidebar admin với các menu

### Quản Lý Đơn Hàng
1. Vào menu **"Quản lý đơn hàng"**
2. Xem danh sách tất cả đơn hàng
3. **Lọc theo trạng thái** để dễ quản lý
4. **Cập nhật trạng thái** bằng dropdown
5. **Xem chi tiết** bằng nút "Chi tiết"

### Xử Lý Đơn Hàng Mới
1. Khi có đơn hàng mới, **bell icon** sẽ hiển thị số đơn hàng
2. Click vào bell để xem danh sách thông báo
3. Vào **"Quản lý đơn hàng"** để xử lý
4. Cập nhật trạng thái từ "Chờ xử lý" → "Đang xử lý" → "Đã giao" → "Hoàn tất"

## 📊 Trạng Thái Đơn Hàng

| Trạng Thái | Mô Tả | Màu Sắc |
|------------|-------|---------|
| `pending` | Chờ xử lý | 🟡 Vàng |
| `processing` | Đang xử lý | 🔵 Xanh dương |
| `delivered` | Đã giao | 🟢 Xanh lá |
| `completed` | Hoàn tất | 🟢 Xanh lá |
| `cancelled` | Đã hủy | 🔴 Đỏ |

## 🔄 Luồng Xử Lý Đơn Hàng

```
Khách hàng đặt hàng → pending → processing → delivered → completed
                    ↓
                cancelled (nếu hủy)
```

## 📱 Responsive Design

- **Desktop**: Sidebar cố định bên trái
- **Mobile**: Sidebar chuyển thành top navigation
- **Tablet**: Layout tự động điều chỉnh

## 🚨 Lưu Ý Quan Trọng

### Dữ Liệu Thực Tế
- Dashboard hiển thị dữ liệu **thực tế** từ localStorage
- **Không có dữ liệu mẫu** - tất cả đều từ hoạt động thực của website
- Dữ liệu **tự động cập nhật** mỗi 30 giây

### Bảo Mật
- Chỉ admin mới có thể truy cập dashboard
- Không thể xóa đơn hàng, chỉ có thể cập nhật trạng thái
- Tất cả thao tác đều được log

### Hiệu Suất
- Sử dụng **localStorage** để lưu trữ dữ liệu
- **Auto-refresh** để cập nhật dữ liệu mới
- **Lazy loading** cho các component lớn

## 🐛 Xử Lý Sự Cố

### Dashboard Không Hiển Thị Dữ Liệu
1. Kiểm tra localStorage có dữ liệu không
2. Refresh trang
3. Kiểm tra console để xem lỗi

### Không Thấy Đơn Hàng Mới
1. Kiểm tra bell icon có badge không
2. Vào "Quản lý đơn hàng" để xem trực tiếp
3. Refresh dữ liệu bằng nút "Làm mới"

### Lỗi Cập Nhật Trạng Thái
1. Kiểm tra console để xem lỗi
2. Refresh trang và thử lại
3. Kiểm tra quyền truy cập

## 🔮 Tính Năng Tương Lai

- [ ] **Export dữ liệu** ra Excel/PDF
- [ ] **Gửi email** thông báo cho khách hàng
- [ ] **Báo cáo chi tiết** theo thời gian
- [ ] **Quản lý kho** và cập nhật số lượng
- [ ] **Phân tích hành vi** khách hàng
- [ **Tích hợp** với hệ thống thanh toán thực tế

## 📞 Hỗ Trợ

Nếu gặp vấn đề hoặc cần hỗ trợ:
1. Kiểm tra console để xem lỗi
2. Xem README này để tìm giải pháp
3. Liên hệ developer để được hỗ trợ

---

**🎯 Mục Tiêu**: Tạo hệ thống admin hoàn chỉnh, dễ sử dụng, và hiển thị dữ liệu thực tế để quản lý website hiệu quả.
