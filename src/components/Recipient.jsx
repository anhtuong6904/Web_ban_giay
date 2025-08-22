import React, { useState, useEffect } from 'react';
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
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isDirectCheckout, setIsDirectCheckout] = useState(false);

  // Kiểm tra xem có checkout items không khi component mount
  useEffect(() => {
    const items = getCheckoutItems();
    if (items && items.length > 0) {
      setCheckoutItems(items);
      setIsDirectCheckout(true);
    } else {
      // Nếu không có checkout items, sử dụng cart
      const cartItems = readCart();
      setCheckoutItems(cartItems);
      setIsDirectCheckout(false);
    }
  }, []);

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
      // Validate form data
      if (!formData.name || !formData.email || !formData.address || !formData.phone) {
        alert('Vui lòng điền đầy đủ thông tin nhận hàng!');
        return;
      }

      if (!checkoutItems || checkoutItems.length === 0) {
        alert('Không có sản phẩm nào để đặt hàng!');
        return;
      }

      setLoading(true);
      
      // Tính tổng tiền từ checkout items
      const totalAmount = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const response = await fetch("http://localhost:5000/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          orderId: `ORDER_${Date.now()}`,
          orderInfo: `Thanh toán đơn hàng ${checkoutItems.map(item => item.name).join(', ')}`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Lưu thông tin đơn hàng trước khi chuyển hướng
        const orderInfo = {
          orderId: `ORDER_${Date.now()}`,
          items: checkoutItems,
          recipient: formData,
          paymentMethod: 'VNPay',
          totalAmount: totalAmount,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('currentOrder', JSON.stringify(orderInfo));
        
        window.location.href = data.paymentUrl; // Redirect sang VNPay
      } else {
        alert("Lỗi tạo thanh toán!");
      }
    } catch (err) {
      console.error(err);
      alert("Không kết nối được server!");
    } finally {
      setLoading(false);
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

      if (!checkoutItems || checkoutItems.length === 0) {
        alert('Không có sản phẩm nào để đặt hàng!');
        return;
      }

      setLoading(true);
      
      console.log('Creating order with:', { formData, items: checkoutItems, paymentMethod: 'MOMO' });
      
      const result = await createOrder(formData, checkoutItems, 'MOMO');
      
      // Lưu đơn hàng vào localStorage để Order Tracker hiển thị
      saveOrderToLocalStorage(result, checkoutItems, 'MOMO');
      
      alert(`Đã tạo đơn hàng #${result.orderId}. Vui lòng tiếp tục thanh toán trên ứng dụng MoMo.`);
      
      // Xóa checkout items hoặc cart tùy theo loại checkout
      if (isDirectCheckout) {
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
      
      // Trigger event để cập nhật order count trong Header
      window.dispatchEvent(new CustomEvent('orderUpdated'));
      
      // Gọi function refresh order count nếu có
      if (window.refreshHeaderOrderCount) {
        window.refreshHeaderOrderCount();
      }
      
      console.log('Đã lưu đơn hàng vào localStorage:', newOrder);
    } catch (error) {
      console.error('Lỗi khi lưu đơn hàng:', error);
    }
  };

  return (
    <div className="container">
      <h1>Thông tin đặt hàng</h1>
      <div className="recipient-container">
        <div className="checkout-container">
          <h2>Thông tin nhận hàng</h2>
          <form onSubmit={handleSubmit}>
            <div className="Name-box">
              <h3>Họ và tên:</h3>
              <input 
                type="text" 
                name="name" 
                placeholder="Nhập họ và tên của bạn" 
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
                placeholder="Nhập email của bạn" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="Address-box">
              <h3>Địa chỉ:</h3>
              <input 
                type="text" 
                name="address" 
                placeholder="Nhập địa chỉ nhận hàng" 
                value={formData.address} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="Phone-box">
              <h3>Số điện thoại:</h3>
              <input 
                type="tel" 
                name="phone" 
                placeholder="Nhập số điện thoại" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
              />
            </div>
          </form>
        </div>

        <div className="cart-container">
          <h2>{isDirectCheckout ? 'Đơn hàng của bạn' : 'Giỏ hàng'}</h2>
          {isDirectCheckout && (
            <div className="checkout-summary">
              <h3>Thông tin đơn hàng:</h3>
              <div className="checkout-items">
                {checkoutItems.map((item, index) => (
                  <div key={index} className="checkout-item">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Size: {item.size} | Màu: {item.color}</p>
                      <p>Số lượng: {item.quantity}</p>
                      <p className="item-price">{item.price.toLocaleString('vi-VN')} ₫</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="checkout-total">
                <strong>Tổng tiền: {checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('vi-VN')} ₫</strong>
              </div>
            </div>
          )}
          
          {/* Chỉ hiển thị Cart khi không phải direct checkout */}
          {!isDirectCheckout && <Cart />}
        </div>
      </div>

      <div className="checkout-button">
        {/* Nút đặt hàng chính */}
        <div className="main-order-button">
          <button 
            className="btn-place-order" 
            onClick={handlePaymentCOD} 
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "🛒 Đặt hàng ngay"}
          </button>
        </div>
        
        {/* Các phương thức thanh toán */}
        <div className="payment-methods">
          <h3>Chọn phương thức thanh toán:</h3>
          <div className="payment-buttons">
            <button 
              className="btn-payment vnpay" 
              onClick={handlePayment} 
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "💳 Thanh toán bằng VNPay"}
            </button>
            <button 
              className="btn-payment momo" 
              onClick={handlePaymentMomo} 
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "📱 Thanh toán bằng Momo"}
            </button>
            <button 
              className="btn-payment cod" 
              onClick={handlePaymentCOD} 
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "💰 Thanh toán khi nhận hàng (COD)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
