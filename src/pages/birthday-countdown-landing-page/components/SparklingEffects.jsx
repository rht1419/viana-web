import React, { useEffect, useState } from 'react';

const SparklingEffects = () => {
  const [sparkles, setSparkles] = useState([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Generate initial sparkles
    const initialSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2,
      color: ['#FF69B4', '#DDA0DD', '#87CEEB', '#FFFFFF']?.[Math.floor(Math.random() * 4)]
    }));
    setSparkles(initialSparkles);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {sparkles?.map((sparkle) => (
        <div
          key={sparkle?.id}
          className="absolute animate-pulse"
          style={{
            left: `${sparkle?.x}%`,
            top: `${sparkle?.y}%`,
            transform: `translateY(${scrollY * 0.2}px)`,
            animationDelay: `${sparkle?.delay}s`,
            animationDuration: `${sparkle?.duration}s`
          }}
        >
          {/* Star Shape */}
          <div
            className="relative"
            style={{
              width: `${sparkle?.size * 4}px`,
              height: `${sparkle?.size * 4}px`
            }}
          >
            <div
              className="absolute inset-0 rotate-0"
              style={{
                background: sparkle?.color,
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))'
              }}
            ></div>
          </div>
        </div>
      ))}
      {/* Floating Glitter Particles */}
      {Array.from({ length: 15 })?.map((_, i) => (
        <div
          key={`glitter-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full animate-gentle-float opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            transform: `translateY(${scrollY * 0.1}px)`,
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)'
          }}
        ></div>
      ))}
    </div>
  );
};

export default SparklingEffects;