import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import CountdownTimer from './components/CountdownTimer';
// Removed butterfly animations for a cleaner neon theme
// import BeatingHearts from './components/BeatingHearts';
import MemoriesButton from './components/MemoriesButton';

const BirthdayCountdownLandingPage = () => {
  const [targetDate, setTargetDate] = useState('');
  const [isBirthday, setIsBirthday] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Calculate next August 27th
    const now = new Date();
    const currentYear = now?.getFullYear();
    let birthdayThisYear = new Date(currentYear, 7, 27); // August is month 7 (0-indexed)
    
    // If birthday has passed this year, set target to next year
    if (now > birthdayThisYear) {
      birthdayThisYear = new Date(currentYear + 1, 7, 27);
    }
    
    setTargetDate(birthdayThisYear?.toISOString());
    
    // Check if today is the birthday
    const today = new Date();
    const isToday = today?.getMonth() === 7 && today?.getDate() === 27;
    setIsBirthday(isToday);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBirthdayReached = () => {
    setIsBirthday(true);
  };

  return (
    <>
      <Helmet>
        <title>Viana's Birthday Countdown - Magical Celebration</title>
        <meta name="description" content="Join the magical countdown to Viana's birthday celebration on August 27th. Experience the wonder with animated butterflies, sparkling effects, and family memories." />
        <meta name="keywords" content="birthday, countdown, celebration, family, memories, Viana" />
      </Helmet>

      {/* Let global dark neon background show through */}
      <div className="relative min-h-[200vh]">
        {/* Animated Butterflies Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <img
            src="https://cdn.builder.io/o/assets%2F5d168eace88f439db401e797ccc44aae%2F5798c6efed314a98bacf5fd3f837f4b0?alt=media&token=90f16287-6a33-4442-9fc1-1458feb1c858&apiKey=5d168eace88f439db401e797ccc44aae"
            alt="Animated butterflies"
            className="w-full h-full object-cover opacity-30 animate-gentle-float"
          />
        </div>
        <div className="relative z-10">
          {/* Section 1: Top - Countdown Timer (replaces COUNTDOWN text) */}
          <div className="min-h-screen flex flex-col items-center justify-start pt-16 md:pt-24 px-4">
            <div className="text-center">
              <CountdownTimer 
                targetDate={targetDate} 
                onBirthdayReached={handleBirthdayReached}
              />
            </div>
          </div>

          {/* Section 2: Middle - Viana's Birthday & Let's Party */}
          <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
            <div className="text-center space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold heading-gradient drop-shadow-[0_0_20px_rgba(255,42,173,0.35)] mb-6">
                VIANA'S BIRTHDAY!
              </h1>
              <p className="text-2xl md:text-4xl lg:text-5xl font-bold text-gradient drop-shadow-[0_0_12px_rgba(34,211,238,0.25)]">
                LET'S PARTY!
              </p>
            </div>
          </div>

          {/* Section 3: Bottom - Memories Section */}
          <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold heading-gradient mb-8">
                MEMORIES
              </h2>
              <p className="text-lg md:text-xl text-[color:var(--color-text-secondary)] mb-16">
                Click below to explore our beautiful family moments
              </p>
            </div>
          </div>
        </div>

        {/* Memories Button - Positioned in bottom section */}
        <MemoriesButton />
      </div>
    </>
  );
};

export default BirthdayCountdownLandingPage;
