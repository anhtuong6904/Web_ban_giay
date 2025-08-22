import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoShirt, IoArrowForward, IoStar, IoHeart } from 'react-icons/io5';
import './Brands.css';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/brands');
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      } else {
        throw new Error('Không thể tải danh sách brands');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandClick = (brandName) => {
    // Navigate đến trang products với filter theo brand
    navigate(`/products?brandName=${encodeURIComponent(brandName)}`);
  };

  if (loading) {
    return (
      <div className="brands-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách thương hiệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brands-error">
        <h2>Lỗi</h2>
        <p>{error}</p>
        <button onClick={fetchBrands} className="retry-btn">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="brands-page">
      <div className="brands-container">
        {/* Header */}
        <div className="brands-header">
          <h1>🏷️ Thương hiệu nổi tiếng</h1>
          <p>Khám phá các thương hiệu giày uy tín và chất lượng hàng đầu thế giới</p>
        </div>

        {/* Brands Grid */}
        <div className="brands-grid">
          {brands.map((brand) => (
            <div 
              key={brand.BrandID} 
              className="brand-card"
              onClick={() => handleBrandClick(brand.Name)}
            >
              <div className="brand-logo">
                {brand.Logo ? (
                  <img src={brand.Logo} alt={`${brand.Name} logo`} />
                ) : (
                  <IoShirt size={60} />
                )}
              </div>
              
              <div className="brand-info">
                <h3 className="brand-name">{brand.Name}</h3>
                {brand.Description && (
                  <p className="brand-description">{brand.Description}</p>
                )}
                <div className="brand-stats">
                  <span className="product-count">
                    {brand.ProductCount || 0} sản phẩm
                  </span>
                  <div className="brand-rating">
                    <IoStar className="star-icon" />
                    <span>4.5+</span>
                  </div>
                </div>
              </div>
              
              <div className="brand-arrow">
                <IoArrowForward size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Featured Section */}
        <div className="featured-section">
          <h2>⭐ Thương hiệu được yêu thích nhất</h2>
          <div className="featured-brands">
            {brands.slice(0, 3).map((brand) => (
              <div 
                key={`featured-${brand.BrandID}`}
                className="featured-brand"
                onClick={() => handleBrandClick(brand.Name)}
              >
                <div className="featured-logo">
                  {brand.Logo ? (
                    <img src={brand.Logo} alt={`${brand.Name} logo`} />
                  ) : (
                    <IoShirt size={40} />
                  )}
                </div>
                <h4>{brand.Name}</h4>
                <p>{brand.ProductCount || 0} sản phẩm</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="brands-cta">
          <h3>🎯 Không tìm thấy thương hiệu yêu thích?</h3>
          <p>Khám phá tất cả sản phẩm của chúng tôi</p>
          <button 
            onClick={() => navigate('/products')}
            className="cta-button"
          >
            <IoHeart size={20} />
            Xem tất cả sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
