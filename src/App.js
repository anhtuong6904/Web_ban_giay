import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './Pages/Home';
import Login from './Pages/Login';
import PersonalInformationPage from './Pages/PersonalInformation';
import ProductDetail from './components/ProductDetail';
import PaymentPage from './Pages/PaymentPage';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { useEffect } from "react";
import './App.css';

// Import test utility
import './utils/testFirebaseStorage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<PersonalInformationPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
