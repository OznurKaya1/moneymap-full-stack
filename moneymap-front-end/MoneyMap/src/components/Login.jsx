import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const result = await login(email, password); // returns plain text
      if (result === "Login successful") {
        navigate("/home"); // redirect to home on success
      } else {
        setError(result);
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-page">
      <form className="login-container" onSubmit={handleLogin}>
        <h1 className="login">Login</h1>

        {/* Email input */}
        <div className="input-box">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password input */}
        <div className="input-box">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Error message */}
        {error && <p className="error-message">{error}</p>}

        {/* Login button */}
        <button type="submit" className="btn">
          Login
        </button>

        {/* Links */}
        <div className="login-links">
          <Link to="/signup" className="clickable-underline">
            Don't have an account?
          </Link>
          <Link to="/forgotmypassword" className="clickable-underline">
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
}