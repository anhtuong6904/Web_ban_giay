import React, { useState } from 'react';
import { useLocation, Link} from 'react-router-dom';
import { IoPerson } from "react-icons/io5";
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
          <Link to="/login" className="person-btn">SIGN UP FOR FREE</Link>
        </div>
      </div>

      {/* Header chính */}
      <div className="header-main">
        <div className="header-container">
          {/* Logo */}
          <Link to="/home" className="home">
            <h1>UTH Shoes</h1>
          </Link>

          {/* Navigation */}
          <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
              <li><Link to="/shoes">SHOES</Link></li>
              <li><Link to="/men">MEN</Link></li>
              <li><Link to="/women">WOMEN</Link></li>
              <li><Link to="/kids">KIDS</Link></li>
              <li><Link to="/sports">SPORTS</Link></li>
              <li><Link to="/brands">BRANDS</Link></li>
              <li className="sale-link"><Link to="/sale">BACK TO SCHOOL SALE</Link></li>
            </ul>
          </nav>

          {/* Header actions */}
          <div className="header-actions">
            <Link to="/help" className="header-link">Help</Link>
            <Link to="/tracker" className="header-link">Order Tracker</Link>
            

            {/* Search, Cart, Flag buttons */}

            <Link to="/login" className="person-btn">
              <IoPerson className="person-icon" color='#000000'/>
            </Link>
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
      {location.pathname !== '/home' && (
        <div className="breadcrumb">
          <Link to = "/home" className='back-btn'> ← BACK Home / season sale </Link>
        </div>
      )}
    </header>
  );
}
