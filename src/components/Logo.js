import React from 'react';
import './Logo.css';

function Logo() {
  return (
    <div className="logo-container">
      <svg 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg" 
        className="logo-svg"
        width="40"
        height="40"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        
        {/* Paper airplane body */}
        <g className="airplane">
          <path 
            d="M 40 100 L 160 100 L 180 90 L 160 100 L 180 110 Z" 
            fill="url(#logo-gradient)"
          />
          <path 
            d="M 80 100 L 160 100" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="2"
          />
          <path 
            d="M 100 100 L 60 70 L 80 100 Z" 
            fill="url(#logo-gradient)"
            opacity="0.8"
          />
          <path 
            d="M 100 100 L 60 130 L 80 100 Z" 
            fill="url(#logo-gradient)"
            opacity="0.8"
          />
        </g>
        
        {/* Animated motion lines */}
        <g className="speed-lines">
          <line x1="20" y1="90" x2="35" y2="90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="line-1" />
          <line x1="10" y1="100" x2="30" y2="100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="line-2" />
          <line x1="20" y1="110" x2="35" y2="110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="line-3" />
        </g>
      </svg>
      <span className="logo-text">Silent Pilot</span>
    </div>
  );
}

export default Logo;
