import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import OrderTracking from '../components/OrderTracking';
import './OrderTracker.css';

export default function OrderTracker() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Lấy orders từ localStorage (tạm thời)
    loadOrders();
  }, [currentUser, navigate]);

  const loadOrders = () => {
    try {
      const savedOrders = localStorage.getItem(`userOrders:${currentUser.uid || currentUser.email}`);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    setIsTrackingModalOpen(true);
  };

  const closeTrackingModal = () => {
    setIsTrackingModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#28a745';
      case 'delivered': return '#28a745';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đã gửi hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'completed': return 'Hoàn tất';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <div className="order-tracker-container">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="order-tracker-container">
      <div className="order-tracker-header">
        <h1>Theo Dõi Đơn Hàng</h1>
        <p>Kiểm tra trạng thái đơn hàng của bạn</p>
        <button 
          className="refresh-btn"
          onClick={loadOrders}
          disabled={loading}
        >
          🔄 {loading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h3>Chưa có đơn hàng nào</h3>
          <p>Bạn chưa đặt hàng hoặc đơn hàng chưa được lưu</p>
          <button 
            className="shop-now-btn"
            onClick={() => navigate('/products')}
          >
            Mua sắm ngay
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Đơn hàng #{order.orderId || `ORD${Date.now() + index}`}</h3>
                  <p className="order-date">
                    {new Date(order.orderDate || Date.now()).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div 
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusText(order.status)}
                </div>
              </div>

              <div className="order-items">
                {order.items?.map((item, itemIndex) => (
                  <div key={itemIndex} className="order-item">
                    <img 
                      src={item.image || '/images/default-product.png'} 
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-price">{item.price?.toLocaleString('vi-VN')} ₫</p>
                      <p className="item-quantity">Số lượng: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Tổng cộng: {order.total?.toLocaleString('vi-VN')} ₫</strong>
                </div>
                <div className="order-actions">
                  <button 
                    className="track-btn"
                    onClick={() => handleTrackOrder(order)}
                  >
                    Theo dõi chi tiết
                  </button>
                  <button className="cancel-btn">Hủy đơn hàng</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Tracking Modal */}
      <OrderTracking
        order={selectedOrder}
        isOpen={isTrackingModalOpen}
        onClose={closeTrackingModal}
      />
    </div>
  );
}
