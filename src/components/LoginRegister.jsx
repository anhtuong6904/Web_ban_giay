import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import './LoginRegister.css';

export default function LoginRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Lấy username từ email nếu không có displayName
      const displayName = user.displayName || email.split('@')[0];
      
      const userInfo = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL
      };
      
              await login(userInfo);
        alert('Đăng nhập thành công!');
        navigate('/home');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('Email không tồn tại!');
      } else if (error.code === 'auth/wrong-password') {
        setError('Mật khẩu không đúng!');
      } else {
        setError('Có lỗi xảy ra: ' + error.message);
      }
    }
    
    // Reset form
    setEmail('');
    setPassword('');
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userInfo = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL
      };
      
              await login(userInfo);
        alert('Đăng nhập bằng Google thành công!');
        navigate('/home');
    } catch (error) {
      setError('Đăng nhập bằng Google thất bại: ' + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Đăng Nhập</h1>
          <p>Đăng nhập để mua sắm</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button className="auth-btn" type="submit">
            Đăng Nhập
          </button>
        </form>

        <div className="auth-divider">
          <span>hoặc</span>
        </div>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.785 9.169c0-.738-.06-1.276-.189-1.834h-8.42v3.328h4.842c-.1.828-.638 2.328-1.834 3.328l-.022.112 2.662 2.063.185.018c1.694-1.565 2.674-3.878 2.674-6.015z"/>
            <path fill="#34A853" d="M9.175 17.938c2.422 0 4.455-.797 5.94-2.172l-2.662-2.063c-.746.51-1.74.797-3.278.797-2.518 0-4.66-1.697-5.42-3.978h-.098l-.092.018L1.254 13.5l-.018.092c1.215 2.422 3.704 4.346 6.939 4.346z"/>
            <path fill="#FBBC05" d="M3.755 10.718c-.18-.54-.282-1.116-.282-1.718s.102-1.178.282-1.718L1.254 5.5l-.092-.018C.555 6.159.308 7.22.308 8.5s.247 2.341.854 3.018l2.593-2.8z"/>
            <path fill="#EA4335" d="M9.175 3.062c1.684 0 2.81.597 3.458 1.098l2.525-2.525C13.62.438 11.598 0 9.175 0 5.94 0 3.451 1.924 2.236 4.346l2.593 2.8c.76-2.281 2.902-3.978 5.42-3.978z"/>
          </svg>
          Đăng nhập bằng Google
        </button>

        <div className="auth-footer">
          <p>
            Chưa có tài khoản? 
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="toggle-auth-btn"
            >
              Đăng Ký
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
