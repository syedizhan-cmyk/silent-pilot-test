import React, { useState, useEffect } from 'react';
import Logo from './Logo';
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
            <Logo size="large" variant="default" />
            <span className="logo-text">Silent Pilot</span>
          </div>
          
          <nav className="nav">
            <a href="#features">Features</a>
            <a href="#demo">Demo</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
          </nav>

          <div className="header-actions">
            <a href="/login" className="btn btn-secondary">Sign In</a>
            <a href="/signup" className="btn btn-primary">Get Started</a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
