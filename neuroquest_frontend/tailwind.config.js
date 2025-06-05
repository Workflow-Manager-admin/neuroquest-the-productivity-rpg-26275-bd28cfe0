module.exports = {
  darkMode: 'class', // Enables manual dark mode toggling for maximum flexibility and RPG UX
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // All source files
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'Inter', 'Roboto', 'sans-serif'],
        body: ['Inter', 'Roboto', 'sans-serif'],
      },
      colors: {
        'midnight': '#0f172a',
        'violetneon': '#7c3aed',
        'neon-cyan': '#00ffff',
        'neon-pink': '#fb37ff',
        'rpg-gold': '#ffd700',
        'rpg-dark': '#1A1A1A',
      },
      boxShadow: {
        'neon-violet': '0 0 6px #a78bfa, 0 0 18px #7c3aed, 0 0 38px #a78bfa',
        'neon-cyan': '0 0 8px #00ffff, 0 0 20px #06b6d4',
      },
      backgroundImage: {
        'rpg-gradient': 'linear-gradient(135deg, #0f172a 65%, #7c3aed 100%)'
      }
    },
  },
  plugins: [],
}
