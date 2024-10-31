// src/pages/Login.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <h1 className="login-title">Login Page</h1>
      <p>Please log in to access your account.</p>
      <form className="login-form">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" placeholder="Enter your username" required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" required />

        <div className="login-register-buttons">
          <button type="submit" className="login-button">Log in</button>
          <Link to="/register" className="register-button">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
