import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CountdownTimer from './components/CountdownTimer';
// Removed butterfly components for dark neon theme
// Removed DashboardStats as per request
import RecentMemories from './components/RecentMemories';
import QuickActions from './components/QuickActions';
import AuthModal from './components/AuthModal';
import { birthdayService } from '../../services/birthdayService';
import { memoryService } from '../../services/memoryService';

const GirlyDashboard = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [activeEvent, setActiveEvent] = useState(null);
  const [recentMemories, setRecentMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load active birthday event
      const eventData = await birthdayService?.getActiveBirthdayEvent();
      setActiveEvent(eventData);

      // Load recent memories
      const memoriesData = await memoryService?.getMemories(
        eventData?.id, 
        'family_only'
      );
      setRecentMemories(memoriesData?.slice(0, 6) || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextBirthdayDate = () => {
    if (!activeEvent?.birthday_date) {
      // Default to August 27th if no event
      const today = new Date();
      const currentYear = today?.getFullYear();
      let birthdayThisYear = new Date(currentYear, 7, 27); // August is month 7 (0-indexed)
      
      if (today > birthdayThisYear) {
        birthdayThisYear = new Date(currentYear + 1, 7, 27);
      }
      
      return birthdayThisYear?.toISOString();
    }

    return birthdayService?.getNextBirthdayDate(activeEvent?.birthday_date);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center animate-spin border-2 border-white/20">
            <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(90deg, #ff2aad, #d946ef, #22d3ee)' }}></div>
          </div>
          <p className="text-[color:var(--color-text-secondary)]">Loading magical moments...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Butterfly Dashboard - Viana's Magical Birthday Celebration</title>
        <meta name="description" content="Your magical dashboard for tracking birthday countdown, memories, and family moments in our beautiful butterfly-themed celebration space." />
        <meta name="keywords" content="birthday dashboard, family memories, countdown, butterfly theme, celebration tracking" />
      </Helmet>
      <div className="min-h-screen relative overflow-hidden">
        {/* Magical Background Elements */}
        <div className="absolute inset-0 pointer-events-none"></div>

        {/* Header Navigation */}
        <header className="relative z-10 bg-white/5 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3"></div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-[color:var(--color-text-secondary)]">Rohit Chithappa</span>
                <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-gradient font-medium">
                  R
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            
            {/* Countdown Section */}
            <section className="text-center mb-12">
              <div className="mb-8">
                <h2 className="text-5xl md:text-7xl font-bold heading-gradient mb-4">
                  {activeEvent?.birthday_person_name || 'Viana'}'s Birthday
                </h2>
                <p className="text-xl text-[color:var(--color-text-secondary)] mb-8">
                  {activeEvent?.celebration_theme || 'Birthday'} Celebration
                </p>
              </div>
              
              <CountdownTimer 
                targetDate={getNextBirthdayDate()}
                onBirthdayReached={() => {
                  // Handle birthday reached
                }}
              />
            </section>

            {/* Dashboard Overview removed */}

            {/* Recent Memories Title and Empty State */}
            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Recent Memories</h3>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📸</div>
              <h4 className="text-2xl font-bold text-gray-700 mb-4">No memories yet</h4>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start creating beautiful memories! Share photos, videos, and heartfelt messages to build your family's digital scrapbook.
              </p>
            </div>

            {/* Quick Actions */}
            <QuickActions
              user={user}
              onSignInClick={() => setShowAuthModal(true)}
              eventId={activeEvent?.id}
            />

            {/* Recent Memories */}
            <RecentMemories
              memories={recentMemories}
              loading={loading}
              user={user}
              onSignInClick={() => setShowAuthModal(true)}
            />

            {/* Navigation Links */}
            <section className="mt-16 text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-8">Explore More</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Link
                  to="/family-memories-scrapbook-page"
                  className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📸</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Memory Gallery</h4>
                  <p className="text-gray-600">Browse all precious memories and moments</p>
                </Link>
                
                <Link
                  to="/birthday-countdown-landing-page"
                  className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎂</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Birthday Landing</h4>
                  <p className="text-gray-600">Visit the magical birthday celebration page</p>
                </Link>
              </div>
            </section>
          </div>
        </main>

        {/* Animated Butterflies removed for neon theme */}

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSuccess={() => {
              setShowAuthModal(false);
              loadDashboardData();
            }}
          />
        )}
      </div>
    </>
  );
};

export default GirlyDashboard;
