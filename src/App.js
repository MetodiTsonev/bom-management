// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import Expenses from './pages/Expences/Expences';
import BOM from './pages/Bom/Bom';
import Login from './pages/Home/Login';
import Materials from './pages/Materials/Materials';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check local storage on initial load to set login state
  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (username, password) => {
    // Hardcoded user credentials
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true'); // Persist login state
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated'); // Clear login state
    window.location.href = '/'; // Redirect to home page on logout
  };

  return (
    <Router>
      <NavBar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Protected Routes */}
        <Route path="/materials" element={isAuthenticated ? <Materials /> : <Navigate to="/login" />} />
        <Route path="/products" element={isAuthenticated ? <Products /> : <Navigate to="/login" />} />
        <Route path="/expenses" element={isAuthenticated ? <Expenses /> : <Navigate to="/login" />} />
        <Route path="/bom" element={isAuthenticated ? <BOM /> : <Navigate to="/login" />} />

        {/* Redirect any other route to home if not authenticated */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
