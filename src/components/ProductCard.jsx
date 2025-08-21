import React from 'react';
import { formatPrice } from '../utils/formatPrice';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  const {
    Name,
    ProductName,
    Price,
    OriginalPrice,
    Discount,
    Rating = 4.5,
    ImageURL,
    MainImage,
    Gender,
    Tag
  } = product;

  const productName = Name || ProductName || 'Unknown Product';
  const currentPrice = Price || 0;
  const originalPrice = OriginalPrice || currentPrice;
  const discount = Discount || 0;
  const rating = Rating || 4.5;

  // Get main image
  const getMainImage = () => {
    if (ImageURL) return ImageURL;
    if (MainImage) return MainImage;
    
    // Generate image path from product name
    const slug = productName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `/images/products/${slug}/1.png`;
  };

  // Render rating stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half-filled">☆</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-image-container">
        <img 
          src={getMainImage()} 
          alt={productName}
          className="product-image"
          onError={(e) => {
            e.target.src = '/images/products/placeholder.jpg';
          }}
        />
        {discount > 0 && (
          <div className="discount-badge">
            -{discount}%
          </div>
        )}
        {Gender && (
          <div className="gender-badge">
            {Gender}
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{productName}</h3>
        
        <div className="product-rating">
          <div className="stars">
            {renderStars(rating)}
          </div>
          <span className="rating-text">({rating})</span>
        </div>

        <div className="product-price">
          <span className="current-price">{formatPrice(currentPrice)}</span>
          {originalPrice > currentPrice && (
            <span className="original-price">{formatPrice(originalPrice)}</span>
          )}
        </div>

        {Tag && (
          <div className="product-tags">
            <span className="tag">{Tag}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
