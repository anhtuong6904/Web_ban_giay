import React, { useState } from 'react';
import Cart from './Cart';
import './Recipient.css';
import { readCart, clearCart, getCheckoutItems, clearCheckoutItems, removeItems } from '../services/cartService';
import { createOrder } from '../services/orderService';
import { useNavigate } from 'react-router-dom';


export default function Recipient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);

  // Lấy dữ liệu từ input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Submit form (chỉ ngăn reload trang)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Recipient Info:", formData);
  };

  // Gọi API thanh toán VNPay
  const handlePayment = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 1000000, 
        orderId: "12345",
        orderInfo: "Thanh toán đơn hàng #12345",
      }),
    });

    const data = await response.json();
    if (data.success) {
      window.location.href = data.paymentUrl; // Redirect sang VNPay
    } else {
      alert("Lỗi tạo thanh toán!");
    }
  } catch (err) {
    console.error(err);
    alert("Không kết nối được server!");
  }
};

  // Momo: tạo đơn qua backend (demo lưu DB), rồi điều hướng
  const handlePaymentMomo = async () => {
    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.address || !formData.phone) {
        alert('Vui lòng điền đầy đủ thông tin nhận hàng!');
        return;
      }

      setLoading(true);
      const itemsToBuy = getCheckoutItems();
      const items = (itemsToBuy && itemsToBuy.length > 0) ? itemsToBuy : readCart();
      
      if (!items || items.length === 0) {
        alert('Không có sản phẩm nào để đặt hàng!');
        return;
      }

      console.log('Creating order with:', { formData, items, paymentMethod: 'MOMO' });
      
      const result = await createOrder(formData, items, 'MOMO');
      
      // Lưu đơn hàng vào localStorage để Order Tracker hiển thị
      saveOrderToLocalStorage(result, items, 'MOMO');
      
      alert(`Đã tạo đơn hàng #${result.orderId}. Vui lòng tiếp tục thanh toán trên ứng dụng MoMo.`);
      if (itemsToBuy && itemsToBuy.length > 0) {
        removeItems(itemsToBuy.map(it => it.key));
        clearCheckoutItems();
      } else {
        clearCart();
      }
      navigate('/order-tracker');
    } catch (error) {
      console.error('Payment MOMO failed:', error);
      alert('Lỗi khi đặt hàng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // COD: xác nhận và tạo đơn nội bộ
  const handlePaymentCOD = () => {
    // Validate form data
    if (!formData.name || !formData.email || !formData.address || !formData.phone) {
      alert('Vui lòng điền đầy đủ thông tin nhận hàng!');
      return;
    }

    const ok = window.confirm('Xác nhận đặt hàng và thanh toán khi nhận hàng (COD)?');
    if (!ok) return;
    
    (async () => {
      setLoading(true);
      try {
        const itemsToBuy = getCheckoutItems();
        const items = (itemsToBuy && itemsToBuy.length > 0) ? itemsToBuy : readCart();
        
        if (!items || items.length === 0) {
          alert('Không có sản phẩm nào để đặt hàng!');
          return;
        }

        console.log('Creating order with:', { formData, items, paymentMethod: 'COD' });
        
        const result = await createOrder(formData, items, 'COD');
        
        // Lưu đơn hàng vào localStorage để Order Tracker hiển thị
        saveOrderToLocalStorage(result, items, 'COD');
        
        alert(`Đặt hàng thành công! Mã đơn #${result.orderId}.`);
        if (itemsToBuy && itemsToBuy.length > 0) {
          removeItems(itemsToBuy.map(it => it.key));
          clearCheckoutItems();
        } else {
          clearCart();
        }
        navigate('/order-tracker');
      } catch (error) {
        console.error('Payment COD failed:', error);
        alert('Lỗi khi đặt hàng: ' + error.message);
      } finally {
        setLoading(false);
      }
    })();
  };

  // Hàm lưu đơn hàng vào localStorage
  const saveOrderToLocalStorage = (orderResult, items, paymentMethod) => {
    try {
      // Lấy user identity để lưu đơn hàng theo user
      const userIdentity = localStorage.getItem('userInfo');
      let userId = 'guest';
      
      if (userIdentity) {
        try {
          const userInfo = JSON.parse(userIdentity);
          userId = userInfo.uid || userInfo.email || userInfo.Username || userInfo.username || 'guest';
        } catch {}
      }

      const orderKey = `userOrders:${userId}`;
      const existingOrders = localStorage.getItem(orderKey);
      const orders = existingOrders ? JSON.parse(existingOrders) : [];

      const newOrder = {
        orderId: orderResult.orderId,
        orderDate: new Date().toISOString(),
        status: 'pending',
        paymentMethod: paymentMethod,
        customerInfo: formData,
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          size: item.size,
          color: item.color
        })),
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };

      orders.unshift(newOrder); // Thêm đơn hàng mới vào đầu
      localStorage.setItem(orderKey, JSON.stringify(orders));
      
      console.log('Đã lưu đơn hàng vào localStorage:', newOrder);
    } catch (error) {
      console.error('Lỗi khi lưu đơn hàng:', error);
    }
  };

  return (
    <div className="container">
      <h1>Recipient Information</h1>
      <div className="recipient-container">
        <div className="checkout-container">
          <h2>Delivery</h2>
          <form onSubmit={handleSubmit}>
            <div className="Name-box">
              <h3>Name:</h3>
              <input 
                type="text" 
                name="name" 
                placeholder="Name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="Email-box">
              <h3>Email:</h3>
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="Address-box">
              <h3>Address:</h3>
              <input 
                type="text" 
                name="address" 
                placeholder="Address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="Phone-box">
              <h3>Phone:</h3>
              <input 
                type="tel" 
                name="phone" 
                placeholder="Phone Number" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
              />
            </div>
          </form>
        </div>

        <div className="cart-container">
          <h2>Cart</h2>
          <Cart />
        </div>
      </div>

      <div className="checkout-button">
        <button onClick={handlePayment} disabled={loading}>
          {loading ? "Đang xử lý..." : "Thanh toán bằng VNPay"}
        </button>
        <button onClick={handlePaymentMomo} disabled={loading}>Thanh toán bằng Momo</button>
        <button onClick={handlePaymentCOD} disabled={loading}>Thanh toán khi nhận hàng (COD)</button>
      </div>
    </div>
  );
}
