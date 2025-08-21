import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginRegister.css';

export default function LoginRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Sai tài khoản hoặc mật khẩu, vui lòng đăng nhập lại');
      }
      const u = data.user;
      await login({
        uid: `local:${u.username}`,
        email: u.email || '',
        displayName: u.fullName || u.username,
        fullName: u.fullName || u.username, // Thêm trường này để đảm bảo
        photoURL: u.imageUrl || null
      });
      alert('Đăng nhập thành công!');
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Sai tài khoản hoặc mật khẩu, vui lòng đăng nhập lại');
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
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
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
