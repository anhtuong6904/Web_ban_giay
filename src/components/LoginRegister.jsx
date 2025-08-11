import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import './LoginRegister.css';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Đăng nhập thành công!');
      } else {
        if (password !== confirmPassword) {
          alert('Mật khẩu không khớp!');
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Đăng ký thành công!');
      }
    } catch (error) {
      alert(error.message);
    }
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    // Redirect to home page after login/register
    window.location.href = '/home';
    
  };

  return (
    <div className="login-register-container">
      <div className="login-register-header">
        <h1>{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</h1>
      </div>
      <form className="login-register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {!isLogin && (
          <div className="form-group">
            <label htmlFor="confirm-password">Xác nhận mật khẩu:</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        <button className="login-btn" type="submit">
          {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
        </button>
      </form>

      <div className="login-register-footer">
        <p>
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ cursor: 'pointer', color: 'blue' }}
          >
            {isLogin ? ' Đăng Ký' : ' Đăng Nhập'}
          </span>
        </p>
      </div>
    </div>
  );
}
