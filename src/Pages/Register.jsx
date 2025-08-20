import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp!');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Sử dụng username người dùng nhập hoặc lấy từ email
      const displayName = username || email.split('@')[0];
      
      const userInfo = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL
      };
      
              await login(userInfo);
        alert('Đăng ký thành công!');
        navigate('/home');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email này đã được sử dụng!');
      } else if (error.code === 'auth/weak-password') {
        setError('Mật khẩu quá yếu!');
      } else {
        setError('Có lỗi xảy ra: ' + error.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Đăng Ký Tài Khoản</h1>
          <p>Tạo tài khoản mới để mua sắm</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tên người dùng</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên người dùng"
              required
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          <button className="auth-btn" type="submit">
            Đăng Ký
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Đã có tài khoản? 
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="toggle-auth-btn"
            >
              Đăng Nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
