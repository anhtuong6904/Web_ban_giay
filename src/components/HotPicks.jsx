import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import './HotPicks.css';

export default function HotPicks() {
  const [hotPicksProducts, setHotPicksProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotPicks = async () => {
      try {
        const allProducts = await getProducts();
        // Lấy 3 sản phẩm có rating cao nhất hoặc bán chạy nhất
        const topProducts = allProducts
          .sort((a, b) => (b.Rating || 0) - (a.Rating || 0))
          .slice(0, 3);
        setHotPicksProducts(topProducts);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm hot picks:', error);
        // Fallback: tạo 3 sản phẩm mẫu từ database mới
        setHotPicksProducts([
          {
            ProductID: 4,
            Name: "Nike Air Max 90",
            MainImage: "/images/products/giay-the-thao-1.jpg",
            Price: 3007807,
            OriginalPrice: 3669525,
            Discount: 18,
            Category: "Lifestyle",
            Brand: "Nike",
            Rating: 5.0
          },
          {
            ProductID: 16,
            Name: "Adidas Superstar",
            MainImage: "/images/products/giay-the-thao-2.jpg",
            Price: 2968871,
            OriginalPrice: 3562645,
            Discount: 17,
            Category: "Casual",
            Brand: "Adidas",
            Rating: 4.9
          },
          {
            ProductID: 25,
            Name: "Converse Chuck Taylor All Star",
            MainImage: "/images/products/giay-the-thao-3.jpg",
            Price: 826197,
            OriginalPrice: 950127,
            Discount: 13,
            Category: "Casual",
            Brand: "Converse",
            Rating: 4.7
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotPicks();
  }, []);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  if (loading) {
    return (
      <section className="hot-picks-section">
        <div className="hot-picks-container">
          <div className="hot-picks-header">
            <h2>🔥 HOT PICKS</h2>
            <p>Sản phẩm bán chạy nhất tuần này</p>
          </div>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải sản phẩm hot picks...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hot-picks-section">
      <div className="hot-picks-container">
        <div className="hot-picks-header">
          <h2>🔥 HOT PICKS</h2>
          <p>Style That Sizzles – Our Hottest Picks!</p>
        </div>

        <div className="hot-picks-grid">
          {hotPicksProducts.map((product) => (
            <div key={product.ProductID || product.id} className="hot-pick-card">
              <Link to={`/product/${product.ProductID || product.id}`} className="hot-pick-link">
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

                  <div className="hot-pick-stats">
                    <span className="sales-count">
                      <i className="fas fa-chart-line"></i>
                      Rating: {product.Rating || 'N/A'}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="hot-picks-footer">
          <Link to="/products" className="view-all-btn">
            View All Products
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
