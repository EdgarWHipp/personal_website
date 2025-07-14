import React, { useState, useEffect, useRef } from 'react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const [isBwellPage, setIsBwellPage] = useState(false);
  const animationRef = useRef();

  useEffect(() => {
    // Check if on Bwell page
    const checkPage = () => {
      setIsBwellPage(window.location.pathname === '/bwell');
    };
    
    checkPage();
    
    // Listen for navigation changes
    const handlePopState = () => {
      checkPage();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Also check on initial load and when navigating
    const observer = new MutationObserver(() => {
      checkPage();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    const handleMouseMove = (e) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);
      
      // Cancel previous animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Use requestAnimationFrame for smoother updates
      animationRef.current = requestAnimationFrame(() => {
        setTrail(prevTrail => {
          const newTrail = [newPosition, ...prevTrail.slice(0, 20)]; // Reduced to 20 for better performance
          return newTrail;
        });
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    // Hide default cursor everywhere, including interactive elements
    const style = document.createElement('style');
    style.innerHTML = `
      *, *:hover, *:active, *:focus {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('popstate', handlePopState);
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      document.head.removeChild(style);
    };
  }, []);

  const emissionColor = isBwellPage ? 'bg-blue-400' : 'bg-orange-400';

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Trail elements - color changes based on page */}
      {trail.map((position, index) => (
        <div
          key={index}
          className={`absolute ${emissionColor} rounded-full`}
          style={{
            left: `${position.x - 3}px`,
            top: `${position.y - 3}px`,
            width: `${Math.max(0.5, 7 - index * 0.3)}px`,
            height: `${Math.max(0.5, 7 - index * 0.3)}px`,
            opacity: Math.max(0.02, 0.8 - index * 0.035),
            transform: `scale(${Math.max(0.1, 1 - index * 0.04)})`,
          }}
        />
      ))}
    </div>
  );
} 