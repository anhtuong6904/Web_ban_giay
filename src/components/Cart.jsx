import React, { useState } from 'react';
import { RiDeleteBinLine } from "react-icons/ri";
import './Cart.css';
import { Link } from 'react-router-dom';
import { GiCancel } from "react-icons/gi";


export default function Cart({ onClose }) {

  

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Running Shoes",
      price: 59.99,
      quantity: 2,
      image: "/images/cart/shoes1.jpg"
    },
    {
      id: 2,
      name: "Basketball Sneakers",
      price: 89.99,
      quantity: 1,
      image: "/images/cart/shoes2.jpg"
    },
    {
      id: 3,
      name: "Casual Sneakers",
      price: 49.99,
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
    console.log(`Sản phẩm có id ${id} đã được xóa khỏi giỏ hàng.`);
    alert(`Sản phẩm có id ${id} đã được xóa khỏi giỏ hàng.`);
  };

  // ham hieu ung slide out khi đóng giỏ hàng
  



  return (
    <div className="cart-section">
      {/* Nút Back */}

      <div className="cart-header">
        <h2>UTH Shoes</h2>
        <h2>YOUR CART</h2>
        <button className="cart-back-btn" onClick={onClose}>
          <GiCancel size={24} />
        </button>
      </div>

      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Price: ${item.price.toFixed(2)}</p>
              <div className="quantity-control">
                <p>Quantity: </p>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  className="quantity-input"
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                />
              </div>
            <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button className='btn-deleteitem' onClick={() => handleRemoveItem(item.id)}>
              <RiDeleteBinLine size={20} />
            </button>
          </div>
        ))}
      </div>
      <br/>
      <div className="cart-total">
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
      </div>
      <div className="cart-actions">
        <Link to = "checkout" className="checkout-btn">
          Checkout
        </Link>
      </div>

    </div>
  );
}
