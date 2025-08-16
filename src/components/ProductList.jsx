import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from './Pagination';
import { allProducts } from '../data/allProducts';
import './ProductList.css';

export default function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12); // 4 hàng × 3 sản phẩm = 12

  // Sử dụng tất cả 100 sản phẩm từ file allProducts.js
  const products = allProducts;

  // Tính toán phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Xử lý thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Không scroll to top để giữ nguyên vị trí của người dùng
  };

  // Reset về trang 1 khi products thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <section className="products-section" id="products">
      <div className="products-container">
        <div className="products-header">
          <h2>TẤT CẢ SẢN PHẨM</h2>
          <div className="products-stats">
            <span>Tổng số sản phẩm: {products.length}</span>
            <span>Trang {currentPage} / {totalPages}</span>
          </div>
          <button className="filter-sort-btn">
            <i className="fas fa-filter"></i>
            Lọc & Sắp xếp
          </button>
        </div>

        <div className="products-grid">
          {currentProducts.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="product-card-link">
                <div className="product-image-container">
                  <img
                    src={product.MainImage}
                    alt={product.Name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div
                    className="product-image-placeholder"
                    style={{
                      display: 'none',
                      width: '100%',
                      height: '200px',
                      backgroundColor: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}
                  >
                    <i className="fas fa-image" style={{ fontSize: '24px', marginRight: '8px' }}></i>
                    {product.Name}
                  </div>
                  
                  {product.Discount > 0 && (
                    <div className="discount-badge">
                      -{product.Discount}%
                    </div>
                  )}
                </div>

                <div className="product-info">
                  <div className="product-category">{product.Category}</div>
                  <h3 className="product-name">{product.Name}</h3>
                  <div className="product-brand">{product.Brand}</div>
                  
                  <div className="product-price">
                    <span className="current-price">{formatPrice(product.Price)}</span>
                    {product.OriginalPrice > product.Price && (
                      <span className="original-price">{formatPrice(product.OriginalPrice)}</span>
                    )}
                  </div>
                  
                  <div className="product-colors">
                    {product.Colors.slice(0, 3).join(', ')}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Component phân trang */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalProducts={products.length}
          productsPerPage={productsPerPage}
        />
      </div>
    </section>
  );
}
