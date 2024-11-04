import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar({ isAuthenticated, onLogout }) {
  // State to control the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          BOM MS
        </Link>
        {/* Hamburger icon for mobile */}
        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? '✖' : '☰'}
        </div>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/materials" className="nav-links" onClick={toggleMenu}>Materials</Link>
              </li>
              <li className="nav-item">
                <Link to="/products" className="nav-links" onClick={toggleMenu}>Products</Link>
              </li>
              <li className="nav-item">
                <Link to="/expenses" className="nav-links" onClick={toggleMenu}>Expenses</Link>
              </li>
              <li className="nav-item">
                <Link to="/bom" className="nav-links" onClick={toggleMenu}>BoM</Link>
              </li>
              <li className="nav-item">
                <button id="logout" className="nav-links-logout" onClick={() => { onLogout(); toggleMenu(); }}>
                  Log out
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-links-logout" onClick={toggleMenu}>Log in</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
