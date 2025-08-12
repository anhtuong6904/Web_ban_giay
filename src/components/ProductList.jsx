import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };

  const calculateDiscountedPrice = (originalPrice, discount) => {
    return originalPrice - (originalPrice * discount / 100);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="products-section">
      <div className="products-container">
        {/* Filter & Sort Button */}
        <div className="products-header">
          <button className="filter-sort-btn">
            <i className="fas fa-bars"></i>
            FILTER & SORT
          </button>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {products.map(product => (
            <Link 
              key={product.ProductID} 
              to={`/product/${product.ProductID}`}
              className="product-card-link"
            >
              <div className="product-card">
                <div className="product-image">
                  <img src={product.MainImage} alt={product.Name} />
                  {product.Discount > 0 && (
                    <div className="discount-badge">
                      -{product.Discount}%
                    </div>
                  )}
                </div>
                
                <div className="product-info">
                  <div className="product-price">
                    <span className="current-price">
                      {formatPrice(product.Price)}₫
                    </span>
                    {product.OriginalPrice && product.OriginalPrice > product.Price && (
                      <span className="original-price">
                        {formatPrice(product.OriginalPrice)}₫
                      </span>
                    )}
                  </div>
                  
                  <h3 className="product-name">{product.Name}</h3>
                  
                  <div className="product-category">
                    {product.CategoryID === 1 && "Running"}
                    {product.CategoryID === 2 && "Casual"}
                    {product.CategoryID === 3 && "Basketball"}
                    {product.CategoryID === 4 && "Skateboarding"}
                    {product.CategoryID === 5 && "Lifestyle"}
                  </div>
                  
                  <div className="product-colors">
                    {product.ProductID === 1 && "2 colours"}
                    {product.ProductID === 2 && "1 colour"}
                    {product.ProductID === 3 && "2 colours"}
                    {product.ProductID === 4 && "2 colours"}
                    {product.ProductID === 5 && "2 colours"}
                    {product.ProductID === 6 && "2 colours"}
                  </div>
                  
                  <div className="member-offer">
                    Extra 10% off for adiclub members
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span>Page: 1 of 92</span>
          <button className="next-btn">NEXT</button>
        </div>
      </div>
    </div>
  );
}
