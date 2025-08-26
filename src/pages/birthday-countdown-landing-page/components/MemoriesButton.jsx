import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'components/ui/Button';

const MemoriesButton = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement?.scrollHeight;
      
      // Show button when scrolled to the bottom section (last third of the page)
      const showThreshold = documentHeight - windowHeight * 1.5;
      setIsVisible(scrollY > showThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMemoriesClick = () => {
    navigate('/family-memories-scrapbook-page');
  };

  return (
    <div 
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <Button
        variant="default"
        size="lg"
        onClick={handleMemoriesClick}
        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-heading font-bold px-8 py-4 rounded-full shadow-floating transform hover:scale-105 transition-all duration-300 animate-gentle-float"
        style={{
          background: 'linear-gradient(135deg, #FF69B4 0%, #DDA0DD 100%)',
          boxShadow: '0 8px 24px rgba(255, 105, 180, 0.4), 0 4px 8px rgba(221, 160, 221, 0.3)'
        }}
      >
        <span className="text-lg md:text-xl">✨ MEMORIES ✨</span>
      </Button>
    </div>
  );
};

export default MemoriesButton;