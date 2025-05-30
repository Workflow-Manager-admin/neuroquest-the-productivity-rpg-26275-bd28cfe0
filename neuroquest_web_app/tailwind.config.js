const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        accent: '#7c3aed',
        textPrimary: '#f8fafc',
        textFaded: '#94a3b8',
        primary: '#0f172a',
        secondary: '#f8fafc',
        'brand-orange': '#E87A41',
        'brand-dark': '#1A1A1A',
      },
      fontFamily: {
        inter: ['Inter', ...defaultTheme.fontFamily.sans],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'neon-accent': '0 0 15px 2px #7c3aed44, 0 0 4px 2px #7c3aed',
      },
    },
  },
  plugins: [],
};
