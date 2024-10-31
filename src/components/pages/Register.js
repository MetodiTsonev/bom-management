// src/pages/Register.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

function Register() {
  return (
    <div className="register-container">
      <h1 className="register-title">Register Page</h1>
      <p>Create a new account.</p>
      <form className="register-form">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" placeholder="Enter your username" required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" required />

        <div className="register-login-buttons">
          <button type="submit" className="register-submit-button">Register</button>
          <Link to="/login" className="login-button">Log in</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
