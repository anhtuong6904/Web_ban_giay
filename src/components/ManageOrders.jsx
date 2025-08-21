import React, { useState } from "react";
import "./ManageOrders.css";

const ordersData = [
  { id: 1, customer: "Nguyễn Văn A", date: "2023-10-01", total: 1500000, status: "Chờ xử lý" },
  { id: 2, customer: "Trần Thị B", date: "2023-10-02", total: 2000000, status: "Đang giao" },
  { id: 3, customer: "Lê Văn C", date: "2023-10-03", total: 1200000, status: "Hoàn tất" },
  { id: 4, customer: "Phạm Thị D", date: "2023-10-04", total: 1800000, status: "Hủy" },
];

export default function ManageOrders() {
  const [filter, setFilter] = useState("Tất cả");
  const [orders, setOrders] = useState(ordersData);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders =
    filter === "Tất cả"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <div className="orders-page">
      <h1>📦 Quản lý đơn hàng</h1>

      {/* Bộ lọc */}
      <div className="filter-container">
        <label>Lọc theo trạng thái:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>Tất cả</option>
          <option>Chờ xử lý</option>
          <option>Đang giao</option>
          <option>Hoàn tất</option>
          <option>Hủy</option>
        </select>
      </div>

      {/* Bảng đơn hàng */}
      <table className="orders-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.date}</td>
              <td>{order.total.toLocaleString()} ₫</td>
              <td>
                <span className={`status ${order.status.replace(" ", "-")}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option>Chờ xử lý</option>
                  <option>Đang giao</option>
                  <option>Hoàn tất</option>
                  <option>Hủy</option>
                </select>
                <button className="btn-detail" onClick={() => setSelectedOrder(order)}>
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal chi tiết */}
      {selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
            <p><strong>Khách hàng:</strong> {selectedOrder.customer}</p>
            <p><strong>Ngày đặt:</strong> {selectedOrder.date}</p>
            <p><strong>Tổng tiền:</strong> {selectedOrder.total.toLocaleString()} ₫</p>
            <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
            <button className="btn-close" onClick={() => setSelectedOrder(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}
