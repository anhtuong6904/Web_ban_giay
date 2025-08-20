import React from 'react';
import './MainBanner.css';
import CategoryChips from './CategoryChips';

export default function MainBanner() {
  const base = process.env.PUBLIC_URL || '';
  return (
    <section
      className="main-banner"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.45)), url(${base}/images/main-banner.png)`
      }}
    >
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
        
        <div className="banner-chips-wrap">
          <CategoryChips showTitle={false} />
        </div>

        <a href="#products" className="banner-cta">
          Shop Now
        </a>
      </div>
    </section>
  );
} 