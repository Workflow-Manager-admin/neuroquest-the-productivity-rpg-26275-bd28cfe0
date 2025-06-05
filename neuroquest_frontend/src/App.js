import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Link } from "react-router-dom";
import "./index.css";

/**
 * Layout shell for routing and main navigation.
 * Includes dark mode toggle, RPG branding, and routes placeholder.
 */
function LayoutShell() {
  // PUBLIC_INTERFACE
  const [darkMode, setDarkMode] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen bg-rpg-gradient dark:bg-midnight text-white font-body`}>
      <nav className="w-full shadow-neon-violet px-6 py-3 flex items-center justify-between bg-opacity-70 backdrop-blur sticky top-0 z-30">
        <Link to="/" className="flex items-center text-2xl font-display gap-2 drop-shadow-[0_2px_14px_#7c3aedcc]">
          <span className="text-neon-cyan">*</span> NeuroQuest
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode((v) => !v)}
            className="transition rounded-full px-4 py-1 bg-violetneon text-white font-display shadow-neon-violet hover:bg-neon-pink focus:outline-none"
            aria-label="Toggle dark mode"
            data-testid="darkmode-toggle"
          >
            {darkMode ? "🌑" : "🌕"}
          </button>
        </div>
      </nav>
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 py-16">
        <Outlet />
      </main>
    </div>
  );
}

/**
 * Minimal App router setup.
 */
function App() {
  // PUBLIC_INTERFACE
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutShell />}>
          {/* Add all route-specific <Route ... /> elements here */}
          {/* Example: <Route path="dashboard" element={<DashboardPage />} /> */}
          <Route
            index
            element={
              <div className="flex flex-col items-center gap-6 py-24 text-center">
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-rpg-gold drop-shadow neon mb-2">
                  Welcome to NeuroQuest RPG
                </h1>
                <div className="text-violetneon text-xl mb-1 font-medium">Gamify Your Productivity Journey</div>
                <div className="text-white/80 max-w-lg text-lg mb-3">
                  Set epic goals, embark on quests, and conquer deadlines – all powered by AI.
                </div>
                <Link
                  to="/login"
                  className="inline-block px-8 py-3 bg-neon-cyan text-black font-bold rounded-full shadow-neon-cyan hover:bg-neon-pink hover:text-white transition"
                >
                  Get Started
                </Link>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
