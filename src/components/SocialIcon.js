import React from 'react';

const SocialIcon = ({ platform, size = 20 }) => {
  const icons = {
    linkedin: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#0A66C2"/>
        <path d="M6.5 8.5h-2v8h2v-8zm-1-3c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm4 3h-2v8h2v-4c0-1.5 2-1.5 2 0v4h2v-4.5c0-2.5-2-3.5-4-2.5v-1z" fill="white"/>
      </svg>
    ),
    twitter: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#1DA1F2"/>
        <path d="M8.29 20c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" fill="white"/>
      </svg>
    ),
    facebook: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#1877F2"/>
        <path d="M13.5 21v-7.5h2.5l.5-3h-3V9c0-1 .5-1.5 1.5-1.5h1.5V5c-.5 0-1.5-.5-2.5-.5-2.5 0-4 1.5-4 4v2H7.5v3h2.5V21h3.5z" fill="white"/>
      </svg>
    ),
    instagram: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FD1D1D"/>
            <stop offset="50%" stopColor="#E1306C"/>
            <stop offset="100%" stopColor="#833AB4"/>
          </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#instagram-gradient)"/>
        <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
      </svg>
    ),
    tiktok: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#000000"/>
        <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0115.54 3h-3.09v12.4a2.592 2.592 0 01-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 004.3 1.38V7.3s-1.88.09-3.24-1.48z" fill="white"/>
      </svg>
    ),
    youtube: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#FF0000"/>
        <path d="M19.615 6.185a2.5 2.5 0 00-1.76-1.77C16.415 4 12 4 12 4s-4.415 0-5.855.415a2.5 2.5 0 00-1.76 1.77C4 7.625 4 12 4 12s0 4.375.385 5.815a2.5 2.5 0 001.76 1.77C7.585 20 12 20 12 20s4.415 0 5.855-.415a2.5 2.5 0 001.76-1.77C20 16.375 20 12 20 12s0-4.375-.385-5.815zM10 15V9l5 3-5 3z" fill="white"/>
      </svg>
    )
  };

  return icons[platform.toLowerCase()] || <span style={{ fontSize: size }}>📱</span>;
};

export default SocialIcon;
