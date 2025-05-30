import React from "react";

// PUBLIC_INTERFACE
/**
 * StatCard: Shows icon, label, and value for a quick RPG stat.
 */
export default function StatCard({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center bg-kaviaDark/80 rounded-xl px-3 py-3 shadow-glass min-w-[80px]">
      <span className="text-2xl mb-1">{icon}</span>
      <span className="font-semibold text-sm neon-glow">{label}</span>
      <span className="text-sm text-white/90 mt-1">{value}</span>
    </div>
  );
}
