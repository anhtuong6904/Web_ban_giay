import React, { useState } from 'react';
import { RiDeleteBinLine } from "react-icons/ri";
import './Cart.css';
import { Link } from 'react-router-dom';
import { GiCancel } from "react-icons/gi";
import { formatPrice } from '../utils/formatPrice';  // ✅ import hàm format

export default function Cart({ onClose, isPopup = false }) {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Giày chạy bộ",
      price: 599000,
      quantity: 2,
      image: "/images/cart/shoes1.jpg"
    },
    {
      id: 2,
      name: "Giày bóng rổ",
      price: 899000,
      quantity: 1,
      image: "/images/cart/shoes2.jpg"
    },
    {
      id: 3,
      name: "Giày sneaker thường ngày",
      price: 499000,
      quantity: 3,
      image: "/images/cart/shoes3.jpg"
    }
  ]);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    alert(`Sản phẩm có id ${id} đã được xóa khỏi giỏ hàng.`);
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
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Giá: {formatPrice(item.price)}</p>
              <div className="quantity-control">
                <p>Số lượng: </p>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  className="quantity-input"
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                />
              </div>
              <p>Tạm tính: {formatPrice(item.price * item.quantity)}</p>
            </div>
            <button className='btn-deleteitem' onClick={() => handleRemoveItem(item.id)}>
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
          <Link to="/payment" className="checkout-btn">
            Đặt hàng ngay
          </Link>
        </div>
      )}
    </div>
  );
}
