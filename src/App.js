// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/pages/Home';
import Products from './components/pages/Products';
import Expenses from './components/pages/Expenses';
import BOM from './components/pages/Bom';
import Login from './components/pages/Login';
import Materials from './components/pages/Materials';

function App() {
  return (
    <Router>
      {/* Navbar will appear on every page */}
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/products" element={<Products />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/bom" element={<BOM />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
