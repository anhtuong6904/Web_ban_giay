import React from 'react';
import { Link } from 'react-router-dom';
import { allProducts } from '../data/allProducts';
import './HotPicks.css';

export default function HotPicks() {
  // Tạm thời chọn 3 sản phẩm đầu tiên làm HOT PICKS
  // Khi có dữ liệu thực tế, sẽ thay bằng logic chọn sản phẩm có lượt bán cao nhất
  const hotPicksProducts = allProducts.slice(0, 3);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <section className="hot-picks-section">
      <div className="hot-picks-container">
        <div className="hot-picks-header">
          <h2>🔥 HOT PICKS</h2>
          <p>Sản phẩm bán chạy nhất tuần này</p>
        </div>

        <div className="hot-picks-grid">
          {hotPicksProducts.map((product) => (
            <div key={product.id} className="hot-pick-card">
              <Link to={`/product/${product.id}`} className="hot-pick-link">
                <div className="hot-pick-image-container">
                  <img
                    src={product.MainImage}
                    alt={product.Name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div
                    className="hot-pick-image-placeholder"
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

                  <div className="hot-badge">
                    <i className="fas fa-fire"></i>
                    HOT
                  </div>

                  {product.Discount > 0 && (
                    <div className="discount-badge">
                      -{product.Discount}%
                    </div>
                  )}
                </div>

                <div className="hot-pick-info">
                  <div className="hot-pick-category">{product.Category}</div>
                  <h3 className="hot-pick-name">{product.Name}</h3>
                  <div className="hot-pick-brand">{product.Brand}</div>

                  <div className="hot-pick-price">
                    <span className="current-price">{formatPrice(product.Price)}</span>
                    {product.OriginalPrice > product.Price && (
                      <span className="original-price">{formatPrice(product.OriginalPrice)}</span>
                    )}
                  </div>

                  <div className="hot-pick-colors">
                    {product.Colors.slice(0, 3).join(', ')}
                  </div>

                  <div className="hot-pick-stats">
                    <span className="sales-count">
                      <i className="fas fa-chart-line"></i>
                      Bán chạy
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="hot-picks-footer">
          <Link to="/products" className="view-all-btn">
            Xem tất cả sản phẩm
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
