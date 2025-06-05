import React from "react";

// PUBLIC_INTERFACE
function DashboardPage() {
  /**
   * Shell for the central Dashboard (Kingdom).
   * Main game hub with stats, avatar, quest orb, and navigation zones.
   */
  return (
    <div className="dashboard-page container flex flex-col gap-8 py-8">
      <h2 className="dashboard-page__title text-3xl font-bold mb-4">Dashboard</h2>
      {/* TODO: Add components for XP/HP bars, avatar, quick stats, quest orb, etc. */}
      <span className="dashboard-page__placeholder">[Kingdom hub, quick RPG stats, quest orb, navigation zones, etc.]</span>
    </div>
  );
}

export default DashboardPage;
