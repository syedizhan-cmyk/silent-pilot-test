import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="grid-pattern"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Powered by AI</span>
          </div>
          
          <h1 className="hero-title">
            Your Silent Co-Pilot for
            <span className="gradient-text"> Productivity</span>
          </h1>
          
          <p className="hero-description">
            Experience the future of work with AI-powered assistance that understands your needs.
            Automate tasks, generate insights, and boost your productivity silently in the background.
          </p>
          
          <div className="hero-actions">
            <button className="btn btn-hero-primary">
              Start Free Trial
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn btn-hero-secondary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
              Watch Demo
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">10k+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <div className="stat-value">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <div className="stat-value">4.9/5</div>
              <div className="stat-label">Rating</div>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="visual-card">
            <div className="card-header">
              <div className="card-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="card-title">AI Assistant</div>
            </div>
            <div className="card-content">
              <div className="message-bubble">
                <div className="avatar"></div>
                <div className="message">
                  <div className="message-text">How can I help you today?</div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
