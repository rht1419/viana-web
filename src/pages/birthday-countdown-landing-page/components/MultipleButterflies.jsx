import React, { useEffect, useState } from 'react';

const MultipleButterflies = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Configuration for 6 butterflies with unique animation patterns
  const butterflyConfigs = [
    {
      id: 1,
      baseX: 10,
      baseY: 15,
      animationSpeed: 4,
      rotationSpeed: 360,
      scale: 0.8,
      delay: 0,
      horizontalRange: 100,
      verticalRange: 0.3,
    },
    {
      id: 2,
      baseX: 85,
      baseY: 25,
      animationSpeed: 6,
      rotationSpeed: 480,
      scale: 1.0,
      delay: 0.5,
      horizontalRange: 80,
      verticalRange: 0.4,
    },
    {
      id: 3,
      baseX: 20,
      baseY: 60,
      animationSpeed: 5,
      rotationSpeed: 300,
      scale: 0.9,
      delay: 1.0,
      horizontalRange: 120,
      verticalRange: 0.2,
    },
    {
      id: 4,
      baseX: 75,
      baseY: 70,
      animationSpeed: 3.5,
      rotationSpeed: 420,
      scale: 0.7,
      delay: 1.5,
      horizontalRange: 90,
      verticalRange: 0.35,
    },
    {
      id: 5,
      baseX: 50,
      baseY: 40,
      animationSpeed: 7,
      rotationSpeed: 540,
      scale: 1.1,
      delay: 2.0,
      horizontalRange: 110,
      verticalRange: 0.25,
    },
    {
      id: 6,
      baseX: 30,
      baseY: 80,
      animationSpeed: 4.5,
      rotationSpeed: 390,
      scale: 0.85,
      delay: 2.5,
      horizontalRange: 95,
      verticalRange: 0.3,
    }
  ];

  const SingleButterfly = ({ config }) => {
    const [position, setPosition] = useState({ x: 0, y: 0, rotation: 0 });
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const updatePosition = () => {
        const maxScroll = Math.max(document.documentElement?.scrollHeight - window.innerHeight, 1);
        const scrollProgress = Math.min(scrollY / maxScroll, 1);
        const time = Date.now() * 0.001 + config?.delay;
        
        setPosition({
          x: Math.sin(scrollProgress * Math.PI * config?.animationSpeed + time) * config?.horizontalRange + 
             Math.cos(time * 0.5) * 30,
          y: scrollProgress * window.innerHeight * config?.verticalRange + 
             Math.sin(time * 0.8) * 20,
          rotation: scrollProgress * config?.rotationSpeed + Math.sin(time * 0.6) * 45
        });

        setIsVisible(scrollY > 30 && scrollProgress < 0.98);
      };

      updatePosition();
      const interval = setInterval(updatePosition, 50);
      return () => clearInterval(interval);
    }, [scrollY, config]);

    if (!isVisible) return null;

    return (
      <div 
        className="fixed z-15 pointer-events-none transition-all duration-100 ease-out"
        style={{
          left: `${config?.baseX}%`,
          top: `${config?.baseY}%`,
          transform: `translate(${position?.x}px, ${position?.y}px) rotate(${position?.rotation}deg) scale(${config?.scale})`,
        }}
      >
        <img 
          src="/assets/images/2-removebg-preview-1756208642142.png"
          alt={`Flying Butterfly ${config?.id}`}
          className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 opacity-75"
          style={{
            filter: `drop-shadow(0 0 8px rgba(255, 105, 180, 0.6)) drop-shadow(0 0 4px rgba(221, 160, 221, 0.4)) hue-rotate(${config?.id * 30}deg)`,
            animation: `flutter-${config?.id} ${0.6 + config?.id * 0.1}s ease-in-out infinite alternate`
          }}
        />
      </div>
    );
  };

  return (
    <>
      {butterflyConfigs?.map((config) => (
        <SingleButterfly key={config?.id} config={config} />
      ))}
      
      <style jsx>{`
        @keyframes flutter-1 {
          0% { transform: scaleX(1) scaleY(1); }
          100% { transform: scaleX(1.05) scaleY(0.98); }
        }
        @keyframes flutter-2 {
          0% { transform: scaleX(1) scaleY(1); }
          100% { transform: scaleX(1.08) scaleY(0.96); }
        }
        @keyframes flutter-3 {
          0% { transform: scaleX(1) scaleY(1); }
          100% { transform: scaleX(1.06) scaleY(0.97); }
        }
        @keyframes flutter-4 {
          0% { transform: scaleX(1) scaleY(1); }
          100% { transform: scaleX(1.07) scaleY(0.95); }
        }
        @keyframes flutter-5 {
          0% { transform: scaleX(1) scaleY(1); }
          100% { transform: scaleX(1.09) scaleY(0.94); }
        }
        @keyframes flutter-6 {
          0% { transform: scaleX(1) scaleY(1); }
          100% { transform: scaleX(1.04) scaleY(0.99); }
        }
      `}</style>
    </>
  );
};

export default MultipleButterflies;