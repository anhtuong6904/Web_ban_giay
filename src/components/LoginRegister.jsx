import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import './LoginRegister.css';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
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
        
        login(userInfo);
        alert('Đăng nhập thành công!');
        navigate('/home');
      } else {
        if (password !== confirmPassword) {
          alert('Mật khẩu không khớp!');
          return;
        }
        
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
        
        login(userInfo);
        alert('Đăng ký thành công!');
        navigate('/home');
      }
    } catch (error) {
      alert(error.message);
    }
    
    // Reset form
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
  };

  return (
    <div className="login-register-container">
      <div className="login-register-header">
        <h1>{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</h1>
      </div>
      <form className="login-register-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="username">Tên người dùng:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên người dùng (tùy chọn)"
            />
          </div>
        )}

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
