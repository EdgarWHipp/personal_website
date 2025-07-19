import React, { useState, useEffect, useRef } from 'react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const [isMoving, setIsMoving] = useState(false);
  const animationRef = useRef();
  const movementTimeoutRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);
      setIsMoving(true);
      
      // Clear existing timeout and set new one
      if (movementTimeoutRef.current) {
        clearTimeout(movementTimeoutRef.current);
      }
      movementTimeoutRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 100);
      
      // Cancel previous animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Use requestAnimationFrame for smoother updates
      animationRef.current = requestAnimationFrame(() => {
        setTrail(prevTrail => {
          const newTrail = [
            { ...newPosition, id: Date.now() + Math.random() },
            ...prevTrail.slice(0, 20) // Trail length for better performance
          ];
          return newTrail;
        });
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    // Hide default cursor everywhere except in modals/popups
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
      
      /* Specific cursor types for interactive elements in modals */
      .fixed.inset-0.bg-black button,
      .fixed.inset-0.bg-black input,
      .fixed.inset-0.bg-black textarea,
      .fixed.inset-0.bg-black select,
      .fixed.inset-0.bg-black a,
      .z-50 button,
      .z-50 input,
      .z-50 textarea,
      .z-50 select,
      .z-50 a {
        cursor: pointer !important;
      }
      
      .fixed.inset-0.bg-black input[type="text"],
      .fixed.inset-0.bg-black input[type="email"],
      .fixed.inset-0.bg-black input[type="password"],
      .fixed.inset-0.bg-black textarea,
      .z-50 input[type="text"],
      .z-50 input[type="email"],
      .z-50 input[type="password"],
      .z-50 textarea {
        cursor: text !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (movementTimeoutRef.current) {
        clearTimeout(movementTimeoutRef.current);
      }
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Main cursor with orange emission effect */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-75 ease-out"
        style={{
          left: mousePosition.x - 6,
          top: mousePosition.y - 6,
          width: '12px',
          height: '12px',
          background: isMoving 
            ? 'radial-gradient(circle, #f97316 0%, #ea580c 50%, #c2410c 100%)'
            : 'radial-gradient(circle, #fb923c 0%, #f97316 50%, #ea580c 100%)',
          boxShadow: isMoving
            ? '0 0 15px #f97316, 0 0 30px #f9731650, 0 0 45px #f9731625'
            : '0 0 8px #f97316, 0 0 16px #f9731650',
          transform: isMoving ? 'scale(1.3)' : 'scale(1)',
        }}
      />

      {/* Trail particles with orange emission */}
      {trail.map((point, index) => {
        const opacity = Math.max(0, (trail.length - index) / trail.length);
        const size = Math.max(1, 8 * opacity);
        
        return (
          <div
            key={point.id || index}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: point.x - size / 2,
              top: point.y - size / 2,
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(circle, rgba(249, 115, 22, ${opacity * 0.7}) 0%, rgba(249, 115, 22, ${opacity * 0.3}) 50%, rgba(249, 115, 22, 0) 100%)`,
              boxShadow: `0 0 ${size * 1.5}px rgba(249, 115, 22, ${opacity * 0.5})`,
              transition: 'all 0.1s ease-out',
              transform: `scale(${opacity})`,
            }}
          />
        );
      })}
    </div>
  );
} 