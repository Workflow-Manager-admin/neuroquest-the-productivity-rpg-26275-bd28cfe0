import React from "react";
import PropTypes from "prop-types";

/**
 * HPBar RPG fantasy red/green, animated, neon-glow health meter, modular and ready for animation integration.
 * - RPG/fantasy themed with customizable styling and animation
 * - Readily reusable across profile, boss, and context-specific health bars
 * - Supports both absolute and percent display
 *
 * @param {number} hp - Current HP.
 * @param {number} maxHp - Max HP for context.
 * @param {boolean} showPercent - Show percentage or raw value.
 * @param {number} barHeight - Set to override height in px (default 5).
 * @param {React.ReactNode} label - Optional label (overrides built-in "HP").
 */
// PUBLIC_INTERFACE
export default function HPBar({ hp, maxHp, showPercent = true, barHeight = 5, label }) {
  // Avoid division by zero, clamp values
  const percent = maxHp > 0 ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 0;
  // Dynamic color scheme based on threshold for RPG polish
  const barBg =
    percent < 26
      ? "linear-gradient(90deg,#fd1d42,#96000f 90%)"
      : percent < 65
      ? "linear-gradient(90deg,#fde047,#fd1d42 90%)"
      : "linear-gradient(90deg,#3fa675 3%,#a7e208 90%)";
  const boxShadow =
    percent < 31
      ? "0 0 7px #fd1d42ee"
      : "0 0 11px #7efbadbb";

  return (
    <div
      className="relative w-full bg-neutral-800 border border-red-600/60 rpg-rounded overflow-hidden shadow-neon-accent"
      style={{ minWidth: 96, height: barHeight }}
    >
      {/* Bar */}
      <div
        className="absolute left-0 top-0 h-full neon-glow hp-bar"
        style={{
          width: `${percent}%`,
          background: barBg,
          filter: boxShadow,
          transition: "width 0.7s cubic-bezier(.24,.91,.68,1.12)",
        }}
      />
      {/* Overlay label and value */}
      <div className="relative z-10 font-bold text-xs text-white py-0.5 px-2 flex items-center justify-between font-poppins mix-blend-difference select-none">
        <span>{label === undefined ? "HP" : label}</span>
        <span>
          {showPercent
            ? `${Math.round(percent)}%`
            : `${hp.toLocaleString()} / ${maxHp.toLocaleString()}`}
        </span>
      </div>
    </div>
  );
}

HPBar.propTypes = {
  hp: PropTypes.number.isRequired,
  maxHp: PropTypes.number.isRequired,
  showPercent: PropTypes.bool,
  barHeight: PropTypes.number,
  label: PropTypes.node,
};
