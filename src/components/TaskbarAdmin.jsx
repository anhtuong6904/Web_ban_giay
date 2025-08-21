import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminNotification from './AdminNotification';
import './taskbarAdmin.css';

export default function TaskbarAdmin() {
  const { currentUser } = useAuth();

  return (
    <div className="taskbar-admin">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-logo">
          <div className="admin-logo-icon"><img src="/images/logo.png" style={{width: '50px', height: '50px'}} alt="UTH Shoes" /></div>
          <div className="admin-logo-text">UTH Shoes</div>
        </div>
        <div className="welcome-text">Chào mừng trở lại</div>
        <div className="admin-user-info">Administrator</div>
        <div className="admin-role">Quản trị viên</div>
      </div>


      <div className="nav-section">

        <ul className="admin-nav">
        <li>
            <Link to="/admin" className="admin-link">
              <span className="admin-link-icon"></span>
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/admin/orders" className="admin-link">
              <span className="admin-link-icon"></span>
              Quản lý đơn hàng
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="admin-link">
              <span className="admin-link-icon"></span>
              Quản lý người dùng
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className="admin-link">
              <span className="admin-link-icon"></span>
              Quản lý sản phẩm
            </Link>
          </li>
        </ul>
      </div>

      {/* Notifications */}
      <div className="admin-notification">
        <AdminNotification />
      </div>

      {/* Upgrade Section */}
      <div className="upgrade-section">
        <div className="upgrade-title">Nâng cấp lên Pro</div>
        <div className="upgrade-description">
          Để có thêm tính năng và component
        </div>
      </div>
    </div>
  );
}
