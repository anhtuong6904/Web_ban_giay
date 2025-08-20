import React from 'react';
import { IoMail, IoCall, IoLocation, IoTime, IoLogoFacebook, IoLogoInstagram, IoLogoLinkedin } from 'react-icons/io5';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Top */}
        <div className="footer-top">
          <div className="footer-section">
            <h3>Về UTH Shoes</h3>
            <ul>
              <li><a href="/about">Giới thiệu</a></li>
              <li><a href="/careers">Tuyển dụng</a></li>
              <li><a href="/press">Báo chí</a></li>
              <li><a href="/contact">Liên hệ</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Hỗ trợ khách hàng</h3>
            <ul>
              <li><a href="/help">Trung tâm trợ giúp</a></li>
              <li><a href="/shipping">Vận chuyển & Giao hàng</a></li>
              <li><a href="/returns">Đổi trả & Hoàn tiền</a></li>
              <li><a href="/size-guide">Hướng dẫn chọn size</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Chính sách</h3>
            <ul>
              <li><a href="/privacy">Chính sách bảo mật</a></li>
              <li><a href="/terms">Điều khoản sử dụng</a></li>
              <li><a href="/warranty">Chính sách bảo hành</a></li>
              <li><a href="/loyalty">Chương trình khách hàng thân thiết</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Kết nối với chúng tôi</h3>
            <div className="social-media">
              <a href="https://www.facebook.com/giakiet1803/" className="social-link" aria-label="Facebook">
                <IoLogoFacebook size={20} />
              </a>
              <a href="https://www.instagram.com/lf.vgkiwt_03/" className="social-link" aria-label="Instagram">
                <IoLogoInstagram size={20} />
              </a>
              <a href="https://www.linkedin.com/in/gia-kiet-it-337342365/" className="social-link" aria-label="Linkedln">
                <IoLogoLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Contact */}
        <div className="footer-contact">
          <h3 className="contact-title">Thông tin liên hệ</h3>
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
          <h3>Đăng ký nhận tin tức</h3>
          <form className="newsletter-form">
            <input 
              type="email" 
              className="newsletter-input" 
              placeholder="Nhập email của bạn..."
              required
            />
            <button type="submit" className="newsletter-btn">
              Đăng ký
            </button>
          </form>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-links">
            <a href="/terms">Điều khoản</a>
            <a href="/privacy">Chính sách bảo mật</a>
            <a href="/sitemap">Sitemap</a>
            <a href="/accessibility">Khả năng tiếp cận</a>
          </div>
          
          <div className="copyright">
            © 2025 UTH Shoes. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </div>
    </footer>
  );
}