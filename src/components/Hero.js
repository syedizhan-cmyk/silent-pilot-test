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
            <span className="gradient-text"> Social Media Marketing</span>
          </h1>
          
          <p className="hero-description">
            Automate your social media marketing, email campaigns, and content creation with AI. 
            Silent Pilot helps businesses grow their online presence effortlessly while you focus on what matters.
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
              <div className="stat-value">500+</div>
              <div className="stat-label">Businesses Growing</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <div className="stat-value">10M+</div>
              <div className="stat-label">Posts Scheduled</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <div className="stat-value">85%</div>
              <div className="stat-label">Time Saved</div>
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
              <div className="card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Content Scheduler
              </div>
            </div>
            <div className="card-content">
              <div className="social-preview">
                <div className="preview-post">
                  <div className="post-header">
                    <div className="platform-badge facebook-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </div>
                    <div className="schedule-time">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      Today at 2:00 PM
                    </div>
                  </div>
                  <div className="post-text">
                    🚀 Exciting news! Our new AI-powered features are transforming how businesses manage their social media. Join us for the big reveal...
                  </div>
                  <div className="post-image-placeholder">
                    <div className="image-preview">
                      <div className="preview-gradient"></div>
                      <div className="preview-shapes">
                        <div className="shape shape-1"></div>
                        <div className="shape shape-2"></div>
                        <div className="shape shape-3"></div>
                      </div>
                      <div className="preview-text">Product Launch 2024</div>
                    </div>
                  </div>
                  <div className="post-stats">
                    <span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      2.4K
                    </span>
                    <span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                      128
                    </span>
                    <span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                      </svg>
                      45
                    </span>
                  </div>
                </div>
                <div className="queue-indicator">
                  <div className="queue-dots">
                    <div className="queue-dot active"></div>
                    <div className="queue-dot"></div>
                    <div className="queue-dot"></div>
                  </div>
                  <div className="queue-text">+12 posts in queue</div>
                  <div className="queue-status">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27C93F" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    AutoPilot Active
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
