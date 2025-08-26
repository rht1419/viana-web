import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      path: '/birthday-countdown-landing-page',
      label: 'Birthday Countdown',
      icon: 'Calendar'
    },
    {
      path: '/family-memories-scrapbook-page',
      label: 'Family Memories',
      icon: 'Heart'
    }
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-magical border-b border-border shadow-magical">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/birthday-countdown-landing-page" 
            className="flex items-center space-x-2 transition-magical hover:scale-105"
          >
            <div className="w-10 h-10 rounded-full gradient-dreamy flex items-center justify-center shadow-magical">
              <Icon name="Cake" size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg text-primary">
                Viana's
              </span>
              <span className="font-heading font-medium text-sm text-text-secondary -mt-1">
                Birthday
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-magical transition-magical
                  ${isActivePath(item?.path) 
                    ? 'bg-primary text-primary-foreground shadow-magical' 
                    : 'text-text-primary hover:bg-muted hover:text-primary'
                  }
                `}
              >
                <Icon 
                  name={item?.icon} 
                  size={18} 
                  color={isActivePath(item?.path) ? 'white' : 'currentColor'} 
                />
                <span className="font-body font-medium text-sm">
                  {item?.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="md:hidden"
            iconName={isMobileMenuOpen ? "X" : "Menu"}
            iconSize={20}
          >
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-magical transition-magical
                    ${isActivePath(item?.path) 
                      ? 'bg-primary text-primary-foreground shadow-magical' 
                      : 'text-text-primary hover:bg-muted hover:text-primary'
                    }
                  `}
                >
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    color={isActivePath(item?.path) ? 'white' : 'currentColor'} 
                  />
                  <span className="font-body font-medium">
                    {item?.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
      {/* Magical sparkle effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-2 left-1/4 w-1 h-1 bg-accent rounded-full animate-gentle-float opacity-60"></div>
        <div className="absolute top-4 right-1/3 w-1.5 h-1.5 bg-primary rounded-full animate-gentle-float opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3 right-1/4 w-1 h-1 bg-secondary rounded-full animate-gentle-float opacity-50" style={{ animationDelay: '2s' }}></div>
      </div>
    </header>
  );
};

export default Header;