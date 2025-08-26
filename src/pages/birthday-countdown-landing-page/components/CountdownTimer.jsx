import React, { useState, useEffect, useRef } from 'react';

const CountdownTimer = ({ targetDate, onBirthdayReached }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isBirthday: false
  });
  const [birthdayYear, setBirthdayYear] = useState(1);
  const audioRef = useRef(null);
  const refData = useRef({ isDemo: false, demoEnd: 0, initialized: false });

  // Sample photos for collage effect
  const celebrationPhotos = [
    '/assets/images/1st_image-1756209055390.jpg',
    '/assets/images/Blue_and_Pink_Gradient_Modern_Valentine_s_Day_Sale_Instagram_Post-1756206695677.png',
    '/assets/images/2-removebg-preview-1756208642142.png',
    '/assets/images/3-removebg-preview-1756210207328.png'
  ];

  const calculateNextBirthday = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const birthdayMonth = 7; // August (0-indexed)
    const birthdayDay = 27;
    
    let nextBirthday = new Date(currentYear, birthdayMonth, birthdayDay);
    
    // If birthday has passed this year, set to next year
    if (today > nextBirthday) {
      nextBirthday = new Date(currentYear + 1, birthdayMonth, birthdayDay);
    }
    
    // Calculate which birthday this will be
    const birthYear = 2024; // Viana's birth year
    const yearDiff = nextBirthday.getFullYear() - birthYear;
    
    return {
      date: nextBirthday,
      year: yearDiff
    };
  };

  useEffect(() => {
    if (!refData.current.initialized) {
      const params = new URLSearchParams(window.location.search);
      refData.current.isDemo = params.get('demo') === '1';
      if (refData.current.isDemo) {
        refData.current.demoEnd = Date.now() + 5000;
      }
      refData.current.initialized = true;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const target = refData.current.isDemo ? new Date(refData.current.demoEnd) : new Date(targetDate);
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds, isBirthday: false });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isBirthday: true });
        onBirthdayReached && onBirthdayReached();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onBirthdayReached]);

  useEffect(() => {
    if (timeLeft?.isBirthday && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  }, [timeLeft?.isBirthday]);

  useEffect(() => {
    const nextBirthday = calculateNextBirthday();
    setBirthdayYear(nextBirthday.year);
  }, []);

  const getOrdinalSuffix = (num) => {
    if (num >= 11 && num <= 13) return 'th';
    switch (num % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  if (timeLeft?.isBirthday) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'radial-gradient(800px 400px at 20% 0%, rgba(255,42,173,0.18), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(34,211,238,0.18), transparent 60%), linear-gradient(180deg, #0a0214 0%, #110424 50%, #0b0516 100%)' }}>
        <audio ref={audioRef} src="/assets/audio/birthday-song.mp3" preload="auto" />
        
        {/* Photo Collage Layer */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {celebrationPhotos.map((photo, index) => (
            <div
              key={index}
              className="absolute animate-bounce opacity-60"
              style={{
                left: `${20 + (index * 20)}%`,
                top: `${10 + (index * 15)}%`,
                animationDelay: `${index * 0.5}s`,
                animationDuration: '3s'
              }}
            >
              <img
                src={photo}
                alt={`Celebration ${index + 1}`}
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow-lg"
                style={{
                  transform: `rotate(${index * 15}deg)`,
                  filter: 'drop-shadow(0 0 10px rgba(255,42,173,0.5))'
                }}
              />
            </div>
          ))}
        </div>

        {/* Confetti Layer */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 80 })?.map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                background: `hsl(${Math.floor(Math.random() * 360)}, 90%, 60%)`,
                animationDuration: `${3 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 1.5}s`,
                transform: `translateY(-100vh) rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
        
        <div className="max-w-3xl w-full text-center relative z-10">
          <div className="text-7xl md:text-9xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-4xl md:text-6xl font-extrabold heading-gradient mb-4 animate-pulse">
            HAPPY {birthdayYear}{getOrdinalSuffix(birthdayYear)} BIRTHDAY, VIANA!
          </h2>
          <p className="text-lg md:text-2xl text-[color:var(--color-text-secondary)] mb-8">
            The big day is here. Let's celebrate this precious milestone!
          </p>
          <div className="flex justify-center gap-4 mb-10">
            {['🎂', '🎈', '✨', '🎁', '💖']?.map((emoji, index) => (
              <div
                key={index}
                className="text-3xl md:text-4xl animate-bounce"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {emoji}
              </div>
            ))}
          </div>
          <a
            href="/family-memories-scrapbook-page"
            className="inline-flex items-center px-8 py-3 rounded-full text-[color:var(--color-background)] transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ background: 'linear-gradient(90deg, #ff2aad, #d946ef, #22d3ee)' }}
          >
            View Memories
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-6">
        {[
          { label: 'Days', value: timeLeft?.days },
          { label: 'Hours', value: timeLeft?.hours },
          { label: 'Minutes', value: timeLeft?.minutes },
          { label: 'Seconds', value: timeLeft?.seconds }
        ]?.map((item, index) => (
          <div key={item?.label} 
               className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-magical animate-gentle-float"
               style={{ animationDelay: `${index * 0.2}s` }}>
            <div className="text-3xl md:text-5xl font-heading font-bold text-white mb-2"
                 style={{ textShadow: '2px 2px 4px rgba(255, 105, 180, 0.6)' }}>
              {item?.value?.toString()?.padStart(2, '0')}
            </div>
            <div className="text-sm md:text-base font-body text-white/90 uppercase tracking-wider">
              {item?.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;