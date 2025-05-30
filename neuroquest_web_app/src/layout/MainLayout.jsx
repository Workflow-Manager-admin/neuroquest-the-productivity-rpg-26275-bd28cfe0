import React from "react";
import { Outlet } from "react-router-dom";
// Hero banner image reference removed due to missing asset

export default function MainLayout() {
  return (
    <div className="main-bg min-h-screen flex flex-col">
      <div className="container mx-auto px-4">
        {/* Hero banner remains as a styled div; background is a CSS fallback gradient */}
        <div className="hero-banner mt-6"></div>
        {/* ...rest of the layout */}
        <Outlet />
      </div>
    </div>
  );
}
