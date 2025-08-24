
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoCart, IoSearch, IoPerson, IoClose, IoHelpCircle, IoDocumentText } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import { onCartChange, getCartCount } from '../services/cartService';
import Cart from './Cart';
import './Header.css';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const [cartCount, setCartCount] = useState(getCartCount());
  const [cartVisible, setCartVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileImageVersion, setProfileImageVersion] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const base = process.env.PUBLIC_URL;

  useEffect(() => {
    if (currentUser) {
      loadOrderCount();
    }
    
    // Lắng nghe sự thay đổi trong localStorage để cập nhật order count
    const handleStorageChange = () => {
      if (currentUser) {
        loadOrderCount();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event để cập nhật order count khi có đơn hàng mới
    window.addEventListener('orderUpdated', loadOrderCount);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('orderUpdated', loadOrderCount);
    };
  }, [currentUser]);

  useEffect(() => {
    // Lắng nghe thay đổi giỏ hàng
    const unsubscribe = onCartChange((newCount) => {
      setCartCount(newCount);
    });

    return unsubscribe;
  }, []);

  const loadOrderCount = () => {
    try {
      if (currentUser) {
        const savedOrders = localStorage.getItem(`userOrders:${currentUser.uid || currentUser.email}`);
        if (savedOrders) {
          const orders = JSON.parse(savedOrders);
          setOrderCount(orders.length);
        } else {
          setOrderCount(0);
        }
      }
    } catch (error) {
      console.error('Error loading order count:', error);
      setOrderCount(0);
    }
  };

  // Function để refresh order count (có thể gọi từ bên ngoài)
  const refreshOrderCount = () => {
    loadOrderCount();
  };

  // Expose function để component khác có thể gọi
  useEffect(() => {
    window.refreshHeaderOrderCount = refreshOrderCount;
    return () => {
      delete window.refreshHeaderOrderCount;
    };
  }, []);

  // Debug logging để kiểm tra currentUser
  useEffect(() => {
    console.log('Current user in Header:', currentUser);
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCartOpen = () => {
    setCartVisible(true);
    setClosing(false);
  };

  const handleCartClose = () => {
    setClosing(true);
    setTimeout(() => {
      setCartVisible(false);
      setClosing(false);
    }, 300);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const getUserDisplayName = () => {
    if (currentUser) {
      return currentUser.displayName || currentUser.email || currentUser.Username || 'User';
    }
    return 'Guest';
  };

  const getProfileImage = () => {
    if (currentUser) {
      return currentUser.photoURL || currentUser.profileImage;
    }
    return null;
  };

  const handleProfileImageClick = () => {
    setProfileImageVersion(prev => prev + 1);
  };

  return (
    <header className="header">
      {/* Top Promo Banner */}
      <div className="promo-banner">
        <Link to="/sale">
          🎉 BACK TO SCHOOL SALE - Giảm giá lên đến 50% cho tất cả giày thể thao! 🎉
        </Link>
      </div>

      {/* User Info Bar */}
      {currentUser && (
        <div className="user-info-bar">
          <div className="user-info-container">
            <div className="user-info-item">
              <Link to="/profile" className="user-info-avatar" onClick={handleProfileImageClick}>
                {getProfileImage() ? (
                  <img 
                    src={getProfileImage()} 
                    alt="Avatar" 
                    key={profileImageVersion}
                  />
                ) : (
                  <IoPerson size={12} />
                )}
              </Link>
              <span className="user-info-name">
                Welcome, {getUserDisplayName()}
              </span>
            </div>
            <button onClick={handleLogout} className="user-info-logout">
              Đăng xuất
            </button>
          </div>
        </div>
      )}

      {/* Main Header - Navigation chính */}
      <div className="header-main">
        <div className="header-container">
          <div className="header-left">
            <Link to="/home" className="logo">
              <img src={`${base}/images/logo.png`} alt="Logo" className="logo-img" />
              <span>UTH Shoes</span>
            </Link>
          </div>

          <div className="header-center">
            <nav className="nav-menu">
              <Link to="/products?category=shoes">SHOES</Link>
              <Link to="/products?category=men">MEN</Link>
              <Link to="/products?category=women">WOMEN</Link>
              <Link to="/products?category=kids">KIDS</Link>
              <Link to="/products?category=sports">SPORTS</Link>
              <Link to="/sale" className="sale-link">BACK TO SCHOOL SALE</Link>
            </nav>
          </div>

          <div className="header-right">
            <div className="header-links">
              <Link to="/help" className="help-link">
                <IoHelpCircle size={18} />
                <span>Help</span>
              </Link>
              <Link to="/order-tracker" className="order-tracker-link">
                <IoDocumentText size={18} />
                <span>Order Tracker</span>
                {orderCount > 0 && (
                  <span className="order-count-badge">{orderCount}</span>
                )}
              </Link>
            </div>

            <button className="cart-btn" onClick={handleCartOpen}>
              <IoCart size={20} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>

            {!currentUser && (
              <div className="auth-buttons">
                <Link to="/login" className="auth-btn signin-btn">SIGN IN</Link>
                <Link to="/register" className="auth-btn signup-btn">SIGN UP</Link>
              </div>
            )}

            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch} className="search-button">
                <IoSearch />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Overlay */}
      {cartVisible && (
        <div 
          className={`cart-overlay ${closing ? 'closing' : ''}`}
          onClick={handleCartClose}
        />
      )}

      {/* Cart Sidebar */}
      {cartVisible && (
        <div className={`cart-sidebar visible ${closing ? 'closing' : ''}`}>
          <div className="cart-header">
            <h3>Giỏ hàng</h3>
            <button onClick={handleCartClose} className="close-btn">
              <IoClose size={24} />
            </button>
          </div>
          <Cart onClose={handleCartClose} isPopup={true} />
        </div>
      )}
    </header>
  );
}
