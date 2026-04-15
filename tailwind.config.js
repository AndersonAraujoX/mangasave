/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#121212',
          secondary: '#1E1E2E',
          card: '#252535',
          hover: '#2D2D40',
        },
        accent: {
          DEFAULT: '#FF4500',
          hover: '#e03d00',
          muted: '#FF450033',
        },
        purple: {
          neon: '#A855F7',
          muted: '#A855F733',
        },
        text: {
          primary: '#EFEFEF',
          secondary: '#A0A0B0',
          muted: '#6B6B80',
        },
        border: {
          DEFAULT: '#2A2A3E',
          light: '#3A3A50',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
      },
      aspectRatio: {
        '3/4': '3 / 4',
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(255, 69, 0, 0.3)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 48px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
