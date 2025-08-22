import React from 'react';
import { IoMail, IoCall, IoLocation, IoTime, IoLogoFacebook, IoLogoInstagram, IoLogoLinkedin, IoHome, IoSearch, IoPerson, IoCart, IoShirt, IoHeart } from 'react-icons/io5';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hàm scroll to top với smooth behavior
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Hàm xử lý click vào các link danh mục
  const handleCategoryClick = (tag) => {
    // Nếu đang ở trang products với tag khác, chỉ cần scroll to top
    if (location.pathname === '/products') {
      scrollToTop();
      // Có thể thêm logic để filter sản phẩm theo tag nếu cần
    } else {
      // Nếu đang ở trang khác, navigate về products và scroll to top
      navigate(`/products?tag=${tag}`);
      setTimeout(scrollToTop, 100); // Delay nhỏ để đảm bảo navigation hoàn thành
    }
  };

  // Hàm xử lý click vào các link trang chính
  const handlePageClick = (path) => {
    if (location.pathname === path) {
      // Nếu đang ở trang đó rồi, chỉ scroll to top
      scrollToTop();
    } else {
      // Nếu đang ở trang khác, navigate và scroll to top
      navigate(path);
      setTimeout(scrollToTop, 100);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Top */}
        <div className="footer-top">
          <div className="footer-section">
            <h3>🎯 Danh mục sản phẩm</h3>
            <ul>
              <li><button onClick={() => handleCategoryClick('shoes')} className="footer-link-btn">👟 Tất cả giày</button></li>
              <li><button onClick={() => handleCategoryClick('men')} className="footer-link-btn">👨 Giày nam</button></li>
              <li><button onClick={() => handleCategoryClick('women')} className="footer-link-btn">👩 Giày nữ</button></li>
              <li><button onClick={() => handleCategoryClick('kids')} className="footer-link-btn">👶 Giày trẻ em</button></li>
              <li><button onClick={() => handleCategoryClick('sports')} className="footer-link-btn">⚽ Giày thể thao</button></li>
              <li><button onClick={() => handlePageClick('/brands')} className="footer-link-btn">🏷️ Thương hiệu nổi tiếng</button></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>🔗 Trang chính</h3>
            <ul>
              <li><button onClick={() => handlePageClick('/')} className="footer-link-btn"><IoHome size={16} /> Trang chủ</button></li>
              <li><button onClick={() => handlePageClick('/products')} className="footer-link-btn"><IoSearch size={16} /> Tất cả sản phẩm</button></li>
              <li><button onClick={() => handlePageClick('/about')} className="footer-link-btn">📖 Giới thiệu</button></li>
              <li><button onClick={() => handlePageClick('/login')} className="footer-link-btn"><IoPerson size={16} /> Đăng nhập</button></li>
              <li><button onClick={() => handlePageClick('/register')} className="footer-link-btn"><IoPerson size={16} /> Đăng ký</button></li>
              <li><button onClick={() => handlePageClick('/cart')} className="footer-link-btn"><IoCart size={16} /> Giỏ hàng</button></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>💼 Dịch vụ khách hàng</h3>
            <ul>
              <li><button onClick={() => handlePageClick('/profile')} className="footer-link-btn"><IoPerson size={16} /> Thông tin cá nhân</button></li>
              <li><button onClick={() => handlePageClick('/order-tracker')} className="footer-link-btn">📦 Theo dõi đơn hàng</button></li>
              <li><button onClick={() => handlePageClick('/payment')} className="footer-link-btn">💳 Thanh toán</button></li>
              <li><button onClick={() => handlePageClick('/cart')} className="footer-link-btn">🛒 Quản lý giỏ hàng</button></li>
              <li><button onClick={() => handleCategoryClick('sports')} className="footer-link-btn">⚽ Hướng dẫn chọn giày thể thao</button></li>
              <li><button onClick={() => handleCategoryClick('brands')} className="footer-link-btn">🏷️ So sánh thương hiệu</button></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>📱 Kết nối với chúng tôi</h3>
            <div className="social-media">
              <a href="https://www.facebook.com/profile.php?id=61579607527088" className="social-link" aria-label="Facebook">
                <IoLogoFacebook size={20} />
              </a>
              <a href="https://www.instagram.com/lf.vgkiwt_03/" className="social-link" aria-label="Instagram">
                <IoLogoInstagram size={20} />
              </a>
              <a href="https://www.linkedin.com/in/gia-kiet-it-337342365/" className="social-link" aria-label="LinkedIn">
                <IoLogoLinkedin size={20} />
              </a>
            </div>
            <div className="contact-quick">
              <p><IoCall size={16} /> 0905 884 303</p>
              <p><IoMail size={16} /> chamsockhachhanguthshoes@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="featured-categories">
          <h3>⭐ Danh mục nổi bật</h3>
          <div className="category-links">
            <button onClick={() => handleCategoryClick('nike')} className="category-link">
              <IoShirt size={20} />
              <span>Nike</span>
            </button>
            <button onClick={() => handleCategoryClick('adidas')} className="category-link">
              <IoShirt size={20} />
              <span>Adidas</span>
            </button>
            <button onClick={() => handleCategoryClick('converse')} className="category-link">
              <IoShirt size={20} />
              <span>Converse</span>
            </button>
            <button onClick={() => handleCategoryClick('newbalance')} className="category-link">
              <IoShirt size={20} />
              <span>New Balance</span>
            </button>
            <button onClick={() => handleCategoryClick('puma')} className="category-link">
              <IoShirt size={20} />
              <span>Puma</span>
            </button>
          </div>
        </div>

        {/* Footer Contact */}
        <div className="footer-contact">
          <h3 className="contact-title">📍 Thông tin liên hệ</h3>
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <IoCall size={20} />
              </div>
              <div className="contact-details">
                <h4>Hotline</h4>
                <p>0905 884 303 (8h - 21h30)</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <IoMail size={20} />
              </div>
              <div className="contact-details">
                <h4>Email</h4>
                <p>chamsockhachhanguthshoes@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <IoLocation size={20} />
              </div>
              <div className="contact-details">
                <h4>Địa chỉ</h4>
                <p>36/65 Nguyễn Gia Trí, P25, Quận Bình Thạnh, TP Hồ Chí Minh</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <IoTime size={20} />
              </div>
              <div className="contact-details">
                <h4>Giờ làm việc</h4>
                <p>8h - 21h30 (Trừ ngày Lễ, Tết)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="newsletter">
          <h3>📧 Đăng ký nhận tin tức</h3>
          <p>Nhận thông tin về sản phẩm mới, khuyến mãi và xu hướng giày mới nhất</p>
          <form className="newsletter-form">
            <input 
              type="email" 
              className="newsletter-input" 
              placeholder="Nhập email của bạn..."
              required
            />
            <button type="submit" className="newsletter-btn">
              <IoHeart size={16} />
              Đăng ký
            </button>
          </form>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-links">
            <button onClick={() => handlePageClick('/about')} className="footer-link-btn">Về chúng tôi</button>
            <button onClick={() => handlePageClick('/products')} className="footer-link-btn">Sản phẩm</button>
            <button onClick={() => handlePageClick('/cart')} className="footer-link-btn">Giỏ hàng</button>
            <button onClick={() => handlePageClick('/profile')} className="footer-link-btn">Tài khoản</button>
            <button onClick={() => handlePageClick('/order-tracker')} className="footer-link-btn">Đơn hàng</button>
          </div>
          
          <div className="copyright">
            © 2025 UTH Shoes - Chuyên cung cấp giày thể thao chính hãng. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </div>
    </footer>
  );
}