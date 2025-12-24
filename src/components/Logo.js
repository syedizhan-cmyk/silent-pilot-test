import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium', variant = 'default' }) => {
  const sizeClasses = {
    small: 'logo-small',
    medium: 'logo-medium',
    large: 'logo-large',
  };

  const variantClasses = {
    default: 'logo-default',
    white: 'logo-white',
    gradient: 'logo-gradient',
  };

  return (
    <div className={`silent-pilot-logo ${sizeClasses[size]} ${variantClasses[variant]}`}>
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        
        {/* Simple Clean Paper Airplane */}
        <g className="logo-airplane">
          {/* Main body - modern paper airplane shape */}
          <path 
            d="M 40 100 L 160 100 L 180 90 L 160 100 L 180 110 Z" 
            fill="url(#logo-gradient)"
            className="airplane-body"
          />
          
          {/* Wing fold line for depth */}
          <path 
            d="M 80 100 L 160 100" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="2"
            className="fold-line"
          />
          
          {/* Top wing */}
          <path 
            d="M 100 100 L 60 70 L 80 100 Z" 
            fill="url(#logo-gradient)"
            opacity="0.8"
            className="wing-top"
          />
          
          {/* Bottom wing */}
          <path 
            d="M 100 100 L 60 130 L 80 100 Z" 
            fill="url(#logo-gradient)"
            opacity="0.8"
            className="wing-bottom"
          />
        </g>
        
        {/* Speed/Motion Lines - animated */}
        <g className="motion-lines">
          <line 
            x1="20" y1="90" x2="35" y2="90" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round"
            className="motion-line line-1"
            opacity="0.6"
          />
          <line 
            x1="10" y1="100" x2="30" y2="100" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round"
            className="motion-line line-2"
            opacity="0.8"
          />
          <line 
            x1="20" y1="110" x2="35" y2="110" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round"
            className="motion-line line-3"
            opacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
};

export default Logo;
