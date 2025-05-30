import React from "react";

// PUBLIC_INTERFACE
/**
 * XP Bar: Shows progress toward next level.
 * Props: xp (number, current xp), level (number)
 */
export default function XPBar({ xp = 0, level = 1 }) {
  // RPG: 0–100 per level, for MVP
  const cappedXP = Math.min(xp % 100, 100);
  return (
    <div className="flex flex-col items-start w-32">
      <span className="text-xs text-yellow-400 neon-glow font-semibold mb-1">Level {level}</span>
      <div className="w-full h-4 bg-yellow-900/60 rounded-full relative overflow-hidden">
        <div
          className="h-4 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500"
          style={{
            width: `${cappedXP}%`,
            transition: "width 0.8s"
          }}
        />
      </div>
      <span className="text-xs text-yellow-200 mt-1">{cappedXP}/100 XP</span>
    </div>
  );
}
