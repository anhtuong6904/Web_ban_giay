import React, { useState, useEffect } from "react";
import { AdminService } from "../services/adminService";
import "./ManageOrders.css";

export default function ManageOrders() {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = () => {
    try {
      setLoading(true);
      const allOrders = filter === "all" 
        ? AdminService.getAllOrders() 
        : AdminService.getOrdersByStatus(filter);
      setOrders(allOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const success = AdminService.updateOrderStatus(orderId, newStatus, adminNote);
      if (success) {
        alert(`Đã cập nhật trạng thái đơn hàng ${orderId} thành ${newStatus}`);
        loadOrders(); // Reload orders
        setAdminNote(""); // Clear admin note
      } else {
        alert('Không thể cập nhật trạng thái đơn hàng');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'processing': return 'processing';
      case 'delivered': return 'delivered';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return 'pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'delivered': return 'Đã giao';
      case 'completed': return 'Hoàn tất';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="orders-page">
      {/* Orders Header */}
      <div className="orders-header">
        <div className="orders-title">
          <div>
            <h1>Quản lý đơn hàng</h1>
            <p className="orders-subtitle">Xem và quản lý tất cả đơn hàng từ khách hàng</p>
          </div>
          <div className="orders-actions">
            <button className="refresh-btn" onClick={loadOrders}>
              🔄 Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Filter Container */}
      <div className="filter-container">
        <div>
          <label htmlFor="status-filter">Lọc theo trạng thái:</label>
          <select
            id="status-filter"
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả đơn hàng</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="delivered">Đã giao</option>
            <option value="completed">Hoàn tất</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Summary */}
      <div className="orders-summary">
        <div className="summary-item">
          <div className="summary-number">{orders.length}</div>
          <div className="summary-label">Tổng đơn hàng</div>
        </div>
        <div className="summary-item">
          <div className="summary-number">
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div className="summary-label">Chờ xử lý</div>
        </div>
        <div className="summary-item">
          <div className="summary-number">
            {orders.filter(o => o.status === 'processing').length}
          </div>
          <div className="summary-label">Đang xử lý</div>
        </div>
        <div className="summary-item">
          <div className="summary-number">
            {orders.filter(o => o.status === 'delivered' || o.status === 'completed').length}
          </div>
          <div className="summary-label">Đã hoàn tất</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table">
        <div className="table-header">
          <h3>Danh sách đơn hàng</h3>
        </div>
        <div className="table-content">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Đang tải đơn hàng...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <div className="no-orders-icon">📦</div>
              <h3>Không có đơn hàng nào</h3>
              <p>Không tìm thấy đơn hàng nào với bộ lọc hiện tại</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId}>
                    <td>
                      <strong>#{order.orderId}</strong>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">
                          {order.customerInfo?.fullName || order.customerInfo?.name || 'Khách hàng'}
                        </div>
                        <small>{order.customerInfo?.email || 'N/A'}</small>
                      </div>
                    </td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td>
                      <strong>{formatCurrency(order.total)}</strong>
                    </td>
                    <td>
                      <span className={`status ${order.status}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <select
                          className="status-select"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        >
                          <option value="pending">Chờ xử lý</option>
                          <option value="processing">Đang xử lý</option>
                          <option value="delivered">Đã giao</option>
                          <option value="completed">Hoàn tất</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                        <button
                          className="btn-detail"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Chi tiết đơn hàng #{selectedOrder.orderId}</h3>
              <button className="btn-close" onClick={() => setSelectedOrder(null)}>
                ✕
              </button>
            </div>

            <div className="order-details">
              <div className="detail-section">
                <h4>Thông tin khách hàng</h4>
                <p><strong>Tên:</strong> {selectedOrder.customerInfo?.fullName || selectedOrder.customerInfo?.name}</p>
                <p><strong>Email:</strong> {selectedOrder.customerInfo?.email}</p>
                <p><strong>Số điện thoại:</strong> {selectedOrder.customerInfo?.phoneNumber}</p>
                <p><strong>Địa chỉ:</strong> {selectedOrder.customerInfo?.address}</p>
              </div>

              <div className="detail-section">
                <h4>Thông tin đơn hàng</h4>
                <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.orderDate)}</p>
                <p><strong>Trạng thái:</strong> {getStatusText(selectedOrder.status)}</p>
                <p><strong>Tổng tiền:</strong> {formatCurrency(selectedOrder.total)}</p>
                {selectedOrder.adminNote && (
                  <p><strong>Ghi chú admin:</strong> {selectedOrder.adminNote}</p>
                )}
              </div>

              <div className="detail-section">
                <h4>Sản phẩm đã đặt</h4>
                <div className="order-items">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <img
                        src={item.image || '/images/default-product.png'}
                        alt={item.name}
                        className="item-image"
                      />
                      <div className="item-details">
                        <h5>{item.name}</h5>
                        <p className="item-price">{formatCurrency(item.price)}</p>
                        <p className="item-quantity">Số lượng: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-close" onClick={() => setSelectedOrder(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
