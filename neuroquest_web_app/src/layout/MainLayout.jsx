import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import Avatar from "../components/Avatar";

// NAVIGATION ITEMS for RPG fantasy nav bar
const NAV_LINKS = [
  {
    label: "Kingdom",
    to: "/dashboard",
    icon: <span role="img" aria-label="kingdom" className="text-2xl">🏰</span>,
  },
  {
    label: "Quest Log",
    to: "/questlog",
    icon: <span role="img" aria-label="quests" className="text-2xl">🧾</span>,
  },
  {
    label: "Focus",
    to: "/focus",
    icon: <span role="img" aria-label="focus" className="text-2xl">🔮</span>,
  },
  {
    label: "Boss",
    to: "/bossbattle",
    icon: <span role="img" aria-label="boss" className="text-2xl">🐉</span>,
  },
  {
    label: "Bag",
    to: "/inventory",
    icon: <span role="img" aria-label="inventory" className="text-2xl">🎒</span>,
  },
  {
    label: "Calendar",
    to: "/calendarsync",
    icon: <span role="img" aria-label="calendar" className="text-2xl">📅</span>,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: <span role="img" aria-label="settings" className="text-2xl">⚙️</span>,
  },
];

import { useUser } from "../context/UserContext";
import { useGame } from "../context/GameContext";

// Fantasy hero banner asset handling
const heroBannerUrl =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"; // Example fantasy woods (Unsplash)

export default function MainLayout() {
  const location = useLocation();
  // Use user/profile avatar for personalization
  const { profile } = useUser();
  const avatarIdx = profile && profile.onboarding && profile.onboarding.avatarIdx != null
    ? profile.onboarding.avatarIdx
    : 0;
  const { game } = useGame();
  const level = game?.level || 1;

  return (
    <div className="main-bg min-h-screen flex flex-col">
      <div className="container mx-auto px-4 pb-[84px]"> {/* Padding bottom for mobile nav */}
        {/* Hero banner with RPG/fantasy art, fallback logic */}
        <div className="hero-banner mt-6 w-full h-[180px] flex items-center justify-center rpg-rounded relative overflow-hidden shadow-lg mb-6">
          <img
            src={heroBannerUrl}
            alt="NeuroQuest - The Productivity RPG Hero"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center top", filter: "brightness(0.93) contrast(1.1)" }}
            onError={e => {
              e.target.onerror = null;
              e.target.style.display = "none";
              if (e.target.parentNode) {
                e.target.parentNode.style.background =
                  "radial-gradient(circle at 60% 30%, #321438 60%, #8f61e7 120%)";
                e.target.parentNode.innerHTML +=
                  '<span style="position:absolute;top:48%;left:50%;transform:translate(-50%,-50%);font-size:2rem;color:#c084fc;font-weight:bold;text-shadow:0 0 18px #7c3aed">NeuroQuest RPG</span>';
              }
            }}
          />
        </div>
        {/* App main content: routed pages */}
        <Outlet />
      </div>

      {/* ==== RPG Neon/Fantasy Bottom Navigation ==== */}
      <nav
        className="fixed bottom-0 left-0 w-full z-50 bg-[#120c2de6] shadow-xl border-t-2 border-accent/30 flex flex-row items-center justify-between md:justify-center gap-0 px-1 py-2 md:py-3 neon-accent rpg-rounded-tl-lg rpg-rounded-tr-lg
        transition-all duration-200
        backdrop-blur-md
        "
        style={{
          boxShadow: "0 0 44px 12px #a78bfa55, 0 0 7px #7c3aed88",
          borderTopLeftRadius: 16, borderTopRightRadius: 16,
          minHeight: 68,
        }}
        aria-label="Main navigation"
        role="navigation"
      >
        {/* Avatar area (goes to settings?) */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-rpg-avatar flex flex-col items-center px-2 md:px-3 transition-all duration-150 ${isActive ? "neon-glow" : ""}`}
          aria-label="Go to Kingdom"
        >
          <Avatar size={42} demoIndex={avatarIdx} ringColor="#a78bfa" alt="Hero" />
          <span className="text-xs font-bold text-accent mt-0.5 md:block" style={{ letterSpacing: ".01em" }}>
            LV {level}
          </span>
        </NavLink>
        {/* Main nav items */}
        <div className="flex-1 flex flex-row justify-evenly md:justify-center gap-1 md:gap-3">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link-rpg px-0.5 md:px-3 py-2 flex flex-col items-center group focus:outline-none select-none
                 ${isActive ? "text-accent neon-glow font-bold" : "text-textFaded"} 
                 transition-neon-colors hover:text-accent`
              }
              data-active={location.pathname === link.to ? "true" : undefined}
              aria-current={location.pathname === link.to ? "page" : undefined}
            >
              <span>{link.icon}</span>
              <span className="text-xs font-semibold mt-0.5 hidden md:block">{link.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      {/* Neon/Fantasy nav bar styling */}
      <style>
        {`
        .neon-accent {
          filter: drop-shadow(0 0 16px #b28af9bb) drop-shadow(0 0 26px #7c3aed99);
        }
        .rpg-rounded-tl-lg { border-top-left-radius: 20px; }
        .rpg-rounded-tr-lg { border-top-right-radius: 20px; }
        .nav-link-rpg[data-active="true"] {
          color: #a78bfa !important;
          text-shadow: 0 0 11px #c084fc, 0 0 14px #a78bfa;
          box-shadow: 0 0 24px 1px #a78bfa55;
        }
        .nav-link-rpg:hover, .nav-link-rpg:focus {
          color: #b58fff;
          text-shadow: 0 0 9px #a084fc77;
        }
        .nav-rpg-avatar {
          margin-left: 2.5vw; margin-right: 4vw;
        }
        @media (min-width: 768px) {
          .nav-link-rpg span.text-xs { font-size: 1em; }
        }
        @media (max-width: 640px) {
          nav[role="navigation"] {
            padding-left: 0; padding-right: 0;
          }
          .nav-link-rpg span.text-xs { font-size: .95em; }
          .nav-rpg-avatar { margin-left: 1vw; margin-right: 2vw; }
        }
        `}
      </style>
    </div>
  );
}
