import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  return (
    <div className="landing-container">
      {/* Navigation Bar */}
      <nav className="landing-navbar">
        <div className="navbar-brand">Classify</div>
        <ul className="navbar-links">
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#study-tools">Study Tools</a></li>
          <li><a href="#about">About</a></li>
        </ul>
        <div className="navbar-actions">
          <Link to="/login" className="sign-in-link">Sign In</Link>
          <Link to="/signup" className="get-started-btn">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Never Miss an Update. Never Waste a Study Session.</h1>
          <p className="hero-subtitle">Your academic co-pilot for urgent class alerts and smart flashcard micro-learning.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">Start Free</Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="image-placeholder">
            <img src="/assets/images/gettyimages-2105091005.jpg" alt="Student studying with laptop" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
