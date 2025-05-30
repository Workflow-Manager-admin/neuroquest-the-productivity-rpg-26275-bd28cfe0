import React from "react";

// PUBLIC_INTERFACE
/**
 * HPBar: Shows current HP out of 100.
 */
export default function HPBar({ hp = 100 }) {
  return (
    <div className="flex flex-col items-start w-32">
      <span className="text-xs text-red-400 neon-glow font-semibold mb-1">HP</span>
      <div className="w-full h-4 bg-red-900/40 rounded-full relative overflow-hidden">
        <div
          className="h-4 rounded-full bg-gradient-to-r from-red-500 to-pink-400"
          style={{
            width: `${Math.max(0, Math.min(100, hp))}%`,
            transition: "width 0.8s"
          }}
        />
      </div>
      <span className="text-xs text-red-200 mt-1">{hp}/100</span>
    </div>
  );
}
