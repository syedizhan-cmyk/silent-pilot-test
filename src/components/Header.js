import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import './Header.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="url(#gradient)" strokeWidth="2"/>
              <path d="M12 16L15 19L20 13" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#5865F2"/>
                  <stop offset="100%" stopColor="#FF73B3"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-text">Silent Pilot</span>
          </div>
          
          <nav className="nav">
            <a href="#features">Features</a>
            <a href="#demo">Demo</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <a href="/login" className="btn btn-secondary">Sign In</a>
            <a href="/signup" className="btn btn-primary">Get Started</a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
