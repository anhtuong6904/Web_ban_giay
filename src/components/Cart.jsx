import React, { useState, useEffect } from 'react';
import { RiDeleteBinLine } from "react-icons/ri";
import './Cart.css';
import { Link } from 'react-router-dom';
import { GiCancel } from "react-icons/gi";
import { formatPrice } from '../utils/formatPrice';
import { readCart, updateQuantity, removeItem, getCheckoutItems } from '../services/cartService';

export default function Cart({ onClose, isPopup = false }) {
  const [cartItems, setCartItems] = useState(readCart());

  useEffect(() => {
    // If one-click checkout items exist, show those; else show full cart
    const instant = getCheckoutItems();
    setCartItems((instant && instant.length > 0) ? instant : readCart());
  }, []);

  const totalPrice = (cartItems || []).reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);

  const handleQuantityChange = (key, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(key, newQuantity);
    setCartItems(readCart());
  };

  const handleRemoveItem = (key) => {
    removeItem(key);
    setCartItems(readCart());
  };

  const handleClearAll = () => {
    localStorage.removeItem('cartItems');
    setCartItems([]);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-section">
        <div className="cart-empty">
          <h2>Giỏ hàng trống</h2>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Link to="/products" className="continue-shopping-btn">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-section">
      {/* Header (popup) */}
      {isPopup && (
        <div className="cart-header">
          <button className="cart-back-btn" onClick={onClose}>
            <GiCancel size={24} />
          </button>
          <h2>GIỎ HÀNG</h2>
        </div>
      )}

      {/* Cart Title */}
      {!isPopup && (
        <div className="cart-page-title">
          <h1>Giỏ hàng của bạn</h1>
          <p>Bạn có {cartItems.length} sản phẩm trong giỏ hàng</p>
        </div>
      )}

      {/* Danh sách sản phẩm */}
      <div className="cart-items">
        {(cartItems || []).map(item => (
          <div key={item.key} className="cart-item">
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-details">
              <h3 className="item-name">{item.name}</h3>
              <div className="item-info">
                <span className="item-price">Giá: {formatPrice(item.price)}</span>
                {item.size && <span className="item-size">Size: {item.size}</span>}
                {item.color && <span className="item-color">Màu: {item.color}</span>}
              </div>
              <div className="quantity-control">
                <label>Số lượng:</label>
                <div className="quantity-input-group">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.key, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    className="quantity-input"
                    onChange={(e) => handleQuantityChange(item.key, parseInt(e.target.value) || 1)}
                  />
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.key, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="item-subtotal">
                Tạm tính: <span className="subtotal-amount">{formatPrice(item.price * item.quantity)}</span>
              </div>
            </div>
            <button className="btn-delete-item" onClick={() => handleRemoveItem(item.key)}>
              <RiDeleteBinLine size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="cart-summary">
        <div className="cart-total">
          <h3>Tổng cộng: <span className="total-amount">{formatPrice(totalPrice)}</span></h3>
        </div>

        {/* Cart actions */}
        <div className="cart-actions">
          <button className="clear-all-btn" onClick={handleClearAll}>
            Xóa tất cả
          </button>
          <Link to="/payment" className="checkout-btn">
            Đặt hàng ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
