// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h2>Streamline Your Production, Optimize Your Resources</h2>
          <p>
            Discover the powerful tools of our BOM Management System, designed to make material and product tracking effortless.
            Enhance efficiency, minimize waste, and stay on top of your production goals.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="primary-button">GET STARTED</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
