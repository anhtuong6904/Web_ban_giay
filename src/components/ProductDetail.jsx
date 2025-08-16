import React, { useState } from 'react';
import { IoHeart, IoHeartOutline, IoShareSocial, IoLocation, IoTime, IoCall, IoMail } from 'react-icons/io5';
import './ProductDetail.css';

export default function ProductDetail() {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('Đen');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = {
    name: "Giày Thể Thao UTH Shoes Helio Teen Nam Màu Đen",
    code: "UTH008100DEN",
    price: 595000,
    originalPrice: 750000,
    discount: 21,
    status: "Còn hàng",
    brand: "UTH Shoes",
    views: 143,
    sales: 7,
    images: [
      "/images/products/giay-the-thao-1.jpg",
      "/images/products/giay-the-thao-2.jpg", 
      "/images/products/giay-the-thao-3.jpg",
      "/images/products/giay-the-thao-4.jpg"
    ],
    colors: ["Đen", "Trắng", "Xanh"],
    sizes: ["38", "39", "40", "41", "42", "43"],
    description: "Với phối màu trắng phối đen cá tính, mẫu Helio UTH008100 mang lại diện mạo thể thao mạnh mẽ và dễ phối hợp với đa dạng phong cách. Phù hợp cho cả teen nam và nữ, đôi giày này lý tưởng để mang đi học, tập luyện nhẹ hoặc dạo phố cuối tuần.",
    features: [
      "Phần upper gồm da tổng hợp phủ mịn và lưới mesh",
      "Thiết kế cổ thấp basic, form ôm vừa chân",
      "Đế IP siêu nhẹ, có rãnh chống trượt",
      "Hỗ trợ di chuyển linh hoạt"
    ],
    benefits: [
      "Cam kết chính hãng UTH Shoes 100%",
      "Bảo hành 03 tháng",
      "Đổi size trong vòng 7 ngày",
      "Đổi trả hàng trong vòng 7 ngày",
      "Free ship đơn hàng 1.5 Triệu",
      "Hỗ trợ giao hàng 2h khi chọn Grab"
    ]
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn size');
      return;
    }
    alert(`Đã thêm ${product.name} - Size ${selectedSize} vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn size');
      return;
    }
    alert('Chuyển đến trang thanh toán...');
  };

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href="/home">Trang chủ</a>
          <span>/</span>
          <a href="/shoes">Giày thể thao</a>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Product Main Section */}
        <div className="product-main">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={product.images[0]} alt={product.name} />
              <div className="image-badge">Mới</div>
            </div>
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <div key={index} className="thumbnail">
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-code">Mã sản phẩm: <strong>{product.code}</strong></div>
            </div>

            <div className="product-price-section">
              <div className="current-price">{formatPrice(product.price)}</div>
              <div className="original-price">{formatPrice(product.originalPrice)}</div>
              <div className="discount-badge">-{product.discount}%</div>
            </div>

            <div className="product-stats">
              <span><strong>{product.views}</strong> lượt xem</span>
              <span><strong>{product.sales}</strong> lượt mua Online</span>
            </div>

            <div className="product-status">
              Tình trạng: <strong style={{color: '#27ae60'}}>{product.status}</strong>
            </div>

            {/* Color Selection */}
            <div className="product-option">
              <label>Màu sắc:</label>
              <div className="color-options">
                {product.colors.map((color) => (
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
                {product.sizes.map((size) => (
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
                {product.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="product-description">
          <h2>Mô tả sản phẩm</h2>
          <p>{product.description}</p>
          
          <h3>Đặc điểm nổi bật:</h3>
          <ul>
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
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
      </div>
    </div>
  );
}
