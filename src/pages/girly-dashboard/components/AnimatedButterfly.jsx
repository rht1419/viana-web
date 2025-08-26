import React from 'react';

const AnimatedButterfly = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      {/* Main Featured Butterfly */}
      <div className="absolute top-32 left-1/4 animate-float-butterfly">
        <div className="relative">
          {/* Butterfly body */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-purple-800 to-purple-600 rounded-full"></div>
          
          {/* Butterfly wings */}
          <div className="relative">
            {/* Upper wings */}
            <div className="absolute top-0 left-0 w-8 h-12 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full opacity-80 animate-wing-flutter"></div>
            <div className="absolute top-0 right-0 w-8 h-12 bg-gradient-to-bl from-pink-400 via-purple-400 to-blue-400 rounded-full opacity-80 animate-wing-flutter" style={{ animationDelay: '0.1s' }}></div>
            
            {/* Lower wings */}
            <div className="absolute top-8 left-1 w-6 h-8 bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 rounded-full opacity-70 animate-wing-flutter" style={{ animationDelay: '0.05s' }}></div>
            <div className="absolute top-8 right-1 w-6 h-8 bg-gradient-to-bl from-purple-300 via-pink-300 to-blue-300 rounded-full opacity-70 animate-wing-flutter" style={{ animationDelay: '0.15s' }}></div>
            
            {/* Wing patterns */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full opacity-60"></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-60"></div>
            <div className="absolute top-4 left-1 w-1 h-1 bg-yellow-300 rounded-full opacity-80"></div>
            <div className="absolute top-4 right-1 w-1 h-1 bg-yellow-300 rounded-full opacity-80"></div>
          </div>
          
          {/* Butterfly antennae */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="absolute -left-1 w-0.5 h-3 bg-purple-800 rounded-full transform rotate-12"></div>
              <div className="absolute -right-1 w-0.5 h-3 bg-purple-800 rounded-full transform -rotate-12"></div>
              <div className="absolute -left-1 -top-0.5 w-1 h-1 bg-purple-600 rounded-full"></div>
              <div className="absolute -right-1 -top-0.5 w-1 h-1 bg-purple-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Butterfly */}
      <div className="absolute top-1/2 right-1/4 animate-float-butterfly-slow">
        <div className="relative transform scale-75">
          {/* Butterfly body */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-pink-800 to-pink-600 rounded-full"></div>
          
          {/* Butterfly wings */}
          <div className="relative">
            {/* Upper wings */}
            <div className="absolute top-0 left-0 w-8 h-12 bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400 rounded-full opacity-80 animate-wing-flutter-slow"></div>
            <div className="absolute top-0 right-0 w-8 h-12 bg-gradient-to-bl from-rose-400 via-pink-400 to-purple-400 rounded-full opacity-80 animate-wing-flutter-slow" style={{ animationDelay: '0.1s' }}></div>
            
            {/* Lower wings */}
            <div className="absolute top-8 left-1 w-6 h-8 bg-gradient-to-br from-pink-300 via-rose-300 to-purple-300 rounded-full opacity-70 animate-wing-flutter-slow" style={{ animationDelay: '0.05s' }}></div>
            <div className="absolute top-8 right-1 w-6 h-8 bg-gradient-to-bl from-pink-300 via-rose-300 to-purple-300 rounded-full opacity-70 animate-wing-flutter-slow" style={{ animationDelay: '0.15s' }}></div>
            
            {/* Wing patterns */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full opacity-60"></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-60"></div>
            <div className="absolute top-5 left-2 w-1 h-1 bg-yellow-300 rounded-full opacity-80"></div>
            <div className="absolute top-5 right-2 w-1 h-1 bg-yellow-300 rounded-full opacity-80"></div>
          </div>
          
          {/* Butterfly antennae */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="absolute -left-1 w-0.5 h-3 bg-pink-800 rounded-full transform rotate-12"></div>
              <div className="absolute -right-1 w-0.5 h-3 bg-pink-800 rounded-full transform -rotate-12"></div>
              <div className="absolute -left-1 -top-0.5 w-1 h-1 bg-pink-600 rounded-full"></div>
              <div className="absolute -right-1 -top-0.5 w-1 h-1 bg-pink-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedButterfly;