
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoPerson, IoCart, IoSearch, IoMenu, IoClose } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import { onCartChange, getCartCount } from '../services/cartService';
import Cart from './Cart';
import './Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [cartVisible, setCartVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const location = useLocation();
  const [cartCount, setCartCount] = useState(getCartCount());
  const [searchTerm, setSearchTerm] = useState('');
  const [profileImageVersion, setProfileImageVersion] = useState(0);

  const base = process.env.PUBLIC_URL || '';

  // Debug logging để kiểm tra currentUser
  useEffect(() => {
    console.log('🔍 Header - currentUser changed:', currentUser);
    if (currentUser) {
      console.log('📝 User details:', {
        displayName: currentUser.displayName,
        email: currentUser.email,
        Username: currentUser.Username,
        username: currentUser.username,
        uid: currentUser.uid
      });
    }
  }, [currentUser]);

  // Hàm để lấy ảnh profile từ localStorage (base64) hoặc từ currentUser
  const getProfileImage = () => {
    if (!currentUser) return null;
    
    // Ưu tiên ảnh base64 từ localStorage
    const getUserIdentity = (user) => {
      return (
        user?.uid ||
        user?.email ||
        user?.Username ||
        user?.username ||
        user?.id ||
        'guest'
      );
    };
    
    const identity = getUserIdentity(currentUser);
    const localPhotoKey = `userPhotoBase64:${identity}`;
    
    try {
      const localPhoto = localStorage.getItem(localPhotoKey);
      if (localPhoto) {
        return localPhoto;
      }
    } catch {}
    
    // Fallback về photoURL từ currentUser
    if (currentUser.photoURL) {
      return currentUser.photoURL;
    }
    
    // Nếu không có ảnh nào, trả về null để hiển thị icon mặc định
    return null;
  };

  const profileImage = getProfileImage();

  // Hàm để lấy tên hiển thị của user
  const getUserDisplayName = () => {
    if (!currentUser) {
      console.log('👤 No currentUser found');
      return '';
    }
    
    console.log('👤 Current user object:', currentUser);
    console.log('👤 fullName:', currentUser.fullName);
    console.log('👤 displayName:', currentUser.displayName);
    console.log('👤 Username:', currentUser.Username);
    console.log('👤 username:', currentUser.username);
    console.log('👤 email:', currentUser.email);
    
    const displayName = currentUser.fullName || 
                       currentUser.displayName || 
                       currentUser.Username || 
                       currentUser.username || 
                       currentUser.email;
    
    console.log('👤 Final display name:', displayName);
    return displayName;
  };

  React.useEffect(() => {
    setCartCount(getCartCount());
    const off = onCartChange(() => setCartCount(getCartCount()));
    return off;
  }, []);

  // Lắng nghe thay đổi ảnh profile từ localStorage
  React.useEffect(() => {
    const handleStorageChange = () => {
      // Force re-render khi localStorage thay đổi
      setProfileImageVersion(prev => prev + 1);
    };

    // Lắng nghe sự kiện storage change
    window.addEventListener('storage', handleStorageChange);
    
    // Lắng nghe sự kiện custom khi ảnh profile thay đổi
    const handleProfileImageChange = () => {
      setProfileImageVersion(prev => prev + 1);
    };
    
    window.addEventListener('profileImageChanged', handleProfileImageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileImageChanged', handleProfileImageChange);
    };
  }, []);

  // Cập nhật profile image khi currentUser thay đổi
  React.useEffect(() => {
    if (currentUser) {
      console.log('🔄 Force updating profile image version');
      setProfileImageVersion(prev => prev + 1);
    }
  }, [currentUser]);

  // Force re-render khi currentUser thay đổi
  useEffect(() => {
    console.log('🔄 Header re-rendering due to currentUser change');
  }, [currentUser]);

  // Force re-render khi localStorage thay đổi
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('🔄 Storage changed, forcing re-render');
      setProfileImageVersion(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // Clear search after navigation
    }
  };

  return (
    <header className="header">
      {/* User Info Bar - Thanh nhỏ hiển thị thông tin user */}
      {currentUser && (
        <div className="user-info-bar">
          <div className="user-info-container">
            <div className="user-info-item">
              <Link to="/profile" className="user-info-avatar">
                {profileImage ? (
                  <img 
                    src={profileImage} 
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
              <Link to="/products?category=brands">BRANDS</Link>
              <Link to="/sale" className="sale-link">BACK TO SCHOOL SALE</Link>
            </nav>
          </div>

          <div className="header-right">
            <div className="header-links">
              <Link to="/help">Help</Link>
              <Link to="/order-tracker">Order Tracker</Link>
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
};

export default Header;
