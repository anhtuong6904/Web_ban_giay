import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './taskbarAdmin.css'; // Assuming you have a CSS file for styling
export default function TaskbarAdmin() {
  // const [isAdmin, setIsAdmin] = useState(false);

  // useEffect(() => {
  //   const userRole = localStorage.getItem('userRole');
  //   setIsAdmin(userRole === 'admin');
  // }, []);
  const { currentUser } = useAuth();

  return (
    <div className="taskbar-admin" >
      {/* {isAdmin && ( */}
        <span className="welcome-text">Welcome, {currentUser.displayName}!</span>
        <br/>
          <Link to="/admin/dashboard" className="admin-link" style={{ color: 'white' }}>Dashboard</Link>
          <Link to="/admin/manage-products" className="admin-link" style={{ color: 'white' }}>Quản lý sản phẩm</Link>
          <Link to="/admin/manage-orders" className="admin-link" style={{ color: 'white' }}>Quản lý đơn hàng</Link>
          <Link to="/admin/manage-users" className="admin-link" style={{ color: 'white' }}>Quản lý người dùng</Link>
          <Link to="/admin/reports" className="admin-link" style={{ color:  'white' }}>Báo cáo</Link>
          <Link to="/home" className="admin-link" style={{ color: 'white' }}>Quay lại trang chủ</Link> 
    </div>
  );
}
