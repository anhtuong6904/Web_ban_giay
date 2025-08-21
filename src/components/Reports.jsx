import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './Reports.css'; // Assuming you have a CSS file for styling

export default function Report() {
  const [reports] = useState([
    { id: 1, date: "2025-08-01", orders: 12, products: 35, revenue: 1250000 },
    { id: 2, date: "2025-08-02", orders: 18, products: 50, revenue: 2150000 },
    { id: 3, date: "2025-08-03", orders: 10, products: 22, revenue: 980000 },
    { id: 4, date: "2025-08-04", orders: 20, products: 60, revenue: 2750000 },
  ]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const formatCurrency = (num) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);

  // Lọc dữ liệu theo khoảng ngày
  const filteredReports = reports.filter((r) => {
    const reportDate = new Date(r.date);
    if (startDate && reportDate < startDate) return false;
    if (endDate && reportDate > endDate) return false;
    return true;
  });

  const totalOrders = filteredReports.reduce((acc, r) => acc + r.orders, 0);
  const totalProducts = filteredReports.reduce((acc, r) => acc + r.products, 0);
  const totalRevenue = filteredReports.reduce((acc, r) => acc + r.revenue, 0);

  return (
    <div className="report-page">
      <h1>Báo cáo doanh thu</h1>

      {/* Bộ chọn khoảng ngày */}
      <div className="date-filter">
        <div>
          <label>Từ ngày:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Chọn ngày bắt đầu"
            className="date-input"
          />
        </div>
        <div>
          <label>Đến ngày:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Chọn ngày kết thúc"
            className="date-input"
          />
        </div>
      </div>

      {/* Tổng quan */}
      <div className="report-summary">
        <div className="card">
          <h3>Tổng đơn hàng</h3>
          <p>{totalOrders}</p>
        </div>
        <div className="card">
          <h3>Tổng sản phẩm</h3>
          <p>{totalProducts}</p>
        </div>
        <div className="card">
          <h3>Tổng doanh thu</h3>
          <p>{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Bảng chi tiết */}
      <table className="report-table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Số đơn hàng</th>
            <th>Số lượng sản phẩm</th>
            <th>Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.orders}</td>
              <td>{r.products}</td>
              <td>{formatCurrency(r.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
