import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";
import "./LoginRegister.css";

export default function LoginRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // 1. Login Firebase
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();

      // 2. Lấy thông tin từ backend
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("📥 Response:", data);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Sai email hoặc mật khẩu, vui lòng thử lại");
      }

      const u = data.user;
      await login({
        uid: userCred.user.uid,
        email: u.email || "",
        displayName: u.fullName || u.email,
        fullName: u.fullName || u.email,
        photoURL: u.imageUrl || null,
      });

      alert("Đăng nhập thành công!");
      navigate("/home");
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
      setError(err.message || "Sai email hoặc mật khẩu, vui lòng thử lại");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Column - Sign In */}
        <div className="signin-section">
          <div className="signin-content">
            <h1>Sign in</h1>

            {/* Social login buttons */}
            <div className="social-login">
              <button className="social-btn facebook"><span>F</span></button>
              <button className="social-btn google"><span>G</span></button>
              <button className="social-btn linkedin"><span>in</span></button>
            </div>

            <div className="separator">or use your email</div>

            {error && <div className="error-message">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

              <a href="#" className="forgot-password">
                Forgot your password?
              </a>

              <button className="signin-btn" type="submit">
                Sign In
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Sign Up */}
        <div className="signup-section">
          <div className="signup-content">
            <h2>Hello, Friend!</h2>
            <p>Welcome to our UTH SHOES. Login to your account to continue</p>
            <button className="signup-btn" onClick={() => navigate("/register")}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
