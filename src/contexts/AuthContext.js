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
          try {
            const parsedUserInfo = JSON.parse(userInfo);
            console.log('🔍 AuthContext - Found userInfo in localStorage:', parsedUserInfo);
            setCurrentUser(parsedUserInfo);
          } catch (error) {
            console.error('Error parsing userInfo:', error);
            const defaultUserInfo = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email.split('@')[0],
              photoURL: user.photoURL
            };
            setCurrentUser(defaultUserInfo);
            localStorage.setItem('userInfo', JSON.stringify(defaultUserInfo));
          }
        } else {
          // Kiểm tra xem có phải user local không
          const localUserInfo = localStorage.getItem('userInfo');
          if (localUserInfo) {
            try {
              const parsed = JSON.parse(localUserInfo);
              if (parsed.uid && String(parsed.uid).startsWith('local:')) {
                console.log('🔍 AuthContext - Found local user in localStorage:', parsed);
                setCurrentUser(parsed);
                return;
              }
            } catch (error) {
              console.error('Error parsing local userInfo:', error);
            }
          }
          
          // Tạo thông tin người dùng mặc định từ Firebase
          const defaultUserInfo = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL
          };
          console.log('🔍 AuthContext - Creating default userInfo from Firebase:', defaultUserInfo);
          setCurrentUser(defaultUserInfo);
          localStorage.setItem('userInfo', JSON.stringify(defaultUserInfo));
        }
      } else {
        console.log('🔍 AuthContext - User logged out, clearing currentUser');
        setCurrentUser(null);
        localStorage.removeItem('userInfo');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (userInfo) => {
    console.log('🔍 AuthContext - Login called with userInfo:', userInfo);
    
    // Đảm bảo userInfo có đầy đủ thông tin
    const completeUserInfo = {
      uid: userInfo.uid || userInfo.id || `local:${Date.now()}`,
      email: userInfo.email || userInfo.Email || '',
      displayName: userInfo.displayName || userInfo.DisplayName || userInfo.fullName || userInfo.Username || userInfo.username || userInfo.email?.split('@')[0] || 'User',
      photoURL: userInfo.photoURL || userInfo.PhotoURL || userInfo.imageUrl || null,
      Username: userInfo.Username || userInfo.username || userInfo.displayName || userInfo.fullName,
      username: userInfo.username || userInfo.Username || userInfo.displayName || userInfo.fullName,
      fullName: userInfo.fullName || userInfo.displayName || userInfo.Username || userInfo.username
    };
    
    console.log('🔍 AuthContext - Complete userInfo:', completeUserInfo);
    console.log('🔍 AuthContext - Display Name will be:', completeUserInfo.displayName);
    
    setCurrentUser(completeUserInfo);
    localStorage.setItem('userInfo', JSON.stringify(completeUserInfo));

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
    console.log('🔍 AuthContext - Logout called');
    
    try {
      const raw = localStorage.getItem('userInfo');
      const parsed = raw ? JSON.parse(raw) : null;
      console.log('🔍 AuthContext - Clearing userInfo:', parsed);
      
      // Không xóa ảnh base64 đã lưu theo identity
      // Chỉ xóa thông tin đăng nhập
    } catch (error) {
      console.error('Error during logout cleanup:', error);
    }
    
    setCurrentUser(null);
    localStorage.removeItem('userInfo');
    
    // Clear guest cart when logging out to enforce per-user cart isolation
    try { 
      clearCart(); 
      console.log('🔍 AuthContext - Cart cleared');
    } catch (e) {
      console.error('Error clearing cart:', e);
    }
    
    console.log('🔍 AuthContext - Logout completed');
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
