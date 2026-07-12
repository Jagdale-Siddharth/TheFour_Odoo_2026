/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14181C',
        asphalt: '#1B2127',
        steel: '#262E37',
        steeledge: '#323C47',
        fog: '#8B96A3',
        cargo: '#EDEFF2',
        amber: {
          DEFAULT: '#F5A623',
          soft: '#FCD9A0',
        },
        teal: {
          DEFAULT: '#2DD4BF',
          soft: '#99F0E5',
        },
        alert: '#EF4444',
      },
      fontFamily: {
        display: ['"Oswald"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(245,166,35,0.15), 0 0 24px rgba(245,166,35,0.08)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.55 },
        },
      },
      animation: {
        flicker: 'flicker 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
