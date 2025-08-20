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

      {/* Danh sách sản phẩm */}
      <div className="cart-items">
        {(cartItems || []).map(item => (
          <div key={item.key} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Giá: {formatPrice(item.price)}</p>
              {item.size && <p>Size: {item.size}</p>}
              {item.color && <p>Màu: {item.color}</p>}
              <div className="quantity-control">
                <p>Số lượng: </p>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  className="quantity-input"
                  onChange={(e) => handleQuantityChange(item.key, parseInt(e.target.value))}
                />
              </div>
              <p>Tạm tính: {formatPrice(item.price * item.quantity)}</p>
            </div>
            <button className='btn-deleteitem' onClick={() => handleRemoveItem(item.key)}>
              <RiDeleteBinLine size={20} />
            </button>
          </div>
        ))}
      </div>

      <br />
      <div className="cart-total">
        <h3>Tổng cộng: {formatPrice(totalPrice)}</h3>
      </div>

      {/* Cart actions (popup) */}
      {isPopup && (
        <div className="cart-actions">
          <Link to="/payment" className="checkout-btn" onClick={onClose}>
            Đặt hàng ngay
          </Link>
        </div>
      )}
      {!isPopup && (
        <div className="cart-actions">
          <Link to="/payment" className="checkout-btn">
            Đặt hàng ngay
          </Link>
          <button className="checkout-btn" onClick={() => { localStorage.removeItem('cartItems'); setCartItems([]); }}>
            Xóa tất cả
          </button>
        </div>
      )}
    </div>
  );
}
