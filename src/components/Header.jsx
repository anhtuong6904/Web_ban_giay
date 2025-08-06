import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="header">
      {/* Banner khuyến mãi */}
      <div className="promo-banner">
        <div className="promo-content">
          <span>BECOME A MEMBER & GET 15% OFF</span>
          <button className="signup-btn">SIGN UP FOR FREE</button>
        </div>
      </div>

      {/* Header chính */}
      <div className="header-main">
        <div className="header-container">
          {/* Logo */}
          <div className="logo">
            <h1>UTH Shoes</h1>
          </div>

          {/* Navigation */}
          <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
              <li><a href="/shoes">SHOES</a></li>
              <li><a href="/men">MEN</a></li>
              <li><a href="/women">WOMEN</a></li>
              <li><a href="/kids">KIDS</a></li>
              <li><a href="/sports">SPORTS</a></li>
              <li><a href="/brands">BRANDS</a></li>
              <li className="sale-link"><a href="/sale">BACK TO SCHOOL SALE</a></li>
            </ul>
          </nav>

          {/* Header actions */}
          <div className="header-actions">
            <a href="/help" className="header-link">Help</a>
            <a href="/tracker" className="header-link">Order Tracker</a>
            <a href="/member" className="header-link">Become a Member</a>
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
            <button className="cart-btn">
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-count">1</span>
            </button>
            <button className="flag-btn">
              <span>🇻🇳</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Breadcrumb chỉ hiện khi không phải trang chủ */}
      {location.pathname !== '/' && (
        <div className="breadcrumb">
          <span>← BACK Home / season sale</span>
          <div className="easy-return">
            <span>EASY RETURN</span>
          </div>
        </div>
      )}
    </header>
  );
}