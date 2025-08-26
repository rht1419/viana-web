import React from 'react';

const MultipleButterflies = () => {
  const butterflies = [
    { id: 1, size: 'scale-50', color: 'from-cyan-400 to-blue-400', delay: '0s', position: 'top-20 left-10' },
    { id: 2, size: 'scale-40', color: 'from-pink-300 to-rose-300', delay: '2s', position: 'top-40 right-16' },
    { id: 3, size: 'scale-45', color: 'from-purple-300 to-pink-300', delay: '4s', position: 'bottom-32 left-20' },
    { id: 4, size: 'scale-35', color: 'from-indigo-300 to-purple-300', delay: '1s', position: 'bottom-20 right-32' },
    { id: 5, size: 'scale-55', color: 'from-rose-300 to-pink-300', delay: '3s', position: 'top-1/2 left-5' },
    { id: 6, size: 'scale-30', color: 'from-blue-300 to-cyan-300', delay: '5s', position: 'top-1/3 right-8' }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      {butterflies?.map((butterfly) => (
        <div
          key={butterfly?.id}
          className={`absolute ${butterfly?.position} animate-float-butterfly-gentle`}
          style={{ animationDelay: butterfly?.delay }}
        >
          <div className={`relative ${butterfly?.size}`}>
            {/* Butterfly body */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-gray-800 to-gray-600 rounded-full"></div>
            
            {/* Butterfly wings */}
            <div className="relative">
              {/* Upper wings */}
              <div className={`absolute top-0 left-0 w-6 h-9 bg-gradient-to-br ${butterfly?.color} rounded-full opacity-70 animate-wing-flutter-gentle`}></div>
              <div className={`absolute top-0 right-0 w-6 h-9 bg-gradient-to-bl ${butterfly?.color} rounded-full opacity-70 animate-wing-flutter-gentle`} style={{ animationDelay: '0.1s' }}></div>
              
              {/* Lower wings */}
              <div className={`absolute top-6 left-1 w-4 h-6 bg-gradient-to-br ${butterfly?.color} rounded-full opacity-60 animate-wing-flutter-gentle`} style={{ animationDelay: '0.05s' }}></div>
              <div className={`absolute top-6 right-1 w-4 h-6 bg-gradient-to-bl ${butterfly?.color} rounded-full opacity-60 animate-wing-flutter-gentle`} style={{ animationDelay: '0.15s' }}></div>
              
              {/* Wing patterns */}
              <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-white rounded-full opacity-80"></div>
              <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-white rounded-full opacity-80"></div>
              <div className="absolute top-3 left-1 w-0.5 h-0.5 bg-yellow-300 rounded-full opacity-90"></div>
              <div className="absolute top-3 right-1 w-0.5 h-0.5 bg-yellow-300 rounded-full opacity-90"></div>
            </div>
            
            {/* Butterfly antennae */}
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="absolute -left-0.5 w-0.5 h-2 bg-gray-800 rounded-full transform rotate-12"></div>
                <div className="absolute -right-0.5 w-0.5 h-2 bg-gray-800 rounded-full transform -rotate-12"></div>
                <div className="absolute -left-0.5 -top-0.5 w-0.5 h-0.5 bg-gray-600 rounded-full"></div>
                <div className="absolute -right-0.5 -top-0.5 w-0.5 h-0.5 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Micro butterflies */}
      {Array.from({ length: 8 })?.map((_, index) => (
        <div
          key={`micro-${index}`}
          className="absolute animate-float-butterfly-micro opacity-50"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
          }}
        >
          <div className="relative scale-20">
            <div className="w-2 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full opacity-60"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MultipleButterflies;