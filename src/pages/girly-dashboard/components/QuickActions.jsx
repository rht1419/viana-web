import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = ({ user, onSignInClick, eventId }) => {
  const actionItems = [
    {
      id: 'add-memory',
      title: 'Add Memory',
      description: 'Share a special moment',
      icon: '📷',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      action: user ? 'link' : 'signin',
      link: '/family-memories-scrapbook-page'
    },
    {
      id: 'view-gallery',
      title: 'Memory Gallery',
      description: 'Browse all memories',
      icon: '🖼️',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      action: 'link',
      link: '/family-memories-scrapbook-page'
    },
    {
      id: 'birthday-page',
      title: 'Birthday Page',
      description: 'Visit celebration page',
      icon: '🎂',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'from-blue-50 to-purple-50',
      action: 'link',
      link: '/birthday-countdown-landing-page'
    },
    {
      id: 'settings',
      title: user ? 'Profile' : 'Join Family',
      description: user ? 'Manage your account' : 'Sign in to participate',
      icon: user ? '⚙️' : '✨',
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'from-teal-50 to-cyan-50',
      action: user ? 'profile' : 'signin',
      link: user ? '#' : null
    }
  ];

  const handleActionClick = (action, link) => {
    switch (action) {
      case 'link':
        // Will be handled by Link component
        break;
      case 'signin':
        onSignInClick();
        break;
      case 'profile':
        // Could open profile modal or navigate to profile page
        console.log('Open profile settings');
        break;
      default:
        break;
    }
  };

  return (
    <section className="mb-12">
      <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Quick Actions 🚀
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actionItems?.map((item, index) => {
          const ActionComponent = item?.action === 'link' ? Link : 'button';
          const actionProps = item?.action === 'link' 
            ? { to: item?.link }
            : { onClick: () => handleActionClick(item?.action, item?.link) };

          return (
            <ActionComponent
              key={item?.id}
              {...actionProps}
              className={`group relative p-6 bg-gradient-to-br ${item?.bgColor} backdrop-blur-sm rounded-2xl border border-white/40 hover:scale-105 hover:shadow-xl transition-all duration-300 text-left overflow-hidden cursor-pointer`}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-2 right-2 text-6xl opacity-30">{item?.icon}</div>
              </div>
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{item?.icon}</span>
                  <div className={`w-2 h-2 bg-gradient-to-r ${item?.color} rounded-full animate-pulse`}></div>
                </div>
                
                <h4 className={`text-lg font-bold bg-gradient-to-r ${item?.color} bg-clip-text text-transparent mb-1`}>
                  {item?.title}
                </h4>
                
                <p className="text-gray-600 text-sm">
                  {item?.description}
                </p>
              </div>
              {/* Hover effect overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                <div className={`w-full h-full bg-gradient-to-br ${item?.color}`}></div>
              </div>
              {/* Action indicator */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`w-6 h-6 bg-gradient-to-r ${item?.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-xs">→</span>
                </div>
              </div>
              {/* Sparkle effect */}
              <div 
                className="absolute top-1 right-1 w-1 h-1 bg-yellow-400 rounded-full animate-twinkle opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ animationDelay: `${index * 0.3}s` }}
              ></div>
            </ActionComponent>
          );
        })}
      </div>
      {/* User status info */}
      <div className="mt-6 text-center">
        {user ? (
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
            <span className="text-green-600">✅</span>
            <span className="text-green-700 text-sm font-medium">
              Welcome back, {user?.email?.split('@')?.[0]}!
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
            <span className="text-blue-600">ℹ️</span>
            <span className="text-blue-700 text-sm">
              Sign in to unlock all features and create memories
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuickActions;