import React from 'react';
import './Logo.css';

function Logo() {
  return (
    <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        
        {/* Paper airplane shape */}
        <g className="logo-airplane">
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
        
        {/* Motion lines */}
        <g className="motion-lines">
          <line x1="20" y1="90" x2="35" y2="90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <line x1="10" y1="100" x2="30" y2="100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <line x1="20" y1="110" x2="35" y2="110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </g>
      </svg>
      <span style={{ 
        fontSize: '20px', 
        fontWeight: '700',
        color: 'white',
        whiteSpace: 'nowrap'
      }}>Silent Pilot</span>
    </div>
  );
}

export default Logo;
