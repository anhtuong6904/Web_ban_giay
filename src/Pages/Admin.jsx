import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TaskbarAdmin from '../components/TaskbarAdmin';
import AdminDashboard from '../components/AdminDashboard';
import ManageOrders from '../components/ManageOrders';
import ManageUsers from '../components/ManageUsers';
import ManageProducts from '../components/ManageProducts';
import './Admin.css';

export default function Admin() {
  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <TaskbarAdmin />
      </div>
      <div className="admin-main">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/orders" element={<ManageOrders />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/products" element={<ManageProducts />} />
        </Routes>
      </div>
    </div>
  );
}
