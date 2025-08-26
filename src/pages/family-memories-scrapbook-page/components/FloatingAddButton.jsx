import React from 'react';
import Button from 'components/ui/Button';

const FloatingAddButton = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        variant="default"
        size="lg"
        onClick={onClick}
        iconName="Plus"
        iconSize={24}
        className="w-16 h-16 rounded-full shadow-floating hover:shadow-magical border-0 animate-gentle-float text-[color:var(--color-background)]"
        style={{ background: 'linear-gradient(135deg, #ff2aad, #d946ef, #22d3ee)' }}
      >
        <span className="sr-only">Add new memory</span>
      </Button>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
      
      {/* Magical sparkles */}
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-accent rounded-full animate-gentle-float opacity-60"></div>
      <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-secondary rounded-full animate-gentle-float opacity-50" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 -left-2 w-1 h-1 bg-primary rounded-full animate-gentle-float opacity-70" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default FloatingAddButton;