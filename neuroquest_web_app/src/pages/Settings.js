import React from "react";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
/**
 * Settings page for preferences (dark mode, neon, anims), logout.
 */
export default function Settings() {
  const { user, prefs, setPrefs, logout } = useAuth();

  const toggle = (key) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div className="max-w-lg mx-auto glass-bg px-6 py-8 mt-10 shadow-xl rounded-2xl flex flex-col gap-6 items-center">
      <h1 className="text-2xl font-bold neon-glow mb-3">Settings</h1>
      <div className="flex flex-col gap-3 w-full">
        <label className="flex justify-between items-center cursor-pointer neon-glow">
          <span>
            <span role="img" aria-label="moon">🌙</span> Dark Mode
          </span>
          <input
            type="checkbox"
            checked={prefs.darkMode}
            onChange={() => toggle("darkMode")}
            className="form-checkbox h-5 w-5 accent-kaviaAccent"
          />
        </label>
        <label className="flex justify-between items-center cursor-pointer neon-glow">
          <span>
            <span role="img" aria-label="sparkle">✨</span> Neon Glow Effects
          </span>
          <input
            type="checkbox"
            checked={prefs.neon}
            onChange={() => toggle("neon")}
            className="form-checkbox h-5 w-5 accent-kaviaAccent"
          />
        </label>
        <label className="flex justify-between items-center cursor-pointer neon-glow">
          <span>
            <span role="img" aria-label="zap">⚡</span> Animated Effects
          </span>
          <input
            type="checkbox"
            checked={prefs.anims}
            onChange={() => toggle("anims")}
            className="form-checkbox h-5 w-5 accent-kaviaAccent"
          />
        </label>
      </div>
      <div className="mt-8 flex flex-col items-center w-full">
        <button
          onClick={logout}
          className="neon-btn bg-kaviaDanger text-white w-full my-2 py-3"
        >
          Logout
        </button>
      </div>
      {user && (
        <div className="mt-2 text-xs w-full text-center text-white/40">
          Signed in as <span className="text-white">{user.email}</span>
        </div>
      )}
    </div>
  );
}
