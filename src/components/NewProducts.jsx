import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import './NewProducts.css';

export default function NewProducts() {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const allProducts = await getProducts();
        // Lấy 3 sản phẩm mới nhất (có thể sort theo CreatedAt hoặc lấy cuối mảng)
        const latestProducts = allProducts.slice(-3).reverse();
        setNewProducts(latestProducts);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm mới:', error);
        // Fallback: tạo 3 sản phẩm mẫu từ database mới
        setNewProducts([
          {
            ProductID: 1,
            Name: "Nike Air Zoom Pegasus 40",
            MainImage: "/images/products/giay-the-thao-1.jpg",
            Price: 1004719,
            OriginalPrice: 1145380,
            Discount: 12,
            Category: "Running",
            Brand: "Nike"
          },
          {
            ProductID: 2,
            Name: "Nike Air Force 1",
            MainImage: "/images/products/giay-the-thao-2.jpg",
            Price: 2599013,
            OriginalPrice: 2936885,
            Discount: 12,
            Category: "Casual",
            Brand: "Nike"
          },
          {
            ProductID: 3,
            Name: "Nike Air Max 270",
            MainImage: "/images/products/giay-the-thao-3.jpg",
            Price: 2095239,
            OriginalPrice: 2619049,
            Discount: 20,
            Category: "Lifestyle",
            Brand: "Nike"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  if (loading) {
    return (
      <section className="new-products-section">
        <div className="new-products-container">
          <div className="new-products-header">
            <h2>🆕 SẢN PHẨM MỚI</h2>
            <p>Những sản phẩm mới nhất từ các thương hiệu hàng đầu</p>
          </div>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải sản phẩm mới...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="new-products-section">
      <div className="new-products-container">
        <div className="new-products-header">
          <h2>NEW PRODUCTS</h2>
          <p>Step into the Future – Discover Our New Arrivals!</p>
        </div>

        <div className="new-products-grid">
          {newProducts.map((product) => (
            <div key={product.ProductID || product.id} className="new-product-card">
              <Link to={`/product/${product.ProductID || product.id}`} className="new-product-link">
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
          View All Products
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
