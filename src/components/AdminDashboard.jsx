import React, { useState, useEffect } from "react";
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
import { AdminService } from "../services/adminService";
import './AdminDashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    orderStats: { total: 0, pending: 0, processing: 0, delivered: 0, cancelled: 0, completed: 0 },
    totalUsers: 0,
    totalProducts: 0,
    monthlyRevenue: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = () => {
    try {
      const dashboardStats = AdminService.getDashboardStats();
      setStats(dashboardStats);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <div>
            <h1>Dashboard</h1>
            <p className="dashboard-subtitle">Tổng quan hoạt động website</p>
          </div>
          <div className="dashboard-actions">
            <button className="refresh-btn" onClick={loadDashboardData}>
              🔄 Làm mới dữ liệu
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon customers">👥</div>
          </div>
          <div className="stat-value">{stats.totalUsers?.toLocaleString() || '0'}</div>
          <div className="stat-label">Khách hàng</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon revenue">💰</div>
          </div>
          <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
          <div className="stat-label">Doanh thu</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon orders">📦</div>
          </div>
          <div className="stat-value">{stats.orderStats?.total?.toLocaleString() || '0'}</div>
          <div className="stat-label">Đơn hàng</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon products">🛍️</div>
          </div>
          <div className="stat-value">{stats.totalProducts?.toLocaleString() || '0'}</div>
          <div className="stat-label">Sản phẩm</div>
        </div>
      </div>

      {/* Order Status Grid */}
      <div className="order-stats-grid">
        <div className="order-stat-card pending">
          <div className="order-stat-number">{stats.orderStats?.pending || 0}</div>
          <div className="order-stat-label">Chờ xử lý</div>
        </div>
        <div className="order-stat-card processing">
          <div className="order-stat-number">{stats.orderStats?.processing || 0}</div>
          <div className="order-stat-label">Đang xử lý</div>
        </div>
        <div className="order-stat-card delivered">
          <div className="order-stat-number">{stats.orderStats?.delivered || 0}</div>
          <div className="order-stat-label">Đã giao</div>
        </div>
        <div className="order-stat-card completed">
          <div className="order-stat-number">{stats.orderStats?.completed || 0}</div>
          <div className="order-stat-label">Hoàn tất</div>
        </div>
        <div className="order-stat-card cancelled">
          <div className="order-stat-number">{stats.orderStats?.cancelled || 0}</div>
          <div className="order-stat-label">Đã hủy</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Monthly Revenue Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Báo cáo doanh thu theo tháng</h3>
              <p className="chart-subtitle">Thống kê doanh thu 6 tháng gần nhất</p>
            </div>
          </div>
          <div className="chart-content">
            {stats.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.monthlyRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data">
                <div className="no-data-icon">📊</div>
                <p>Chưa có dữ liệu doanh thu</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Top sản phẩm bán chạy</h3>
              <p className="chart-subtitle">Top 10 sản phẩm được mua nhiều nhất</p>
            </div>
          </div>
          <div className="chart-content">
            {stats.topProducts && stats.topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value, name === 'sold' ? 'Đã bán' : 'Doanh thu']} />
                  <Bar dataKey="sold" fill="#10b981" name="Đã bán" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data">
                <div className="no-data-icon">🏆</div>
                <p>Chưa có dữ liệu sản phẩm</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
