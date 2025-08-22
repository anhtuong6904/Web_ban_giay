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
        fullName: u.fullName || u.username,
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
        {/* Left Column - Sign In */}
        <div className="signin-section">
          <div className="signin-content">
            <h1>Sign in</h1>
            
            {/* Social Login Buttons */}
            <div className="social-login">
              <button className="social-btn facebook">
                <span>f</span>
              </button>
              <button className="social-btn google">
                <span>G+</span>
              </button>
              <button className="social-btn linkedin">
                <span>in</span>
              </button>
            </div>
            
            <p className="separator">or use your account</p>
            
            {error && <div className="error-message">{error}</div>}
            
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>

              <a href="#" className="forgot-password">Forgot your password?</a>

              <button className="signin-btn" type="submit">
                SIGN IN
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Sign Up */}
        <div className="signup-section">
          <div className="signup-content">
            <h2>Hello, Friend!</h2>
            <p>Welcome to our UTH SHOES. Login to your account to continue</p>
            <button 
              className="signup-btn" 
              onClick={() => navigate('/register')}
            >
              SIGN UP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
