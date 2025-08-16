import React from 'react';
import './CollaborationBanner.css';

export default function CollaborationBanner() {
  return (
    <section className="collaboration-banner">
      {/* Decorative Elements */}
      <div className="collab-decoration"></div>
      <div className="collab-decoration"></div>
      <div className="collab-decoration"></div>
      
      <div className="collaboration-content">
        {/* Left Section - Brand Logo */}
        <div className="collab-left">
          <div className="collab-brand-logo">UTH SHOES</div>
          <div className="collab-brand-subtitle">Premium Collection</div>
        </div>
        
        {/* Center Section - Main Message */}
        <div className="collab-center">
          <h2 className="collab-main-title">
            KHÁM PHÁ BỘ SƯU TẬP MỚI
          </h2>
          <p className="collab-description">
            Hợp tác đặc biệt với các thương hiệu hàng đầu thế giới, mang đến những sản phẩm chất lượng cao nhất
          </p>
        </div>
        
        {/* Right Section - Product Showcase */}
        <div className="collab-right">
          <div className="collab-product-showcase">
            <div className="collab-product">
              Premium
            </div>
            <div className="collab-product secondary">
              Limited
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
