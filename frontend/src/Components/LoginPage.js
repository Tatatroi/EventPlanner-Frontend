import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { loginUser, saveAuthToken } from "../api/logInApi";

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
      const token = data?.token || data?.accessToken || data?.jwt;
      if (token) {
        saveAuthToken(token);
      }
      // Navigate on success (adjust route if needed)
      navigate("/home");
    } catch (err) {
      setError(err?.message || "Eroare la autentificare");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box">
        <h1>Sign In</h1>
        <form onSubmit={handleLoginSubmit}>
          {error && <p className="error-text" role="alert">{error}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="toggle-text">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
