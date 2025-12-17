import React, { useEffect, useState } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let rafId = null;
    let currentX = 0;
    let currentY = 0;
    
    const updatePosition = (e) => {
      currentX = e.clientX;
      currentY = e.clientY;
      
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        setPosition({ x: currentX, y: currentY });
        rafId = null;
      });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      // Don't expand cursor - keep it consistent
      setIsHovering(false);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div
        className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
      <div
        className={`custom-cursor-dot ${isHovering ? 'hovering' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
};

export default CustomCursor;
