import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import PersonalInformationPage from './Pages/PersonalInformation';
import ProductDetail from './components/ProductDetail';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CartTest from './components/CartTest';
import PaymentPage from './Pages/PaymentPage';
import OrderTracker from './Pages/OrderTracker';
import PaymentStatus from "./components/PaymentStatus";
import Help from './Pages/Help';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { useEffect } from "react";

// Admin
import Admin from './Pages/Admin';

import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isPaymentStatusRoute = location.pathname === '/payment-status';

  return (
    <div className="App">
      {/* ScrollToTop component - tự động scroll lên đầu khi chuyển route */}
      <ScrollToTop />
      
      {/* Hiển thị Header và Footer chỉ với người dùng thường */}
      {!isAdminRoute && !isPaymentStatusRoute && <Header className="App-header" />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/men" element={<Navigate to="/products?tag=men" replace />} />
        <Route path="/women" element={<Navigate to="/products?tag=women" replace />} />
        <Route path="/kids" element={<Navigate to="/products?tag=kids" replace />} />
        <Route path="/sports" element={<Navigate to="/products?tag=sports" replace />} />
        <Route path="/shoes" element={<Navigate to="/products?tag=shoes" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PersonalInformationPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-tracker" element={<OrderTracker />} />
        <Route path="/help" element={<Help />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cart-test" element={<CartTest />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
        {/* Admin routes */}
        <Route path="/admin/*" element={<Admin />} />
      </Routes>

      {!isAdminRoute && !isPaymentStatusRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
