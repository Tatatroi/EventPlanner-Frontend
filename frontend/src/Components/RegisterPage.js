import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/userApi";
import "./Login.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    // client-side validation for password confirmation
    if (registerData.password !== registerData.confirmPassword) {
      setError("Parolele nu coincid");
      setSuccess("");
      return;
    }
    try {
      const { name, lastName, email, password } = registerData;
      await registerUser({ name, lastName, email, password });
  setSuccess("Înregistrare reușită!");
  setError("");
  // after successful registration go to login
  navigate("/login");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box">
        <h1>Register</h1>
        <form onSubmit={handleRegisterSubmit}>
          <input
            type="text"
            name="name"
            placeholder="First Name"
            value={registerData.name}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={registerData.lastName}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={registerData.email}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={registerData.password}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            required
          />
          <button type="submit">Register</button>
          {success && <p style={{ color: "green" }}>{success}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <p className="toggle-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
