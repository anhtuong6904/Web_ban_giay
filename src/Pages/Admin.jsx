import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Admin components
import TaskbarAdmin from "../components/TaskbarAdmin";
import ManageProducts from "../components/ManageProducts";
import ManageOrders from "../components/ManageOrders";
import ManageUsers from "../components/ManageUsers";
import Reports from "../components/Reports";
import AdminDashboard from "../components/AdminDashboard";
import Home from "./Home";

import "./Admin.css"; // Assuming you have a CSS file for styling


export default function Admin() {
  return (
    <div className="admin-layout">
      {/* Sidebar / Taskbar cho Admin */}
        <TaskbarAdmin className="admin-sidebar"/>

      {/* Nội dung thay đổi theo route */}
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-products" element={<ManageProducts />} />
          <Route path="manage-orders" element={<ManageOrders />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="home" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}
