import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { loginUser } from "../api/logInApi";
import saveAuthData from "../auth/UserDataFunction";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await loginUser(loginData);
      saveAuthData({
        token: data.token,
        userId: data.userId,
        email: data.email
      });
      navigate("/home");
    } catch (err) {
      setError(err?.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box">
        <h1>Welcome Back</h1>
        <p className="subtitle">Please enter your details to sign in.</p>
        
        <form onSubmit={handleLoginSubmit}>
          {error && <div className="error-text" role="alert">{error}</div>}
          
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="toggle-text">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}