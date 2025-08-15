import React, { useState } from 'react';
import Cart from './Cart';
import './Recipient.css';

export default function Recipient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi dữ liệu checkout
    console.log('Checkout data:', formData);
  };

  return (
    <>
    <div className="container">
      <h1>Recipient Information</h1>
      <div className="recipient-container">
        <div className='checkout-container'>
            <h2>Delivery</h2>
            <form onSubmit={handleSubmit}>
                <div className = "Name-box">
                    <h3>Name:</h3>
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="Email-box">
                    <h3>Email:</h3>
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="Address-box">
                    <h3>Address:</h3>
                    <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                </div>
                <div className="Phone-box">
                    <h3>Phone:</h3>
                    <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                </div>
            </form>
        </div>
        <div className='cart-container'>
          <h2>Cart</h2>
            <Cart />
        </div>
      </div>
      <div className='checkout-button'>
          <button>Thanh toán bằng Vnpay</button>
          <button>Thanh Toán bằng Momo</button>
          <button>Thanh toán khi nhận hàng (COD)</button>
      </div>
    </div>
    
    </>
  );
}