// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to BOM Management System</h1>
      </header>

      <section className="home-description">
        <p>
          Our BOM Management System is designed to streamline your material and product tracking processes.
          With an easy-to-use interface, our system helps you manage materials, track expenses,
          and create bills of materials for your products, saving you time and effort in managing your resources.
        </p>
      </section>

      <Link to="/login" className="get-started-button">
        Get Started
      </Link>

      <section className="about-us">
        <h2>About Us</h2>
        <p>
          We are a team of dedicated professionals with extensive experience in manufacturing, supply chain,
          and software development. Our mission is to simplify the way businesses manage their resources,
          from raw materials to finished products, by providing intuitive and effective software solutions.
        </p>
        <p>
          With our BOM Management System, we aim to help businesses of all sizes improve their efficiency,
          reduce waste, and achieve their production goals. Join us in transforming the way materials
          and resources are managed!
        </p>
      </section>
    </div>
  );
}

export default Home;
