// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar({ isAuthenticated, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          BOM MS
        </Link>
        <ul className="nav-menu">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/materials" className="nav-links">Materials</Link>
              </li>
              <li className="nav-item">
                <Link to="/products" className="nav-links">Products</Link>
              </li>
              <li className="nav-item">
                <Link to="/expenses" className="nav-links">Expenses</Link>
              </li>
              <li className="nav-item">
                <Link to="/bom" className="nav-links">BoM</Link>
              </li>
              <li className="nav-item">
                <button id='logout' className="nav-links-logout" onClick={onLogout}>Log out</button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-links-logout">Log in</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
