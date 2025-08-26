import React, { useState, useEffect } from 'react';
import { memoryService } from '../../../services/memoryService';
import { birthdayService } from '../../../services/birthdayService';

const DashboardStats = ({ eventId, totalMemories: propTotalMemories }) => {
  const [stats, setStats] = useState({
    totalMemories: propTotalMemories || 0,
    featuredMemories: 0,
    daysUntilBirthday: null,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [eventId]);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Get all memories for the event
      const memories = await memoryService?.getMemories(eventId, 'family_only');
      const featuredMemories = memories?.filter(m => m?.is_featured) || [];
      const totalLikes = memories?.reduce((sum, memory) => sum + (memory?.likes_count || 0), 0) || 0;

      // Get birthday event details for days calculation
      const activeEvent = await birthdayService?.getActiveBirthdayEvent();
      const daysUntil = activeEvent?.birthday_date 
        ? birthdayService?.calculateDaysUntilBirthday(activeEvent?.birthday_date)
        : null;

      setStats({
        totalMemories: memories?.length || propTotalMemories || 0,
        featuredMemories: featuredMemories?.length,
        daysUntilBirthday: daysUntil,
        totalLikes
      });

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Use fallback values
      setStats(prev => ({
        ...prev,
        totalMemories: propTotalMemories || 0
      }));
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    {
      icon: '📸',
      label: 'Total Memories',
      value: stats?.totalMemories,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50'
    },
    {
      icon: '⭐',
      label: 'Featured',
      value: stats?.featuredMemories,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50'
    },
    {
      icon: '💝',
      label: 'Total Likes',
      value: stats?.totalLikes,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      icon: '🎂',
      label: 'Days Until Birthday',
      value: stats?.daysUntilBirthday !== null ? stats?.daysUntilBirthday : '...',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'from-blue-50 to-purple-50'
    }
  ];

  if (loading) {
    return (
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 })?.map((_, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 animate-pulse"
            >
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Dashboard Overview
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsConfig?.map((stat, index) => (
          <div
            key={stat?.label}
            className={`relative group p-6 bg-gradient-to-br ${stat?.bgColor} backdrop-blur-sm rounded-2xl border border-white/40 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 right-2 text-4xl opacity-50">{stat?.icon}</div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat?.icon}</span>
                <div className={`w-2 h-2 bg-gradient-to-r ${stat?.color} rounded-full animate-pulse`}></div>
              </div>
              
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat?.color} bg-clip-text text-transparent mb-1`}>
                {stat?.value}
              </div>
              
              <div className="text-gray-600 text-sm font-medium">
                {stat?.label}
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
              <div className={`w-full h-full bg-gradient-to-br ${stat?.color}`}></div>
            </div>

            {/* Sparkle effect */}
            <div 
              className="absolute top-1 right-1 w-1 h-1 bg-yellow-400 rounded-full animate-twinkle"
              style={{ animationDelay: `${index * 0.5}s` }}
            ></div>
          </div>
        ))}
      </div>
      {/* Additional Info */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/40 backdrop-blur-sm rounded-full border border-white/30">
          <span className="text-sm text-gray-600">
            {stats?.daysUntilBirthday === 0 
              ? 'Birthday is TODAY!' 
              : stats?.daysUntilBirthday === 1
              ? 'Birthday is TOMORROW!'
              : 'Creating memorable moments together'
            }
          </span>
        </div>
      </div>
    </section>
  );
};

export default DashboardStats;