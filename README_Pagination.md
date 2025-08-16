# Hướng dẫn sử dụng tính năng phân trang 4×3

## Tổng quan
Tính năng phân trang đã được tích hợp vào ứng dụng với bố cục 4 hàng × 3 cột (tổng cộng 12 sản phẩm mỗi trang).

## Các component đã tạo

### 1. `Pagination.jsx`
- Component phân trang chính với giao diện đẹp
- Hiển thị thông tin về số sản phẩm đang xem
- Nút điều hướng Trước/Tiếp
- Số trang với ellipsis (...) cho các trang dài
- Responsive design

### 2. `Pagination.css`
- CSS cho component phân trang
- Thiết kế hiện đại với hover effects
- Responsive cho mobile, tablet và desktop

### 3. `PaginationDemo.jsx`
- Component demo để test tính năng phân trang
- Hiển thị 50 sản phẩm mẫu
- Bố cục 4×3 rõ ràng

### 4. `PaginationDemo.css`
- CSS cho component demo
- Grid layout 4×3 với responsive

## Cách sử dụng

### Trong ProductList.jsx
```jsx
import Pagination from './Pagination';

// State cho phân trang
const [currentPage, setCurrentPage] = useState(1);
const [productsPerPage] = useState(12); // 4 × 3 = 12

// Tính toán phân trang
const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
const totalPages = Math.ceil(products.length / productsPerPage);

// Xử lý thay đổi trang
const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Render component phân trang
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  totalProducts={products.length}
  productsPerPage={productsPerPage}
/>
```

### Trong CSS
```css
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 cột */
  grid-template-rows: repeat(4, auto); /* 4 hàng */
  gap: 30px;
  min-height: 800px;
}
```

## Tính năng chính

### 1. Bố cục cố định 4×3
- **Desktop**: 3 cột × 4 hàng = 12 sản phẩm
- **Tablet**: 2 cột × 6 hàng = 12 sản phẩm  
- **Mobile**: 1 cột × 12 hàng = 12 sản phẩm

### 2. Điều hướng thông minh
- Nút Trước/Tiếp với trạng thái disabled
- Số trang với ellipsis cho navigation dài
- Giữ nguyên vị trí scroll khi chuyển trang (UX tốt hơn)

### 3. Thông tin chi tiết
- Hiển thị sản phẩm đang xem (VD: 1-12 trong tổng số 100)
- Tổng số trang hiện tại
- Responsive design hoàn chỉnh

## Responsive Design

### Desktop (≥1024px)
- 3 cột × 4 hàng = 12 sản phẩm
- Gap: 30px

### Tablet (768px - 1023px)
- 2 cột × 6 hàng = 12 sản phẩm
- Gap: 20px

### Mobile (≤767px)
- 1 cột × 12 hàng = 12 sản phẩm
- Gap: 15px

## Tùy chỉnh

### Thay đổi số sản phẩm mỗi trang
```jsx
const [productsPerPage] = useState(24); // 6 × 4 = 24 sản phẩm
```

### Thay đổi bố cục grid
```css
.products-grid {
  grid-template-columns: repeat(4, 1fr); /* 4 cột */
  grid-template-rows: repeat(3, auto); /* 3 hàng */
}
```

### Tùy chỉnh style phân trang
```css
.page-number.active {
  background: #your-color;
  border-color: #your-color;
}
```

## Demo
Để test tính năng phân trang, sử dụng component `PaginationDemo`:
```jsx
import PaginationDemo from './components/PaginationDemo';

// Trong App.js hoặc route
<PaginationDemo />
```

## Lưu ý quan trọng

1. **Giữ vị trí scroll**: Không tự động scroll lên đầu khi chuyển trang (UX tốt hơn)
2. **State management**: Sử dụng React hooks để quản lý trang hiện tại
3. **Performance**: Chỉ render sản phẩm của trang hiện tại
4. **Accessibility**: Hỗ trợ keyboard navigation và screen readers
5. **SEO friendly**: URL có thể được cập nhật với query parameters

## Tích hợp với backend

Khi kết nối với API, có thể sử dụng:
```jsx
// API call với phân trang
const fetchProducts = async (page, limit) => {
  const response = await fetch(`/api/products?page=${page}&limit=${limit}`);
  return response.json();
};

// Sử dụng trong useEffect
useEffect(() => {
  fetchProducts(currentPage, productsPerPage);
}, [currentPage, productsPerPage]);
```

## Kết luận
Tính năng phân trang 4×3 đã được hoàn thiện với:
- ✅ Bố cục cố định 4 hàng × 3 cột
- ✅ Responsive design hoàn chỉnh
- ✅ Giao diện đẹp và dễ sử dụng
- ✅ Performance tối ưu
- ✅ Code sạch và dễ maintain
