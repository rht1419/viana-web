import React, { useEffect, useState } from 'react';

const BeatingHearts = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Configuration for 3 hearts with different beating patterns
  const heartConfigs = [
    {
      id: 1,
      baseX: 15,
      baseY: 20,
      beatSpeed: 1.2,
      floatSpeed: 2,
      scale: 0.6,
      delay: 0,
      horizontalDrift: 40,
      verticalDrift: 0.2,
    },
    {
      id: 2,
      baseX: 80,
      baseY: 50,
      beatSpeed: 0.8,
      floatSpeed: 1.5,
      scale: 0.8,
      delay: 1.0,
      horizontalDrift: 60,
      verticalDrift: 0.3,
    },
    {
      id: 3,
      baseX: 40,
      baseY: 75,
      beatSpeed: 1.5,
      floatSpeed: 2.5,
      scale: 0.7,
      delay: 2.0,
      horizontalDrift: 50,
      verticalDrift: 0.25,
    }
  ];

  const SingleHeart = ({ config }) => {
    const [position, setPosition] = useState({ x: 0, y: 0, beat: 1 });
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const updatePosition = () => {
        const maxScroll = Math.max(document.documentElement?.scrollHeight - window.innerHeight, 1);
        const scrollProgress = Math.min(scrollY / maxScroll, 1);
        const time = Date.now() * 0.001 + config?.delay;
        
        setPosition({
          x: Math.sin(scrollProgress * Math.PI * config?.floatSpeed + time * 0.5) * config?.horizontalDrift + 
             Math.cos(time * 0.3) * 15,
          y: scrollProgress * window.innerHeight * config?.verticalDrift + 
             Math.sin(time * 0.4) * 25,
          beat: 1 + Math.sin(time * config?.beatSpeed * Math.PI * 2) * 0.3 // Beating effect
        });

        setIsVisible(scrollY > 20 && scrollProgress < 0.97);
      };

      updatePosition();
      const interval = setInterval(updatePosition, 60);
      return () => clearInterval(interval);
    }, [scrollY, config]);

    if (!isVisible) return null;

    return (
      <div 
        className="fixed z-16 pointer-events-none transition-all duration-150 ease-out"
        style={{
          left: `${config?.baseX}%`,
          top: `${config?.baseY}%`,
          transform: `translate(${position?.x}px, ${position?.y}px) scale(${config?.scale * position?.beat})`,
        }}
      >
        <img 
          src="/assets/images/3-removebg-preview-1756210207328.png"
          alt={`Beating Heart ${config?.id}`}
          className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 opacity-80"
          style={{
            filter: `drop-shadow(0 0 15px rgba(255, 20, 147, 0.8)) drop-shadow(0 0 8px rgba(255, 105, 180, 0.6))`,
            animation: `heartPulse-${config?.id} ${1.2 / config?.beatSpeed}s ease-in-out infinite`
          }}
        />
      </div>
    );
  };

  return (
    <>
      {heartConfigs?.map((config) => (
        <SingleHeart key={config?.id} config={config} />
      ))}
      
      <style jsx>{`
        @keyframes heartPulse-1 {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes heartPulse-2 {
          0%, 100% { transform: scale(1); }
          30%, 70% { transform: scale(1.15); }
        }
        @keyframes heartPulse-3 {
          0%, 100% { transform: scale(1); }
          25%, 75% { transform: scale(1.08); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </>
  );
};

export default BeatingHearts;