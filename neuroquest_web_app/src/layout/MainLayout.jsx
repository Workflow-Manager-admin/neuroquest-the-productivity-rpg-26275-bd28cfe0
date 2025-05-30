import React from "react";
import { Outlet } from "react-router-dom";
import heroBanner from "../assets/hero_banner.png"; // Fantasy RPG hero/landing image

// PUBLIC_INTERFACE
export default function MainLayout() {
  return (
    <div className="main-bg min-h-screen flex flex-col">
      <div className="container mx-auto px-4">
        {/* Hero/banner with RPG/fantasy art and fallback */}
        <div className="hero-banner mt-6 w-full h-[180px] flex items-center justify-center rpg-rounded relative overflow-hidden shadow-lg mb-6">
          <img
            src={heroBanner}
            alt="NeuroQuest - The Productivity RPG Hero"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center top", filter: "brightness(0.93) contrast(1.1)" }}
            onError={e => {
              // Fallback logic: show mystical gradient background if image fails
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
        {/* ...rest of the layout */}
        <Outlet />
      </div>
    </div>
  );
}
