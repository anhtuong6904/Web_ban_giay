import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './Pages/Home';
import Login from './Pages/Login';
import PersonalInformationPage from './Pages/PersonalInformation';
import ProductDetail from './components/ProductDetail';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import PaymentPage from './Pages/PaymentPage';

// Admin
import Admin from './Pages/Admin';

import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminRoute && <Header className="App-header" />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/men" element={<Navigate to="/products?tag=men" replace />} />
        <Route path="/women" element={<Navigate to="/products?tag=women" replace />} />
        <Route path="/kids" element={<Navigate to="/products?tag=kids" replace />} />
        <Route path="/sports" element={<Navigate to="/products?tag=sports" replace />} />
        <Route path="/brands" element={<Navigate to="/products?tag=brands" replace />} />
        <Route path="/shoes" element={<Navigate to="/products?tag=shoes" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<PersonalInformationPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />

        {/* Admin routes */}
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
      {!isAdminRoute && <Footer />}
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
