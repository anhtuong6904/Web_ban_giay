import React, { useState, useEffect } from 'react';
import { IoHeart, IoHeartOutline, IoShareSocial, IoLocation, IoTime, IoCall, IoMail, IoStar } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';
import { allProducts } from '../data/allProducts';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams(); // Lấy ID từ URL params
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('Đen');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0); // Bắt đầu với 0 sao để người dùng phải chọn
  const [hoverRating, setHoverRating] = useState(0); // Để hiển thị preview khi hover

  // Lấy thông tin sản phẩm theo ID từ URL
  const getProductById = (productId) => {
    const product = allProducts.find(p => p.id === parseInt(productId));
    console.log('Looking for product with ID:', productId);
    console.log('Found product:', product);
    return product;
  };

  const currentProduct = getProductById(id);

  // Tự động scroll lên đầu trang khi component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Reset selectedImageIndex khi sản phẩm thay đổi
    setSelectedImageIndex(0);
  }, [id]); // Thêm id vào dependency array

  // Thông tin người dùng đăng nhập (lấy từ localStorage hoặc context)
  const getCurrentUser = () => {
    // Thử lấy từ localStorage trước
    const userFromStorage = localStorage.getItem('currentUser');
    if (userFromStorage) {
      try {
        const user = JSON.parse(userFromStorage);
        return {
          ...user,
          avatar: generateAvatar(user.name || user.displayName || user.email)
        };
      } catch (e) {
        console.log('Không thể parse user từ localStorage');
      }
    }
    
    // Nếu không có trong localStorage, thử lấy từ sessionStorage
    const userFromSession = sessionStorage.getItem('currentUser');
    if (userFromSession) {
      try {
        const user = JSON.parse(userFromSession);
        return {
          ...user,
          avatar: generateAvatar(user.name || user.displayName || user.email)
        };
      } catch (e) {
        console.log('Không thể parse user từ sessionStorage');
      }
    }
    
    // Fallback: trả về thông tin mặc định
    return {
      name: "Khách",
      avatar: "https://via.placeholder.com/40x40/95a5a6/ffffff?text=K"
    };
  };

  // Hàm tạo avatar tự động dựa trên tên
  const generateAvatar = (name) => {
    if (!name) return "https://via.placeholder.com/40x40/95a5a6/ffffff?text=K";
    
    // Lấy chữ cái đầu tiên của tên
    const firstLetter = name.charAt(0).toUpperCase();
    
    // Tạo màu ngẫu nhiên dựa trên tên (để avatar luôn nhất quán với cùng một tên)
    const colors = [
      '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
      '#1abc9c', '#34495e', '#e67e22', '#16a085', '#8e44ad'
    ];
    
    const colorIndex = name.charCodeAt(0) % colors.length;
    const backgroundColor = colors[colorIndex];
    
    return `https://via.placeholder.com/40x40/${backgroundColor.replace('#', '')}/ffffff?text=${firstLetter}`;
  };

  const currentUser = getCurrentUser();

  // Dữ liệu bình luận mẫu
  const sampleComments = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      avatar: "https://via.placeholder.com/40x40/3498db/ffffff?text=NV",
      rating: 5,
      date: "15/08/2024",
      comment: "Giày rất đẹp và thoải mái! Chất lượng tốt, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận. Sẽ mua thêm sản phẩm khác của UTH Shoes.",
      likes: 12,
      verified: true
    },
    {
      id: 2,
      user: "Trần Thị B",
      avatar: "https://via.placeholder.com/40x40/e74c3c/ffffff?text=TT",
      rating: 4,
      date: "12/08/2024",
      comment: "Giày đẹp, form ôm chân tốt. Size vừa vặn, đi rất thoải mái. Chỉ hơi tiếc là màu sắc hơi khác so với ảnh một chút, nhưng nhìn chung rất hài lòng!",
      likes: 8,
      verified: true
    },
    {
      id: 3,
      user: "Lê Văn C",
      avatar: "https://via.placeholder.com/40x40/2ecc71/ffffff?text=LV",
      rating: 5,
      date: "10/08/2024",
      comment: "Sản phẩm chất lượng cao, giá cả hợp lý. Nhân viên tư vấn nhiệt tình, giao hàng đúng hẹn. Đây là lần thứ 3 tôi mua giày của UTH Shoes.",
      likes: 15,
      verified: true
    },
    {
      id: 4,
      user: "Phạm Thị D",
      avatar: "https://via.placeholder.com/40x40/f39c12/ffffff?text=PT",
      rating: 4,
      date: "08/08/2024",
      comment: "Giày đẹp, đi thoải mái. Tuy nhiên size hơi nhỏ so với bình thường, nên mua size lớn hơn 1 size. Chất lượng tốt, đáng mua!",
      likes: 6,
      verified: false
    },
    {
      id: 5,
      user: "Hoàng Văn E",
      avatar: "https://via.placeholder.com/40x40/9b59b6/ffffff?text=HV",
      rating: 5,
      date: "05/08/2024",
      comment: "Sản phẩm tuyệt vời! Thiết kế đẹp, chất liệu tốt, đi rất êm chân. Giao hàng nhanh, đóng gói đẹp. Chắc chắn sẽ giới thiệu cho bạn bè.",
      likes: 20,
      verified: true
    }
  ];

  const [comments, setComments] = useState(sampleComments);

  // Lấy 3 sản phẩm liên quan (cùng category hoặc brand)
  const getRelatedProducts = () => {
    // Sử dụng thông tin từ sản phẩm hiện tại thay vì cố định
    const currentProductCategory = currentProduct.Category;
    const currentProductBrand = currentProduct.Brand;
    
    console.log('=== DEBUG RELATED PRODUCTS ===');
    console.log('Đang tìm sản phẩm liên quan cho:', currentProduct.Name);
    console.log('Category:', currentProductCategory);
    console.log('Brand:', currentProductBrand);
    console.log('Tổng số sản phẩm:', allProducts.length);
    console.log('allProducts[0]:', allProducts[0]);
    
    // Lọc sản phẩm cùng category hoặc brand, loại trừ sản phẩm hiện tại
    const related = allProducts.filter(p => {
      const matchesCategory = p.Category === currentProductCategory;
      const matchesBrand = p.Brand === currentProductBrand;
      const isNotCurrent = p.id !== currentProduct.id; // Loại trừ sản phẩm hiện tại
      
      console.log(`Product ${p.id}: Category=${p.Category}, Brand=${p.Brand}, matchesCategory=${matchesCategory}, matchesBrand=${matchesBrand}, isNotCurrent=${isNotCurrent}`);
      
      return isNotCurrent && (matchesCategory || matchesBrand);
    });
    
    console.log('Sản phẩm liên quan tìm được:', related.length);
    console.log('Danh sách:', related);
    
    // Lấy 3 sản phẩm đầu tiên
    const result = related.slice(0, 3);
    console.log('Kết quả cuối cùng (3 sản phẩm):', result);
    console.log('=== END DEBUG ===');
    
    return result;
  };

  const relatedProducts = getRelatedProducts();
  
  console.log('Related Products cuối cùng:', relatedProducts);

  // Nếu không tìm thấy sản phẩm, hiển thị thông báo lỗi
  if (!currentProduct) {
    return (
      <div className="product-detail">
        <div className="product-detail-container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Sản phẩm không tồn tại</h2>
            <p>Không tìm thấy sản phẩm với ID: {id}</p>
            <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
              ← Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn size');
      return;
    }
    alert(`Đã thêm ${currentProduct.Name} - Size ${selectedSize} vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn size');
      return;
    }
    alert('Chuyển đến trang thanh toán...');
  };

  // Hàm xử lý click vào thumbnail
  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  // Hàm xử lý gửi bình luận mới
  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      alert('Vui lòng nhập nội dung bình luận');
      return;
    }

    if (userRating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    const newCommentObj = {
      id: comments.length + 1,
      user: currentUser.name || "Khách",
      avatar: currentUser.avatar,
      rating: userRating,
      date: new Date().toLocaleDateString('vi-VN'),
      comment: newComment,
      likes: 0,
      verified: currentUser.name && currentUser.name !== "Khách" // Chỉ verified nếu có tên thực
    };

    setComments([newCommentObj, ...comments]);
    setNewComment('');
    setUserRating(0); // Reset về 0 sao
    alert('Bình luận đã được gửi thành công!');
  };

  // Hàm render sao đánh giá
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <IoStar
        key={index}
        className={index < rating ? 'star filled' : 'star empty'}
        size={16}
      />
    ));
  };

  // Hàm render sao cho form đánh giá (có hover effect)
  const renderRatingStars = () => {
    return [...Array(5)].map((_, index) => (
      <IoStar
        key={index}
        className={`star-icon ${index < (hoverRating || userRating) ? 'filled' : ''}`}
        size={24}
        onClick={() => setUserRating(index + 1)}
        onMouseEnter={() => setHoverRating(index + 1)}
        onMouseLeave={() => setHoverRating(0)}
        style={{ cursor: 'pointer' }}
      />
    ));
  };

  // Tính điểm đánh giá trung bình
  const averageRating = comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length;

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href="/home">Trang chủ</a>
          <span>/</span>
          <a href={`/shoes?category=${currentProduct.Category}`}>{currentProduct.Category}</a>
          <span>/</span>
          <span>{currentProduct.Name}</span>
        </div>

        {/* Product Main Section */}
        <div className="product-main">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={currentProduct.MainImage}
                alt={`${currentProduct.Name} - Ảnh ${selectedImageIndex + 1}`}
                className="main-product-image"
              />
              <div className="image-badge">Mới</div>
            </div>
            <div className="thumbnail-images">
              {currentProduct.images ? currentProduct.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image}
                    alt={`${currentProduct.Name} ${index + 1}`}
                    className="thumbnail-image"
                  />
                </div>
              )) : (
                // Fallback: hiển thị ảnh chính làm thumbnail
                <div
                  className={`thumbnail ${selectedImageIndex === 0 ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(0)}
                >
                  <img
                    src={currentProduct.MainImage}
                    alt={currentProduct.Name}
                    className="thumbnail-image"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{currentProduct.Name}</h1>
              <div className="product-code">Mã sản phẩm: <strong>{currentProduct.id}</strong></div>
            </div>

            <div className="product-price-section">
              <div className="current-price">{formatPrice(currentProduct.Price)}</div>
              <div className="original-price">{formatPrice(currentProduct.OriginalPrice)}</div>
              <div className="discount-badge">-{currentProduct.Discount}%</div>
            </div>

            <div className="product-stats">
              <span><strong>143</strong> lượt xem</span>
              <span><strong>7</strong> lượt mua Online</span>
            </div>

            <div className="product-status">
              Tình trạng: <strong style={{color: '#27ae60'}}>Còn hàng</strong>
            </div>

            {/* Color Selection */}
            <div className="product-option">
              <label>Màu sắc:</label>
              <div className="color-options">
                {currentProduct.Colors.map((color) => (
                  <button
                    key={color}
                    className={`color-option ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="product-option">
              <label>Kích thước:</label>
              <div className="size-options">
                {["38", "39", "40", "41", "42", "43"].map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="product-option">
              <label>Số lượng:</label>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button className="btn-buy-now" onClick={handleBuyNow}>
                Mua ngay
              </button>
              <button className="btn-add-to-cart" onClick={handleAddToCart}>
                Thêm vào giỏ
              </button>
            </div>

            {/* Favorite & Share */}
            <div className="product-utilities">
              <button
                className={`btn-favorite ${isFavorite ? 'active' : ''}`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
                {isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
              </button>
              <button className="btn-share">
                <IoShareSocial size={20} />
                Chia sẻ
              </button>
            </div>

            {/* Product Benefits */}
            <div className="product-benefits">
              <h3>Ưu đãi đi kèm</h3>
              <ul>
                {currentProduct.Benefits ? currentProduct.Benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                )) : (
                  <>
                    <li>Cam kết chính hãng UTH Shoes 100%</li>
                    <li>Bảo hành 03 tháng</li>
                    <li>Đổi size trong vòng 7 ngày</li>
                    <li>Đổi trả hàng trong vòng 7 ngày</li>
                    <li>Free ship đơn hàng 1.5 Triệu</li>
                    <li>Hỗ trợ giao hàng 2h khi chọn Grab</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="product-description">
          <h2>Mô tả sản phẩm</h2>
          <p>{currentProduct.Description || `${currentProduct.Name} - Sản phẩm chất lượng cao từ UTH Shoes với thiết kế hiện đại, phù hợp cho nhiều phong cách khác nhau.`}</p>

          <h3>Đặc điểm nổi bật:</h3>
          <ul>
            {currentProduct.Features ? currentProduct.Features.map((feature, index) => (
              <li key={index}>{feature}</li>
            )) : (
              <>
                <li>Chất liệu cao cấp, bền bỉ</li>
                <li>Thiết kế hiện đại, thời trang</li>
                <li>Phù hợp nhiều phong cách</li>
                <li>Đế cao su chống trượt</li>
              </>
            )}
          </ul>
        </div>

        {/* Store Information */}
        <div className="store-info">
          <h2>Tìm sản phẩm tại hệ thống cửa hàng</h2>
          <div className="store-grid">
            <div className="store-item">
              <IoLocation size={24} />
              <div>
                <h4>22 Lý Chiêu Hoàng, P.10, Q.6, TP.HCM</h4>
                <p>Trụ sở chính</p>
              </div>
            </div>
            <div className="store-item">
              <IoTime size={24} />
              <div>
                <h4>8h - 21h30 (Trừ ngày Lễ, Tết)</h4>
                <p>Giờ làm việc</p>
              </div>
            </div>
            <div className="store-item">
              <IoCall size={24} />
              <div>
                <h4>0966 158 666</h4>
                <p>Hotline hỗ trợ</p>
              </div>
            </div>
            <div className="store-item">
              <IoMail size={24} />
              <div>
                <h4>chamsockhachhang@uthshoes.com</h4>
                <p>Email hỗ trợ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bình luận và Đánh giá */}
        <div className="product-reviews">
          <h2>Bình luận và Đánh giá</h2>
          <div className="review-header">
            <div className="average-rating">
              <h3>Đánh giá trung bình: {averageRating.toFixed(1)}/5</h3>
              <div className="stars">{renderStars(Math.round(averageRating))}</div>
            </div>
            <div className="add-review-section">
              <h3>Thêm bình luận mới</h3>
              <div className={`rating-selector ${userRating === 0 ? 'required' : ''}`}>
                <span>Đánh giá của bạn:</span>
                {renderRatingStars()}
              </div>
              {userRating === 0 && (
                <div className="rating-instruction">
                  Vui lòng chọn số sao đánh giá trước khi gửi bình luận
                </div>
              )}
              <textarea
                placeholder="Viết bình luận của bạn..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="4"
                cols="50"
                className={newComment.trim() === '' ? 'error' : ''}
              />
              <button 
                onClick={handleSubmitComment}
                disabled={userRating === 0 || newComment.trim() === ''}
              >
                Gửi bình luận
              </button>
            </div>
          </div>

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <img src={comment.avatar} alt={comment.user} className="comment-avatar" />
                  <div className="comment-user-info">
                    <h4>{comment.user}</h4>
                    <div className="comment-rating">{renderStars(comment.rating)}</div>
                    <span>{comment.date}</span>
                    {comment.verified && <span className="verified-badge">Đã xác thực</span>}
                  </div>
                </div>
                <p>{comment.comment}</p>
                <div className="comment-actions">
                  <span>{comment.likes} lượt thích</span>
                  <button>Thích</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products">
          <h2>Sản phẩm liên quan</h2>
          
          {/* Test Button */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button 
              onClick={() => {
                console.log('Test button clicked');
                console.log('relatedProducts:', relatedProducts);
                console.log('allProducts length:', allProducts.length);
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Test Related Products
            </button>
            
            <button 
              onClick={() => {
                console.log('Test navigation clicked');
                window.location.href = '/product/2';
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Test Navigation
            </button>
          </div>
          
          {console.log('Rendering Related Products, relatedProducts:', relatedProducts)}
          <div className="related-products-grid">
            {relatedProducts && relatedProducts.length > 0 ? (
              relatedProducts.map((relatedProduct) => {
                console.log('Rendering Related Product:', relatedProduct);
                return (
                  <div key={relatedProduct.id} className="related-product-card">
                    <Link 
                      to={`/product/${relatedProduct.id}`}
                      className="related-product-link"
                      onClick={() => {
                        console.log('Click vào Related Product:', relatedProduct.id);
                        console.log('Link:', `/product/${relatedProduct.id}`);
                      }}
                    >
                      <div className="related-product-image-container">
                        <img
                          src={relatedProduct.MainImage}
                          alt={relatedProduct.Name}
                          className="related-product-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div
                          className="related-product-image-placeholder"
                          style={{
                            display: 'none',
                            width: '100%',
                            height: '150px',
                            backgroundColor: '#f8f9fa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6c757d',
                            fontSize: '12px'
                          }}
                        >
                          <i className="fas fa-image" style={{ fontSize: '20px', marginRight: '6px' }}></i>
                          {relatedProduct.Name}
                        </div>
                        
                        {relatedProduct.Discount > 0 && (
                          <div className="related-product-discount-badge">
                            -{relatedProduct.Discount}%
                          </div>
                        )}
                      </div>
                      
                      <div className="related-product-info">
                        <h3 className="related-product-name">{relatedProduct.Name}</h3>
                        <div className="related-product-category">{relatedProduct.Category}</div>
                        <div className="related-product-price">
                          <span className="related-product-current-price">
                            {formatPrice(relatedProduct.Price)}
                          </span>
                          {relatedProduct.OriginalPrice > relatedProduct.Price && (
                            <span className="related-product-original-price">
                              {formatPrice(relatedProduct.OriginalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="no-related-products">
                <p>Không có sản phẩm liên quan</p>
                {console.log('Không có sản phẩm liên quan để hiển thị')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}