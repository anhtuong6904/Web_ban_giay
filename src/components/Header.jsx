import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IoPerson, IoSearch, IoCart, IoFlag } from 'react-icons/io5';
import './Header.css';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <header className="header">
      {/* Top Promo Banner */}
      <div className="promo-banner">
        <div className="promo-content">
          <span>BECOME A MEMBER & GET 15% OFF</span>
          {currentUser ? (
            <div className="welcome-section">
              <span className="welcome-text">Welcome back, {currentUser.displayName}!</span>
              <button className="logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login">SIGN UP FOR FREE</Link>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="header-container">
          {/* Logo */}
          <Link to="/home" className="logo">
            <div className="logo-icon">U</div>
            UTH Shoes
          </Link>

          {/* Navigation Menu */}
          <nav className="nav-menu">
            <li><Link to="/shoes">SHOES</Link></li>
            <li><Link to="/men">MEN</Link></li>
            <li><Link to="/women">WOMEN</Link></li>
            <li><Link to="/kids">KIDS</Link></li>
            <li><Link to="/sports">SPORTS</Link></li>
            <li><Link to="/brands">BRANDS</Link></li>
            <li><Link to="/sale" style={{ color: '#e74c3c', fontWeight: '700' }}>BACK TO SCHOOL SALE</Link></li>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            <Link to="/help" className="header-link">Help</Link>
            <Link to="/order-tracker" className="header-link">Order Tracker</Link>
            
            {currentUser ? (
              <Link to="/profile" className="profile-link">
                <IoPerson size={20} />
                <span className="profile-text">Profile</span>
              </Link>
            ) : (
              <Link to="/login" className="profile-link">
                <IoPerson size={20} />
                <span className="profile-text">Login</span>
              </Link>
            )}

            {/* Search Bar */}
            <div className="search-bar">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Bạn cần tìm gì..."
              />
              <IoSearch className="search-icon" size={18} />
            </div>

            {/* Cart */}
            <div className="cart-icon">
              <IoCart size={20} />
              <span className="cart-count">1</span>
            </div>

            {/* Language Selector */}
            <div className="language-selector">
              <IoFlag size={16} />
              <span>VN</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
