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
        // RPG-glow gradients
        glowMagenta: '#e53ef7',
        glowOrchid: '#b939ff',
        glowAzure: '#00fdd8',
        glowGold: '#ffc446',
        rpgForest: '#489763',
        rpgDungeon: '#2e284c',
        rpgHills: '#e2d1a6'
      },
      fontFamily: {
        inter: ['Inter', ...defaultTheme.fontFamily.sans],
        poppins: ['Poppins', 'sans-serif'],
        'cinzel': ['Cinzel Decorative', 'serif'],
        'unifraktur': ['UnifrakturCook', 'serif'],
        heading: ["Poppins", "Inter", "Cinzel Decorative", "UnifrakturCook", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        'neon-accent': '0 0 15px 2px #7c3aed44, 0 0 21px 5px #c084fc66',
        'neon-gold': '0 0 11px 1px #ffc44677, 0 0 7px #ffc44688',
        'neon-rpg': '0 0 46px 2px #8a34f9DD, 0 0 8px #e53ef7A8',
      },
      transitionProperty: {
        'neon-colors': 'background, color, box-shadow, border-color'
      },
      borderRadius: {
        'rpg': '16px',
        'rpg-lg': '30px'
      }
    },
  },
  plugins: [],
};
