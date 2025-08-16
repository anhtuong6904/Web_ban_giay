import React, { useState } from 'react';
import Pagination from './Pagination';
import './PaginationDemo.css';

export default function PaginationDemo() {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12); // 4 hàng × 3 sản phẩm = 12

  // Tạo dữ liệu demo với 50 sản phẩm
  const demoProducts = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Sản phẩm ${index + 1}`,
    price: Math.floor(Math.random() * 1000000) + 200000,
    category: `Danh mục ${Math.floor(index / 10) + 1}`
  }));

  // Tính toán phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = demoProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(demoProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Không scroll to top để giữ nguyên vị trí của người dùng
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <div className="pagination-demo">
      <div className="demo-header">
        <h1>Demo Phân Trang 4×3</h1>
        <p>Mỗi trang hiển thị 12 sản phẩm (4 hàng × 3 cột)</p>
        <div className="demo-stats">
          <span>Tổng số sản phẩm: {demoProducts.length}</span>
          <span>Sản phẩm mỗi trang: {productsPerPage}</span>
          <span>Tổng số trang: {totalPages}</span>
        </div>
      </div>

      <div className="demo-grid">
        {currentProducts.map((product) => (
          <div key={product.id} className="demo-product-card">
            <div className="demo-product-image">
              <span className="product-number">{product.id}</span>
            </div>
            <div className="demo-product-info">
              <h3>{product.name}</h3>
              <p className="demo-category">{product.category}</p>
              <p className="demo-price">{formatPrice(product.price)}</p>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalProducts={demoProducts.length}
        productsPerPage={productsPerPage}
      />

      <div className="demo-info">
        <h3>Thông tin về phân trang:</h3>
        <ul>
          <li><strong>Bố cục:</strong> 4 hàng × 3 cột = 12 sản phẩm mỗi trang</li>
          <li><strong>Trang hiện tại:</strong> {currentPage}</li>
          <li><strong>Sản phẩm hiển thị:</strong> {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, demoProducts.length)}</li>
          <li><strong>Responsive:</strong> Tự động điều chỉnh theo kích thước màn hình</li>
        </ul>
      </div>
    </div>
  );
}
