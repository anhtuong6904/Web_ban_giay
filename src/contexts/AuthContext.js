import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { readCart, clearCart } from '../services/cartService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Lấy thông tin người dùng từ localStorage nếu có
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          setCurrentUser(JSON.parse(userInfo));
        } else {
          // Tạo thông tin người dùng mặc định
          const defaultUserInfo = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0], // Lấy username từ email
            photoURL: user.photoURL
          };
          setCurrentUser(defaultUserInfo);
          localStorage.setItem('userInfo', JSON.stringify(defaultUserInfo));
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('userInfo');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (userInfo) => {
    setCurrentUser(userInfo);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    // Nếu là user local (không dùng Firebase), bỏ qua lưu /api/users
    const isLocal = !userInfo?.uid || String(userInfo.uid).startsWith('local:');
    if (isLocal) return;

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUID: userInfo.uid,
          email: userInfo.email,
          displayName: userInfo.displayName,
          photoURL: userInfo.photoURL
        }),
      });
      if (!response.ok) {
        console.error('Failed to save user to database');
      }
    } catch (error) {
      console.error('Error saving user to database:', error);
    }
  };

  const logout = () => {
    try {
      const raw = localStorage.getItem('userInfo');
      const parsed = raw ? JSON.parse(raw) : null;
      // Không xóa ảnh base64 đã lưu theo identity
      // Chỉ xóa thông tin đăng nhập
    } catch {}
    setCurrentUser(null);
    localStorage.removeItem('userInfo');
    // Clear guest cart when logging out to enforce per-user cart isolation
    try { clearCart(); } catch (e) {}
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
