import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase"; // file config firebase
import "./Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const token = await userCred.user.getIdToken();

      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: userCred.user.uid,
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Đăng ký thất bại!");
      }

      setSuccess("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("❌ Register error:", err);
      setError(err.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Column - Sign Up */}
        <div className="signup-section">
          <div className="signup-content">
            <h1>Sign Up</h1>

            {/* Social login buttons */}
            <div className="social-login">
              <button className="social-btn facebook"><span>F</span></button>
              <button className="social-btn google"><span>G</span></button>
              <button className="social-btn linkedin"><span>in</span></button>
            </div>

            <div className="separator">or use your email for registration</div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
              </div>

              <button className="signup-btn" type="submit">
                Sign Up
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Sign In */}
        <div className="signin-section">
          <div className="signin-content">
            <h2>Welcome Back!</h2>
            <p>To keep connected with us please login with your personal info</p>
            <button className="signin-btn" onClick={() => navigate("/login")}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
