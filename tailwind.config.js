/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        'display': ['"Space Grotesk"', 'sans-serif'], // Added display font for headlines
      },
      // Responsive breakpoints (mobile-first approach)
      screens: {
        'xs': '320px',    // Extra small devices
        'sm': '640px',    // Small devices (tablets)
        'md': '768px',    // Medium devices (small laptops)
        'lg': '1024px',   // Large devices (desktops)
        'xl': '1280px',   // Extra large devices
        '2xl': '1536px',  // 2X large devices
      },
      // Fluid typography using clamp()
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 2vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 2.5vw, 1rem)',
        'fluid-base': 'clamp(1rem, 3vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 3.5vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 4vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 5vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 6vw, 2.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 7vw, 3rem)',
        'fluid-5xl': 'clamp(3rem, 8vw, 4rem)',
      },
      // Dark theme color palette with neon accents
      colors: {
        // Dark background shades
        'dark': {
          50: '#0A0A0A',    // Deepest black
          100: '#0D1117',   // GitHub-style dark
          200: '#161B22',   // Slightly lighter
          300: '#21262D',   // Card backgrounds
          400: '#30363D',   // Borders
          500: '#484F58',   // Subtle elements
          600: '#656D76',   // Muted text
          700: '#8B949E',   // Secondary text
          800: '#B1BAC4',   // Light text
          900: '#F0F6FC',   // Brightest text
        },
        // Neon cyan accent (primary)
        'neon': {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',   // Main neon cyan
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
        // Electric blue accent (secondary)
        'electric': {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',   // Main electric blue
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Purple accent (tertiary)
        'purple': {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',   // Main purple
          500: '#A855F7',
          600: '#9333EA',
          700: '#7C3AED',
          800: '#6B21A8',
          900: '#581C87',
        },
        // Legacy colors (keeping for compatibility)
        primary: {
          50: '#F0F5FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B5F8',
          400: '#8A9DF1',
          500: '#6B82E8',
          600: '#4F68DE',
          700: '#3C52C7',
          800: '#2A3B9F',
          900: '#1B2C77',
        },
        secondary: {
          50: '#F3F4F6',
          100: '#E5E7EB',
          200: '#D1D5DB',
          300: '#A1A3AF',
          400: '#6B7280',
          500: '#4B5563',
          600: '#374151',
          700: '#2C2F48',
          800: '#1E293B',
          900: '#111827',
        },
        accent: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800',
          600: '#fb8c00',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
        }
      },
      // Minimum touch target sizes
      minWidth: {
        'touch': '44px',
        'button': '120px',
      },
      minHeight: {
        'touch': '44px',
        'button': '44px',
      },
      // Additional spacing for better mobile UX
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      maxWidth: {
        '8xl': '88rem',
        'prose': '75ch',
        '10xl':'110rem',
      },
      // Animation and transitions
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-neon': 'pulseNeon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-3px)' },
          '60%': { transform: 'translateY(-2px)' },
        },
        pulseNeon: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #22D3EE, 0 0 10px #22D3EE, 0 0 15px #22D3EE' },
          '100%': { boxShadow: '0 0 10px #22D3EE, 0 0 20px #22D3EE, 0 0 30px #22D3EE' },
        }
      }
    },
  },
  plugins: [],
};