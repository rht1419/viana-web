import React, { useEffect, useState } from 'react';

const AnimatedButterfly = () => {
  const [position, setPosition] = useState({ x: 0, y: 0, rotation: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement?.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      
      // Enhanced parallax movement for better visual effect
      setPosition({
        x: Math.sin(scrollProgress * Math.PI * 6) * 120 + Math.cos(scrollProgress * Math.PI * 3) * 40, // More complex horizontal movement
        y: scrollProgress * window.innerHeight * 2, // Vertical movement with scroll
        rotation: scrollProgress * 720 + Math.sin(scrollProgress * Math.PI * 8) * 45 // More dynamic rotation
      });

      // Show butterfly throughout most of the scroll experience
      setIsVisible(scrollY > 50 && scrollProgress < 0.95);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed z-20 pointer-events-none transition-all duration-150 ease-out"
      style={{
        left: `calc(50% + ${position?.x}px)`,
        top: `calc(20% + ${position?.y * 0.4}px)`,
        transform: `translate(-50%, -50%) rotate(${position?.rotation}deg)`,
      }}
    >
      {/* Enhanced butterfly with better effects */}
      <img 
        src="/assets/images/2-removebg-preview-1756208642142.png"
        alt="Magical Butterfly"
        className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 opacity-85"
        style={{
          filter: 'drop-shadow(0 0 12px rgba(255, 105, 180, 0.8)) drop-shadow(0 0 6px rgba(221, 160, 221, 0.6))',
          transform: `scale(${1 + Math.sin(position?.y * 0.008) * 0.3})`, // Enhanced breathing effect
          animation: 'flutter 0.8s ease-in-out infinite alternate'
        }}
      />
      
      {/* CSS keyframe animation for flutter effect */}
      <style jsx>{`
        @keyframes flutter {
          0% { transform: scaleX(1) scaleY(1); }
          100% { transform: scaleX(1.1) scaleY(0.95); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedButterfly;