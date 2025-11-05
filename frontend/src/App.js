import React, { useState } from "react";
import "./App.css";

function App() {
  const [isRegistering, setIsRegistering] = useState(true);

  //registration form
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  //login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };
//pana dezvoltam mai tarziu am adaugat mesaje
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    alert("Registration successful!");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    alert("Signed in successfully!");
  };

  return (
    <div className="wrapper">
      <div className="form-box">
        {isRegistering ? (
          <>
            <h1>Register</h1>
            <form onSubmit={handleRegisterSubmit}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={registerData.firstName}
                onChange={handleRegisterChange}
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={registerData.lastName}
                onChange={handleRegisterChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={handleRegisterChange}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerData.password}
                onChange={handleRegisterChange}
              />

              <button type="submit">Register</button>
            </form>

            <p className="toggle-text">
              Already have an account?{" "}
              <button
                className="toggle-button"
                onClick={() => setIsRegistering(false)}
              >
                Sign In
              </button>
            </p>
          </>
        ) : (
          <>
            <h1>Sign In</h1>
            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
              />

              <button type="submit">Sign In</button>
            </form>

            <p className="toggle-text">
              Don’t have an account?{" "}
              <button
                className="toggle-button"
                onClick={() => setIsRegistering(true)}
              >
                Register
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
