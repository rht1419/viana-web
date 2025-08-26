import React, { useEffect, useState } from 'react';

const CloudBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const clouds = [
    { id: 1, size: 'large', x: 10, y: 20, speed: 0.3, opacity: 0.7 },
    { id: 2, size: 'medium', x: 70, y: 15, speed: 0.2, opacity: 0.5 },
    { id: 3, size: 'small', x: 30, y: 60, speed: 0.4, opacity: 0.6 },
    { id: 4, size: 'large', x: 80, y: 70, speed: 0.25, opacity: 0.4 },
    { id: 5, size: 'medium', x: 5, y: 80, speed: 0.35, opacity: 0.5 },
    { id: 6, size: 'small', x: 60, y: 40, speed: 0.3, opacity: 0.7 },
    { id: 7, size: 'large', x: 40, y: 10, speed: 0.2, opacity: 0.4 },
    { id: 8, size: 'medium', x: 90, y: 50, speed: 0.4, opacity: 0.6 }
  ];

  const getCloudSize = (size) => {
    switch (size) {
      case 'small': return 'w-16 h-10 md:w-20 md:h-12';
      case 'medium': return 'w-24 h-14 md:w-32 md:h-18';
      case 'large': return 'w-32 h-18 md:w-40 md:h-22';
      default: return 'w-24 h-14';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {clouds?.map((cloud) => (
        <div
          key={cloud?.id}
          className={`absolute ${getCloudSize(cloud?.size)} transition-transform duration-100 ease-out`}
          style={{
            left: `${cloud?.x}%`,
            top: `${cloud?.y}%`,
            transform: `translateY(${scrollY * cloud?.speed}px)`,
            opacity: cloud?.opacity
          }}
        >
          {/* Cloud Shape */}
          <div className="relative w-full h-full">
            {/* Main cloud body */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 192, 203, 0.7) 100%)',
                filter: 'blur(1px)'
              }}
            ></div>
            
            {/* Cloud bumps for realistic shape */}
            <div 
              className="absolute -top-2 left-1/4 w-3/5 h-4/5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 192, 203, 0.6) 100%)',
                filter: 'blur(0.5px)'
              }}
            ></div>
            
            <div 
              className="absolute -top-1 right-1/4 w-2/5 h-3/5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 192, 203, 0.5) 100%)',
                filter: 'blur(0.5px)'
              }}
            ></div>
            
            <div 
              className="absolute top-1 left-1/6 w-2/5 h-3/5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 192, 203, 0.4) 100%)',
                filter: 'blur(0.5px)'
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CloudBackground;