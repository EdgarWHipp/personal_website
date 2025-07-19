import React, { useState, useEffect } from 'react';

export default function BasicCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    const style = document.createElement('style');
    style.innerHTML = `
      *, *:hover, *:active, *:focus {
        cursor: none !important;
      }
      
      /* Show normal cursor in modals and popups */
      .fixed.inset-0.bg-black *, 
      .fixed.inset-0.bg-black *:hover, 
      .fixed.inset-0.bg-black *:active, 
      .fixed.inset-0.bg-black *:focus,
      .z-50 *, 
      .z-50 *:hover, 
      .z-50 *:active, 
      .z-50 *:focus {
        cursor: auto !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-75 ease-out"
        style={{
          left: mousePosition.x - 5,
          top: mousePosition.y - 5,
          width: '10px',
          height: '10px',
          background: 'white',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
        }}
      />
    </div>
  );
}