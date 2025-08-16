import React from 'react';
import './MainBanner.css';

export default function MainBanner() {
  return (
    <section className="main-banner">
      {/* Decorative Elements */}
      <div className="banner-decoration"></div>
      <div className="banner-decoration"></div>
      <div className="banner-decoration"></div>
      
      <div className="banner-container">
        <h1 className="banner-title">
          BACK TO SCHOOL SALE
        </h1>
        <p className="banner-subtitle">
          UP TO 40% OFF + EXTRA 10% FOR UTH SHOES MEMBERS
        </p>
        <p className="banner-description">
          Khám phá bộ sưu tập giày thể thao mới nhất với thiết kế hiện đại và công nghệ tiên tiến
        </p>
        
        <div className="banner-stats">
          <div className="stat-item">
            <span className="stat-number">4,376</span>
            <span className="stat-label">Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>
        
        <a href="#products" className="banner-cta">
          Shop Now
        </a>
      </div>
    </section>
  );
} 