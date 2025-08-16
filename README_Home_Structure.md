# Cấu trúc trang Home mới - UTH Shoes

## Tổng quan
Trang Home đã được cập nhật với cấu trúc mới bao gồm 3 phần sản phẩm chính:
1. **🔥 HOT PICKS** - Sản phẩm bán chạy nhất
2. **🆕 SẢN PHẨM MỚI** - Sản phẩm mới nhất
3. **TẤT CẢ SẢN PHẨM** - Danh sách đầy đủ với phân trang

## Cấu trúc trang Home

### 1. MainBanner
- Banner chính của trang web
- Giới thiệu thương hiệu UTH Shoes

### 2. CategoriesGrid
- Lưới danh mục sản phẩm
- Giúp người dùng dễ dàng tìm kiếm theo danh mục

### 3. 🔥 HOT PICKS
- **Vị trí**: Sau CategoriesGrid
- **Số lượng**: 3 sản phẩm
- **Tiêu chí**: Sản phẩm có lượt bán cao nhất (tạm thời chọn 3 sản phẩm đầu)
- **Thiết kế**: 
  - Background gradient xanh-tím
  - Badge "HOT" với animation pulse
  - Card trong suốt với backdrop blur
  - Hover effect nâng cao và scale

### 4. 🆕 SẢN PHẨM MỚI
- **Vị trí**: Sau HotPicks
- **Số lượng**: 3 sản phẩm
- **Tiêu chí**: Sản phẩm mới nhất (tạm thời chọn 3 sản phẩm cuối)
- **Thiết kế**:
  - Background gradient hồng-đỏ
  - Badge "NEW" với animation bounce
  - Card trong suốt với backdrop blur
  - Hover effect nâng cao và scale

### 5. TẤT CẢ SẢN PHẨM
- **Vị trí**: Sau NewProducts
- **Số lượng**: 100 sản phẩm với phân trang 4×3
- **Thiết kế**: 
  - Background trắng
  - Grid layout 3 cột × 4 hàng
  - Phân trang hoàn chỉnh
  - Responsive design

### 6. CollaborationBanner
- Banner cộng tác/cuối trang
- Thông tin liên hệ và social media

## Các component đã tạo

### HotPicks.jsx
- Component hiển thị sản phẩm bán chạy
- Sử dụng 3 sản phẩm đầu tiên từ `allProducts`
- Badge "HOT" với icon lửa
- Thống kê "Bán chạy"

### HotPicks.css
- CSS cho component HotPicks
- Background gradient xanh-tím
- Animation pulse cho badge
- Responsive design hoàn chỉnh

### NewProducts.jsx
- Component hiển thị sản phẩm mới
- Sử dụng 3 sản phẩm cuối cùng từ `allProducts`
- Badge "NEW" với icon sao
- Thống kê "Mới về"

### NewProducts.css
- CSS cho component NewProducts
- Background gradient hồng-đỏ
- Animation bounce cho badge
- Responsive design hoàn chỉnh

## Logic dữ liệu

### HotPicks
```javascript
// Tạm thời chọn 3 sản phẩm đầu tiên
const hotPicksProducts = allProducts.slice(0, 3);

// Khi có dữ liệu thực tế, sẽ thay bằng:
// const hotPicksProducts = allProducts
//   .sort((a, b) => b.salesCount - a.salesCount)
//   .slice(0, 3);
```

### NewProducts
```javascript
// Tạm thời chọn 3 sản phẩm cuối cùng
const newProducts = allProducts.slice(-3).reverse();

// Khi có dữ liệu thực tế, sẽ thay bằng:
// const newProducts = allProducts
//   .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//   .slice(0, 3);
```

## Responsive Design

### Desktop (≥1024px)
- HotPicks: 3 cột
- NewProducts: 3 cột
- ProductList: 3 cột × 4 hàng

### Tablet (768px - 1023px)
- HotPicks: 2 cột
- NewProducts: 2 cột
- ProductList: 2 cột × 6 hàng

### Mobile (≤767px)
- HotPicks: 1 cột
- NewProducts: 1 cột
- ProductList: 1 cột × 12 hàng

## Tính năng đặc biệt

### HotPicks
- Badge "HOT" với animation pulse
- Background gradient xanh-tím nổi bật
- Thống kê "Bán chạy" với icon chart

### NewProducts
- Badge "NEW" với animation bounce
- Background gradient hồng-đỏ thu hút
- Thống kê "Mới về" với icon clock

### Cả hai component
- Hover effect nâng cao và scale
- Backdrop blur cho card trong suốt
- Nút "Xem tất cả sản phẩm" với animation
- Responsive design hoàn chỉnh

## Tích hợp với backend

Khi có API thực tế, có thể cập nhật logic:

```javascript
// HotPicks - Sản phẩm bán chạy
const fetchHotPicks = async () => {
  const response = await fetch('/api/products/hot-picks?limit=3');
  return response.json();
};

// NewProducts - Sản phẩm mới
const fetchNewProducts = async () => {
  const response = await fetch('/api/products/new?limit=3');
  return response.json();
};
```

## Kết luận

Trang Home mới đã được thiết kế với:
- ✅ **3 phần sản phẩm rõ ràng**: HotPicks, NewProducts, AllProducts
- ✅ **Thiết kế nổi bật**: Gradient backgrounds, animations, hover effects
- ✅ **Responsive hoàn chỉnh**: Tối ưu cho mọi thiết bị
- ✅ **UX tốt**: Dễ dàng tìm kiếm và duyệt sản phẩm
- ✅ **Code sạch**: Component tách biệt, dễ maintain
- ✅ **Tương thích**: Sử dụng dữ liệu từ `allProducts.js`

Cấu trúc này giúp người dùng dễ dàng khám phá sản phẩm theo từng nhóm và tăng khả năng mua hàng!
