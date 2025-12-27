import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/userApi";
import "./Login.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [registerData, setRegisterData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const { name, lastName, email, password } = registerData;
      await registerUser({ name, lastName, email, password });
      setSuccess("Account created successfully!");
      
      // Brief delay so they can see the success message before navigating
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box">
        <h1>Create Account</h1>
        <p className="subtitle">Join us to start planning and managing your events.</p>

        <form onSubmit={handleRegisterSubmit}>
          {error && <div className="error-text" role="alert">{error}</div>}
          {success && <div className="success-text" style={{ 
            color: "#166534", 
            backgroundColor: "#dcfce7", 
            padding: "10px", 
            borderRadius: "6px", 
            fontSize: "13px",
            marginBottom: "10px",
            border: "1px solid #bbf7d0"
          }}>{success}</div>}

          {/* Side-by-side names look more professional */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="name"
                placeholder="Jane"
                value={registerData.name}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                value={registerData.lastName}
                onChange={handleRegisterChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={registerData.email}
              onChange={handleRegisterChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={registerData.password}
              onChange={handleRegisterChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              required
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="toggle-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}