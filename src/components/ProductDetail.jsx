import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Mock data - sau này sẽ fetch từ API
  const product = {
    id: id || 1,
    name: "Men's Originals CAMPUS 00S SHOES",
    price: 77,
    originalPrice: 110,
    discount: 30,
    rating: 4.8,
    reviewCount: 657,
    colors: [
      {
        id: 0,
        name: "Crystal White / Core Black / Off White",
        image: "/images/products/campus-white.jpg",
        isAvailable: true
      },
      {
        id: 1,
        name: "Core Black / Core Black / Core Black",
        image: "/images/products/campus-black.jpg",
        isAvailable: true
      },
      {
        id: 2,
        name: "Cloud White / Core Black / Cloud White",
        image: "/images/products/campus-cloud.jpg",
        isAvailable: true
      }
    ],
    sizes: [
      { id: 1, name: "M 5 / W 6", isAvailable: true },
      { id: 2, name: "M 6 / W 7", isAvailable: true },
      { id: 3, name: "M 7 / W 8", isAvailable: true },
      { id: 4, name: "M 8 / W 9", isAvailable: true },
      { id: 5, name: "M 9 / W 10", isAvailable: true },
      { id: 6, name: "M 10 / W 11", isAvailable: true },
      { id: 7, name: "M 11 / W 12", isAvailable: true },
      { id: 8, name: "M 12 / W 13", isAvailable: false }
    ],
    images: [
      "/images/products/campus-main.jpg",
      "/images/products/campus-side.jpg",
      "/images/products/campus-back.jpg",
      "/images/products/campus-sole.jpg"
    ],
    description: "The Campus 00s brings back the classic '80s look with a modern twist. Features premium leather upper with signature 3-Stripes and gum sole.",
    features: [
      "Premium leather upper",
      "Signature 3-Stripes",
      "Gum sole",
      "Classic '80s design"
    ]
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn kích cỡ');
      return;
    }
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const handleFavorite = () => {
    alert('Đã thêm vào danh sách yêu thích!');
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/home" className="breadcrumb-link">Back Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/men" className="breadcrumb-link">Men</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/shoes" className="breadcrumb-link">Shoes</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>

        <div className="product-detail-content">
          {/* Left side - Product Images */}
          <div className="product-images-section">
            <div className="main-image-container">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="main-image"
              />
              <div className="image-overlay">
                <button className="zoom-btn">🔍</button>
              </div>
            </div>
            
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <div key={index} className="thumbnail-container">
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`} 
                    className="thumbnail-image"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Product Info */}
          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-text">({product.reviewCount} reviews)</span>
              </div>

              <div className="product-price">
                <span className="current-price">${product.price}</span>
                <span className="original-price">${product.originalPrice}</span>
                <span className="discount-badge">-{product.discount}%</span>
              </div>

              <div className="popular-notice">
                Popular - 159 people have bought this product in the last 24 hours
              </div>
            </div>

            {/* Color Selection */}
            <div className="product-option">
              <div className="option-header">
                <h3>Colors</h3>
                <span className="selected-color-name">{product.colors[selectedColor].name}</span>
              </div>
              <div className="color-options">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    className={`color-option ${selectedColor === color.id ? 'selected' : ''} ${!color.isAvailable ? 'unavailable' : ''}`}
                    onClick={() => setSelectedColor(color.id)}
                    disabled={!color.isAvailable}
                  >
                    <img src={color.image} alt={color.name} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="product-option">
              <div className="option-header">
                <h3>Sizes</h3>
                <Link to="/size-guide" className="size-guide-link">Size guide</Link>
              </div>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    className={`size-option ${selectedSize === size.id ? 'selected' : ''} ${!size.isAvailable ? 'unavailable' : ''}`}
                    onClick={() => setSelectedSize(size.id)}
                    disabled={!size.isAvailable}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
              <div className="size-note">
                True to size. We recommend ordering your usual size.
              </div>
            </div>

            {/* Quantity */}
            <div className="product-option">
              <div className="option-header">
                <h3>Quantity</h3>
              </div>
              <div className="quantity-selector">
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                Add to Bag
              </button>
              
              <button 
                className="favorite-btn"
                onClick={handleFavorite}
              >
                ❤
              </button>
            </div>

            {/* Payment Info */}
            <div className="payment-info">
              <div className="klarna-info">
                From ${(product.price / 4).toFixed(2)}/month, or 4 payments at 0% interest with Klarna
                <Link to="/klarna" className="learn-more-link">Learn more</Link>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="shipping-info">
              <div className="shipping-item">
                <span className="shipping-icon">🚚</span>
                <div className="shipping-text">
                  <div>Free Prime delivery and easy returns available</div>
                  <Link to="/delivery" className="delivery-link">Get delivery dates</Link>
                </div>
              </div>
              
              <div className="shipping-item">
                <span className="shipping-icon">⭐</span>
                <div className="shipping-text">
                  Free standard shipping with adiClub
                </div>
              </div>
              
              <div className="shipping-item">
                <span className="shipping-icon">↩</span>
                <div className="shipping-text">
                  Free 30 day returns
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="product-description">
              <h3>Product Details</h3>
              <p>{product.description}</p>
              
              <h4>Features:</h4>
              <ul className="features-list">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
