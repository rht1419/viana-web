import React, { useMemo } from 'react';

const isBirthdayToday = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('celebrate') === '1') return true; // demo override
  const today = new Date();
  return today.getMonth() === 7 && today.getDate() === 27; // Aug 27
};

const ConfettiBackground = () => {
  const show = useMemo(() => isBirthdayToday(), []);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {Array.from({ length: 100 })?.map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            background: `hsl(${Math.floor(Math.random() * 360)}, 90%, 60%)`,
            animationDuration: `${4 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 2}s`,
            transform: `translateY(-100vh) rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiBackground;


