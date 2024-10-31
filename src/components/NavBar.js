// src/components/NavBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          BOM MS
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/materials" className="nav-links" onClick={closeMobileMenu}>
              Materials
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-links" onClick={closeMobileMenu}>
              Products
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/expenses" className="nav-links" onClick={closeMobileMenu}>
              Expenses
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/bom" className="nav-links" onClick={closeMobileMenu}>
              BoM
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-links-login" onClick={closeMobileMenu}>
              Log in
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
