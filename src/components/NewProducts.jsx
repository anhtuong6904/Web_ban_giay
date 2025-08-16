import React from 'react';
import { Link } from 'react-router-dom';
import { allProducts } from '../data/allProducts';
import './NewProducts.css';

export default function NewProducts() {
  // Tạm thời chọn 3 sản phẩm cuối cùng làm sản phẩm mới
  // Khi có dữ liệu thực tế, sẽ thay bằng logic chọn sản phẩm mới nhất
  const newProducts = allProducts.slice(-3).reverse();

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <section className="new-products-section">
      <div className="new-products-container">
        <div className="new-products-header">
          <h2>🆕 SẢN PHẨM MỚI</h2>
          <p>Những sản phẩm mới nhất từ UTH Shoes</p>
        </div>

        <div className="new-products-grid">
          {newProducts.map((product) => (
            <div key={product.id} className="new-product-card">
              <Link to={`/product/${product.id}`} className="new-product-link">
                <div className="new-product-image-container">
                  <img
                    src={product.MainImage}
                    alt={product.Name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div
                    className="new-product-image-placeholder"
                    style={{
                      display: 'none',
                      width: '100%',
                      height: '250px',
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

                  <div className="new-badge">
                    <i className="fas fa-star"></i>
                    NEW
                  </div>

                  {product.Discount > 0 && (
                    <div className="discount-badge">
                      -{product.Discount}%
                    </div>
                  )}
                </div>

                <div className="new-product-info">
                  <div className="new-product-category">{product.Category}</div>
                  <h3 className="new-product-name">{product.Name}</h3>
                  <div className="new-product-brand">{product.Brand}</div>

                  <div className="new-product-price">
                    <span className="current-price">{formatPrice(product.Price)}</span>
                    {product.OriginalPrice > product.Price && (
                      <span className="original-price">{formatPrice(product.OriginalPrice)}</span>
                    )}
                  </div>

                  <div className="new-product-colors">
                    {product.Colors.slice(0, 3).join(', ')}
                  </div>

                  <div className="new-product-stats">
                    <span className="new-indicator">
                      <i className="fas fa-clock"></i>
                      Mới về
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="new-products-footer">
          <Link to="/products" className="view-all-btn">
            Xem tất cả sản phẩm
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
