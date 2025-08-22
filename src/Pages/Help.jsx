import React, { useState } from 'react';
import { IoHelpCircle, IoChevronDown, IoChevronUp, IoSearch, IoMail, IoCall, IoChatbubble } from 'react-icons/io5';
import './Help.css';

export default function Help() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState(new Set());

  const faqs = [
    {
      id: 1,
      question: "Làm thế nào để đặt hàng?",
      answer: "Để đặt hàng, bạn cần: 1) Chọn sản phẩm yêu thích, 2) Chọn size và màu sắc, 3) Thêm vào giỏ hàng, 4) Điền thông tin giao hàng, 5) Chọn phương thức thanh toán và hoàn tất đơn hàng."
    },
    {
      id: 2,
      question: "Thời gian giao hàng là bao lâu?",
      answer: "Thời gian giao hàng thường từ 3-5 ngày làm việc đối với các tỉnh thành lớn, và 5-7 ngày đối với các vùng xa. Chúng tôi sẽ gửi email xác nhận khi đơn hàng được giao."
    },
    {
      id: 3,
      question: "Có thể đổi trả sản phẩm không?",
      answer: "Có, chúng tôi chấp nhận đổi trả trong vòng 30 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên vẹn, chưa sử dụng và có đầy đủ phụ kiện đi kèm."
    },
    {
      id: 4,
      question: "Các phương thức thanh toán nào được chấp nhận?",
      answer: "Chúng tôi chấp nhận: 1) Thanh toán khi nhận hàng (COD), 2) Chuyển khoản ngân hàng, 3) Thanh toán qua VNPay, 4) Thanh toán qua Momo."
    },
    {
      id: 5,
      question: "Làm sao để theo dõi đơn hàng?",
      answer: "Bạn có thể theo dõi đơn hàng bằng cách: 1) Vào trang 'Order Tracker', 2) Nhập mã đơn hàng, 3) Xem trạng thái cập nhật real-time, 4) Nhận thông báo qua email."
    },
    {
      id: 6,
      question: "Size giày có chính xác không?",
      answer: "Chúng tôi cung cấp bảng size chi tiết cho từng loại giày. Bạn nên đo chân trước khi chọn size để đảm bảo vừa vặn. Nếu không vừa, chúng tôi hỗ trợ đổi size miễn phí."
    },
    {
      id: 7,
      question: "Có chương trình khuyến mãi nào không?",
      answer: "Có, chúng tôi thường xuyên có các chương trình khuyến mãi: 1) Giảm giá theo mùa, 2) Mua 2 tặng 1, 3) Giảm giá cho khách hàng mới, 4) Ưu đãi đặc biệt cho thành viên VIP."
    },
    {
      id: 8,
      question: "Làm sao để liên hệ hỗ trợ khách hàng?",
      answer: "Bạn có thể liên hệ chúng tôi qua: 1) Hotline: 1900-xxxx, 2) Email: support@uthshoes.com, 3) Chat trực tuyến trên website, 4) Fanpage Facebook."
    }
  ];

  const toggleFaq = (faqId) => {
    const newExpanded = new Set(expandedFaqs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedFaqs(newExpanded);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularCategories = [
    { name: "Đặt hàng & Thanh toán", icon: "🛒", count: 4 },
    { name: "Giao hàng & Vận chuyển", icon: "🚚", count: 3 },
    { name: "Đổi trả & Bảo hành", icon: "🔄", count: 2 },
    { name: "Tài khoản & Bảo mật", icon: "🔒", count: 2 }
  ];

  return (
    <div className="help-container">
      {/* Header */}
      <div className="help-header">
        <div className="help-header-content">
          <div className="help-icon">
            <IoHelpCircle size={60} />
          </div>
          <h1>Trung tâm trợ giúp</h1>
          <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <IoSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi thường gặp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Popular Categories */}
      <div className="categories-section">
        <h2>Danh mục phổ biến</h2>
        <div className="categories-grid">
          {popularCategories.map((category, index) => (
            <div key={index} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.count} câu hỏi</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="faqs-section">
        <h2>Câu hỏi thường gặp</h2>
        <div className="faqs-container">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleFaq(faq.id)}
              >
                <span>{faq.question}</span>
                {expandedFaqs.has(faq.id) ? (
                  <IoChevronUp size={20} />
                ) : (
                  <IoChevronDown size={20} />
                )}
              </button>
              {expandedFaqs.has(faq.id) && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <h2>Vẫn cần hỗ trợ?</h2>
        <p>Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
        <div className="contact-methods">
          <div className="contact-method">
            <IoCall className="contact-icon" />
            <h3>Gọi điện</h3>
            <p>1900-xxxx</p>
            <span>24/7</span>
          </div>
          <div className="contact-method">
            <IoMail className="contact-icon" />
            <h3>Email</h3>
            <p>support@uthshoes.com</p>
            <span>Phản hồi trong 2h</span>
          </div>
          <div className="contact-method">
            <IoChatbubble className="contact-icon" />
            <h3>Chat trực tuyến</h3>
            <p>Bắt đầu chat</p>
            <span>Ngay lập tức</span>
          </div>
        </div>
      </div>
    </div>
  );
}
