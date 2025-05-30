import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
/**
 * Site Navbar: RPG look, gradient, neon effects, logout/profile.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/quest-log", label: "Quests" },
    { to: "/boss", label: "Boss" },
    { to: "/focus", label: "Focus" },
    { to: "/inventory", label: "Inventory" },
    { to: "/calendar-sync", label: "Calendar" },
    { to: "/settings", label: "Settings" },
  ];

  // If not logged in, keep Navbar minimal
  if (!user) {
    return (
      <nav className="navbar glass-bg shadow-glass flex items-center justify-between px-4 py-2 fixed w-full top-0 left-0 z-20">
        <div className="flex items-center gap-3 neon-glow select-none">
          <span className="text-xl font-black">🧠</span> NeuroQuest
        </div>
        <div>
          <Link
            to="/login"
            className="neon-btn text-base ml-2"
            style={{ padding: "7px 20px" }}
          >
            Login
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar glass-bg shadow-glass flex items-center justify-between px-4 py-2 fixed w-full top-0 left-0 z-30 backdrop-blur">
      <div className="flex items-center gap-3 neon-glow select-none">
        <span className="text-xl font-black">🧠</span> NeuroQuest
      </div>
      <div className="hidden sm:flex items-center gap-2">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`neon-btn text-base ${location.pathname === link.to ? "bg-kaviaAccent text-white" : ""}`}
            style={{ padding: "7px 18px", background: location.pathname === link.to ? "#9d63fe" : "#7c3aed" }}
          >
            {link.label}
          </Link>
        ))}
        <button onClick={logout} className="bg-kaviaDanger neon-btn ml-3" style={{padding: "7px 18px"}}>
          Logout
        </button>
      </div>
      {/* Mobile: Show only hamburger menu in future expansion - simple for MVP */}
      <div className="sm:hidden flex items-center gap-2">
        <Link to="/dashboard" className="neon-btn text-base" style={{padding: "7px 16px"}}>🏠</Link>
        <button onClick={logout} className="bg-kaviaDanger neon-btn" style={{padding: "7px 12px"}} title="Logout">
          🚪
        </button>
      </div>
    </nav>
  );
}
