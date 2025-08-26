/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Core System Colors */
        background: 'var(--color-background)', // alice-blue
        foreground: 'var(--color-foreground)', // dark-charcoal
        border: 'var(--color-border)', // white-30
        input: 'var(--color-input)', // white
        ring: 'var(--color-ring)', // hot-pink
        card: {
          DEFAULT: 'var(--color-card)', // white
          foreground: 'var(--color-card-foreground)' // dark-charcoal
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)' // dark-charcoal
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // alice-blue
          foreground: 'var(--color-muted-foreground)' // medium-gray
        },

        /* Brand Colors */
        primary: {
          DEFAULT: 'var(--color-primary)', // hot-pink
          foreground: 'var(--color-primary-foreground)' // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // sky-blue
          foreground: 'var(--color-secondary-foreground)' // dark-charcoal
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // plum
          foreground: 'var(--color-accent-foreground)' // dark-charcoal
        },

        /* Status Colors */
        success: {
          DEFAULT: 'var(--color-success)', // pale-green
          foreground: 'var(--color-success-foreground)' // dark-charcoal
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // peach
          foreground: 'var(--color-warning-foreground)' // dark-charcoal
        },
        error: {
          DEFAULT: 'var(--color-error)', // light-coral
          foreground: 'var(--color-error-foreground)' // dark-charcoal
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // light-coral
          foreground: 'var(--color-destructive-foreground)' // white
        },

        /* Typography Colors */
        'text-primary': 'var(--color-text-primary)', // dark-charcoal
        'text-secondary': 'var(--color-text-secondary)', // medium-gray

        /* Surface Colors */
        surface: 'var(--color-surface)' // white
      },
      fontFamily: {
        'heading': ['Quicksand', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'caption': ['Poppins', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)'
      },
      borderRadius: {
        'magical': '12px'
      },
      boxShadow: {
        'magical': '0 4px 8px rgba(255, 105, 180, 0.15), 0 2px 4px rgba(135, 206, 235, 0.1)',
        'floating': '0 8px 24px rgba(255, 105, 180, 0.15), 0 4px 8px rgba(135, 206, 235, 0.1)'
      },
      animation: {
        'gentle-float': 'gentleFloat 3s ease-in-out infinite',
        'parallax-slow': 'parallax 20s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      },
      keyframes: {
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        parallax: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      transitionTimingFunction: {
        'magical': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      backdropBlur: {
        'magical': '8px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ],
}