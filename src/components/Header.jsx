
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoPerson, IoCart, IoSearch, IoMenu, IoClose } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import { onCartChange, getCartCount } from '../services/cartService';
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
    return currentUser.photoURL;
  };

  const profileImage = getProfileImage();

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
      <div className="header-container">
        <div className="header-left">
          <Link to="/home" className="logo">
            <img src={`${base}/images/logo.png`} alt="Logo" />
          </Link>
        </div>

        <div className="header-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="search-button">
              <IoSearch />
            </button>
          </div>
        </div>

        <div className="header-right">
          <nav className="nav-menu">
            <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
              Trang chủ
            </Link>
            <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>
              Sản phẩm
            </Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              Giới thiệu
            </Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
              Liên hệ
            </Link>
          </nav>

          <div className="user-actions">
            {currentUser ? (
              <>
                <div className="user-avatar">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Avatar" 
                      key={profileImageVersion} // Force re-render khi ảnh thay đổi
                    />
                  ) : (
                    <IoPerson size={20} />
                  )}
                </div>
                <div className="user-menu">
                  <Link to="/profile">Hồ sơ</Link>
                  <Link to="/order-tracker">Đơn hàng</Link>
                  <button onClick={handleLogout}>Đăng xuất</button>
                </div>
              </>
            ) : (
              <Link to="/login" className="login-btn">
                <IoPerson size={20} />
                Đăng nhập
              </Link>
            )}

            <button className="cart-btn" onClick={handleCartOpen}>
              <IoCart size={20} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {cartVisible && (
        <div className={`cart-sidebar ${closing ? 'closing' : ''}`}>
          <div className="cart-header">
            <h3>Giỏ hàng</h3>
            <button onClick={handleCartClose} className="close-btn">
              <IoClose size={24} />
            </button>
          </div>
          <Cart />
        </div>
      )}
    </header>
  );
};

export default Header;
