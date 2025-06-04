import React from "react";
import PropTypes from "prop-types";

/**
 * PUBLIC_INTERFACE
 * XPBar – RPG-inspired XP/experience progress bar.
 * Neon-glow, animated, fantasy-styled, and animation-ready.
 * @param {number} xp - Current XP.
 * @param {number} maxXp - Max XP for next level.
 * @param {boolean} showPercent - Show percentage (true) or raw XP.
 */
export default function XPBar({ xp, maxXp, showPercent = true }) {
  // Avoid division by zero and limit values
  const percent = maxXp > 0 ? Math.min(100, (xp / maxXp) * 100) : 0;
  return (
    <div
      className="relative h-5 w-full bg-neutral-800 border border-accent/60 rpg-rounded overflow-hidden shadow-neon-accent"
      style={{ minWidth: 100 }}
      aria-label="XP Bar"
    >
      <div
        className="absolute left-0 top-0 h-full xp-bar neon-glow"
        style={{
          width: `${percent}%`,
          transition: "width 0.8s cubic-bezier(.29,1.2,.6,.73)",
          background:
            "linear-gradient(90deg, #c084fc 10%, #7c3aed 80%, #e87a41 100%)",
          boxShadow: "0 0 13px #a78bfa, 0 0 24px #c084fc88",
        }}
      />
      <div className="relative z-10 font-bold text-xs text-white py-0.5 px-2 flex items-center justify-between mix-blend-difference font-poppins">
        <span>XP</span>
        <span>
          {showPercent
            ? `${Math.round(percent)}%`
            : `${xp.toLocaleString()} / ${maxXp.toLocaleString()}`}
        </span>
      </div>
    </div>
  );
}

XPBar.propTypes = {
  xp: PropTypes.number.isRequired,
  maxXp: PropTypes.number.isRequired,
  showPercent: PropTypes.bool,
};
