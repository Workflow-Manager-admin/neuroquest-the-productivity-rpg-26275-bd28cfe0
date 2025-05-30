module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        kaviaDark: "#0f172a",
        kaviaAccent: "#7c3aed",
        kaviaGlow: "#66fcf1",
        kaviaDanger: "#e87a41",
        glass: "rgba(255,255,255,0.10)",
      },
      boxShadow: {
        neon: "0 0 8px #7c3aed, 0 0 16px #7c3aed",
        glass: "0 4px 30px rgba(0,0,0,0.1)",
      },
      backgroundImage: {
        "rpg-gradient":
          "linear-gradient(128deg, #0f172a 60%, #18123e 100%)",
        "xp-bar": "linear-gradient(90deg, #fff3c0 0%, #fcec97 100%)",
        "hp-bar": "linear-gradient(90deg, #ff1872 0%, #ff7096 100%)",
        "neon-orb":
          "radial-gradient(circle at center, #7c3aed 20%, #18123e 90%)",
      },
      blur: {
        xs: "3px",
      },
    },
  },
  plugins: [],
}
