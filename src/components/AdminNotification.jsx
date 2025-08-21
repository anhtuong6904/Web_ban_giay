import React, { useState, useEffect } from 'react';
import { AdminService } from '../services/adminService';
import './AdminNotification.css';

export default function AdminNotification() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Kiểm tra đơn hàng mới mỗi 10 giây
    const interval = setInterval(checkNewOrders, 10000);
    
    // Kiểm tra ngay khi component mount
    checkNewOrders();
    
    return () => clearInterval(interval);
  }, []);

  const checkNewOrders = () => {
    try {
      const allOrders = AdminService.getAllOrders();
      const pendingOrders = allOrders.filter(order => order.status === 'pending');
      
      // Tạo thông báo cho đơn hàng mới
      const newNotifications = pendingOrders.map(order => ({
        id: order.orderId,
        type: 'new_order',
        title: 'Đơn hàng mới',
        message: `Đơn hàng #${order.orderId} từ ${order.customerInfo?.fullName || order.customerInfo?.name || 'Khách hàng'}`,
        order: order,
        timestamp: new Date(),
        read: false
      }));
      
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error checking new orders:', error);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="admin-notification">
      {/* Bell icon với badge */}
      <div 
        className="notification-bell"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {/* Dropdown notifications */}
      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Thông báo ({notifications.length})</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-read">
                Đánh dấu đã đọc
              </button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {notification.type === 'new_order' && '🆕'}
                </div>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">
                    {notification.timestamp.toLocaleTimeString('vi-VN')}
                  </div>
                </div>
                {!notification.read && <div className="unread-indicator" />}
              </div>
            ))}
          </div>
          
          <div className="notification-footer">
            <button 
              onClick={() => setShowNotifications(false)}
              className="close-notifications"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
