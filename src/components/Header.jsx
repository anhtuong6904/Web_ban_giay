
import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IoPerson, IoSearch, IoFlag } from 'react-icons/io5';
import { MdOutlineShoppingCart } from "react-icons/md";
import { getCartCount, onCartChange } from '../services/cartService';
import Cart from './Cart';
import './Header.css';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const location = useLocation();
  const [cartCount, setCartCount] = useState(getCartCount());

  React.useEffect(() => {
    setCartCount(getCartCount());
    const off = onCartChange(() => setCartCount(getCartCount()));
    return off;
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/home');
  };


  const handleCartOpen = () => {
    setCartVisible(true);
    setClosing(false);
  };

  const handleCartClose = () => {
    setClosing(true);
    setTimeout(() => {
      setCartVisible(false);
    }, 300); // khớp thời gian CSS
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
            <li><Link to="/products?tag=shoes">SHOES</Link></li>
            <li><Link to="/products?tag=men">MEN</Link></li>
            <li><Link to="/products?tag=women">WOMEN</Link></li>
            <li><Link to="/products?tag=kids">KIDS</Link></li>
            <li><Link to="/products?tag=sports">SPORTS</Link></li>
            <li><Link to="/products?tag=brands">BRANDS</Link></li>
            <li><Link to="/sale" style={{ color: '#e74c3c', fontWeight: '700' }}>BACK TO SCHOOL SALE</Link></li>
          </nav>
          {/* Cart */}
            

          {/* Header Actions */}
          <div className="header-actions">
            <Link to="/help" className="header-link">Help</Link>

            <Link to="/order-tracker" className="header-link">Order Tracker</Link>

            <button className="cart-btn" onClick={() => navigate('/cart')}>
              <MdOutlineShoppingCart />
              <span className="cart-count">{cartCount}</span>
            </button> 
            
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
            

           

            {/* Language Selector */}
            <div className="language-selector">
              <IoFlag size={16} />
              <span>VN</span>
            </div>
            

          </div>
        </div>
      </div>
      {/* Cart popup */}
      {cartVisible && (
        <>
          {/* Overlay làm mờ trang */}
          <div
            className={`cart-backdrop ${closing ? 'closing' : 'opening'}`}
            onClick={handleCartClose}
          ></div>

          {/* Cart trượt vào */}
          <div className={`cart-overlay ${closing ? 'closing' : 'opening'}`}>
            <Cart isPopup={true} onClose={handleCartClose} />
          </div>
        </>
      )}
    </header>
  );
}
