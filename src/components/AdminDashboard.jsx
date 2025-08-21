import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import './AdminDashboard.css'; // Assuming you have a CSS file for styling

const salesData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 2100 },
  { month: "Mar", revenue: 1800 },
  { month: "Apr", revenue: 2500 },
  { month: "May", revenue: 3000 },
  { month: "Jun", revenue: 2800 },
];

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">📊 Admin Dashboard</h1>
      <p className="dashboard-subtitle">Tổng quan tình hình kinh doanh cửa hàng giày</p>

      {/* Thống kê nhanh */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Doanh thu</h3>
          <p className="stat-value">₫ 50,000,000</p>
        </div>
        <div className="stat-card">
          <h3>Đơn hàng</h3>
          <p className="stat-value">1,245</p>
        </div>
        <div className="stat-card">
          <h3>Sản phẩm</h3>
          <p className="stat-value">320</p>
        </div>
        <div className="stat-card">
          <h3>Khách hàng</h3>
          <p className="stat-value">980</p>
        </div>
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="chart-container">
        <h2>Doanh thu theo tháng</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top sản phẩm bán chạy */}
      <div className="chart-container">
        <h2>Sản phẩm bán chạy</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { name: "Nike Air", sold: 150 },
            { name: "Adidas Ultra", sold: 120 },
            { name: "Puma RS-X", sold: 90 },
            { name: "Converse Chuck", sold: 75 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sold" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
