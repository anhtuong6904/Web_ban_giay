import React, { useState, useEffect } from 'react';
import { IoCheckmarkCircle, IoTime, IoLocation, IoCar, IoHome, IoClose } from 'react-icons/io5';
import './OrderTracking.css';

export default function OrderTracking({ order, onClose, isOpen }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  useEffect(() => {
    if (order) {
      // Tính toán ngày giao hàng dự kiến (3-5 ngày từ ngày đặt hàng)
      const orderDate = new Date(order.orderDate || order.createdAt || new Date());
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(deliveryDate.getDate() + 4); // 4 ngày sau
      setEstimatedDelivery(deliveryDate.toLocaleDateString('vi-VN'));
      
      // Xác định bước hiện tại dựa trên status
      const statusMap = {
        'pending': 0,
        'processing': 1,
        'shipped': 2,
        'in_transit': 3,
        'delivered': 4,
        'completed': 4
      };
      setCurrentStep(statusMap[order.status] || 0);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const trackingSteps = [
    {
      id: 'order_placed',
      title: 'Đặt hàng thành công',
      description: 'Đơn hàng đã được tiếp nhận và đang xử lý',
      icon: IoCheckmarkCircle,
      color: '#27ae60',
      time: order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : 'Hôm nay'
    },
    {
      id: 'processing',
      title: 'Đang xử lý',
      description: 'Đơn hàng đang được kiểm tra và chuẩn bị',
      icon: IoTime,
      color: '#f39c12',
      time: '1-2 ngày sau khi đặt hàng'
    },
    {
      id: 'shipped',
      title: 'Đã giao cho đơn vị vận chuyển',
      description: 'Đơn hàng đã được đóng gói và giao cho đơn vị vận chuyển',
      icon: IoCar,
      color: '#3498db',
      time: '2-3 ngày sau khi đặt hàng'
    },
    {
      id: 'in_transit',
      title: 'Đang vận chuyển',
      description: 'Đơn hàng đang trên đường đến bạn',
      icon: IoLocation,
      color: '#9b59b6',
      time: '3-4 ngày sau khi đặt hàng'
    },
    {
      id: 'delivered',
      title: 'Giao hàng thành công',
      description: 'Đơn hàng đã được giao đến địa chỉ của bạn',
      icon: IoHome,
      color: '#27ae60',
      time: estimatedDelivery
    }
  ];

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  const getStepIcon = (step, status) => {
    const IconComponent = step.icon;
    if (status === 'completed') {
      return <IoCheckmarkCircle size={24} color={step.color} />;
    }
    if (status === 'current') {
      return <IconComponent size={24} color={step.color} />;
    }
    return <IconComponent size={24} color="#bdc3c7" />;
  };

  return (
    <div className="order-tracking-overlay">
      <div className="order-tracking-modal">
        {/* Header */}
        <div className="tracking-header">
          <h2>Theo dõi đơn hàng #{order.orderId}</h2>
          <button className="close-btn" onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>

        {/* Order Info */}
        <div className="order-info">
          <div className="order-summary">
            <h3>Thông tin đơn hàng</h3>
            <div className="order-details">
              <p><strong>Ngày đặt:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : 'Hôm nay'}</p>
              <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
              <p><strong>Tổng tiền:</strong> {order.total ? order.total.toLocaleString('vi-VN') + ' ₫' : 'N/A'}</p>
              <p><strong>Dự kiến giao hàng:</strong> {estimatedDelivery}</p>
            </div>
          </div>
        </div>

        {/* Tracking Steps */}
        <div className="tracking-steps">
          <h3>Quy trình vận chuyển</h3>
          <div className="steps-container">
            {trackingSteps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={step.id} className={`tracking-step ${status}`}>
                  <div className="step-icon">
                    {getStepIcon(step, status)}
                  </div>
                  <div className="step-content">
                    <h4 className="step-title">{step.title}</h4>
                    <p className="step-description">{step.description}</p>
                    <span className="step-time">{step.time}</span>
                  </div>
                  {index < trackingSteps.length - 1 && (
                    <div className={`step-connector ${status === 'completed' ? 'completed' : ''}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Details */}
        <div className="delivery-details">
          <h3>Thông tin giao hàng</h3>
          <div className="delivery-info">
            <div className="delivery-address">
              <h4>Địa chỉ giao hàng:</h4>
              <p>{order.customerInfo?.name || 'N/A'}</p>
              <p>{order.customerInfo?.phone || 'N/A'}</p>
              <p>{order.customerInfo?.address || 'N/A'}</p>
            </div>
            <div className="delivery-status">
              <h4>Trạng thái hiện tại:</h4>
              <span className={`status-badge ${order.status}`}>
                {order.status === 'pending' && 'Chờ xử lý'}
                {order.status === 'processing' && 'Đang xử lý'}
                {order.status === 'shipped' && 'Đã giao vận chuyển'}
                {order.status === 'in_transit' && 'Đang vận chuyển'}
                {order.status === 'delivered' && 'Đã giao hàng'}
                {order.status === 'completed' && 'Hoàn tất'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="tracking-actions">
          <button className="btn-secondary" onClick={onClose}>
            Đóng
          </button>
          <button className="btn-primary">
            Liên hệ hỗ trợ
          </button>
        </div>
      </div>
    </div>
  );
}
