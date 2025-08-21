import React, { useState, useEffect } from 'react';
import { RiDeleteBinLine } from "react-icons/ri";
import './Cart.css';
import { Link, useNavigate } from 'react-router-dom';
import { GiCancel } from "react-icons/gi";
import { formatPrice } from '../utils/formatPrice';
import { readCart, updateQuantity, removeItem, getCheckoutItems, setCheckoutItems, onCartChange } from '../services/cartService';

export default function Cart({ onClose, isPopup = false, useCheckoutItems = false }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(readCart());
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  useEffect(() => {
    const load = () => {
      if (useCheckoutItems) {
        const instant = getCheckoutItems();
        setCartItems((instant && instant.length > 0) ? instant : readCart());
      } else {
        setCartItems(readCart());
      }
    };
    load();
    const unsub = onCartChange(load);
    return () => { if (typeof unsub === 'function') unsub(); };
  }, [useCheckoutItems]);

  useEffect(() => {
    // Auto-select all items when list changes
    setSelectedKeys(new Set((cartItems || []).map(it => it.key)));
  }, [cartItems]);

  const totalPrice = (cartItems || []).reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
  const selectedItems = (cartItems || []).filter(it => selectedKeys.has(it.key));
  const selectedTotal = selectedItems.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);

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

  const toggleSelect = (key) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedKeys(prev => {
      const allKeys = new Set((cartItems || []).map(it => it.key));
      const allSelected = (prev && allKeys.size > 0) && [...allKeys].every(k => prev.has(k));
      return allSelected ? new Set() : allKeys;
    });
  };

  const handleCheckoutSelected = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để đặt hàng.');
      return;
    }
    setCheckoutItems(selectedItems);
    navigate('/payment');
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
            <input
              type="checkbox"
              className="item-checkbox"
              checked={selectedKeys.has(item.key)}
              onChange={() => toggleSelect(item.key)}
            />
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
          <div className="select-all">
            <label>
              <input type="checkbox" onChange={toggleSelectAll} checked={(cartItems || []).length > 0 && selectedItems.length === (cartItems || []).length} />
              Chọn tất cả
            </label>
          </div>
          <h3>Tổng đã chọn: <span className="total-amount">{formatPrice(selectedTotal)}</span></h3>
          <div className="note">(Tổng giỏ hàng: {formatPrice(totalPrice)})</div>
        </div>

        {/* Cart actions */}
        <div className="cart-actions">
          <button className="clear-all-btn" onClick={handleClearAll}>
            Xóa tất cả
          </button>
          <button className="checkout-btn" onClick={handleCheckoutSelected}>
            Đặt hàng (chỉ mục đã chọn)
          </button>
        </div>
      </div>
    </div>
  );
}
