import React from "react";
import PropTypes from "prop-types";

/**
 * FocusMeter: Animated RPG/fantasy focus bar, modular for use in FocusEngine, stats, and overlays.
 * - Glowing neon fantasy style; flexible for use as stats bar, overlay, etc.
 * - Modular: sizing, label, and easy effect integration.
 * - Suitable for animation overlays (pulse/glow with high focus)
 *
 * @param {number} focus - Current focus value (0-100).
 * @param {number} maxFocus - Max value (default 100).
 * @param {boolean} showLabel
 * @param {number} barHeight - px override for bar height (default 5)
 */
// PUBLIC_INTERFACE
export default function FocusMeter({ focus = 0, maxFocus = 100, showLabel = false, barHeight = 5 }) {
  // Clamp percent and set neon effect
  const pct = maxFocus > 0 ? Math.max(0, Math.min(100, (focus / maxFocus) * 100)) : 0;
  let barGlow = "drop-shadow(0 0 12px #7c3aedaa)";
  if (pct > 80) barGlow = "drop-shadow(0 0 24px #e87a41dd) drop-shadow(0 0 9px #7c3aed99)";

  return (
    <div
      className="relative w-full bg-[#181032] border border-accent/40 rpg-rounded overflow-hidden shadow-neon-accent"
      style={{ minWidth: 78, height: barHeight }}
    >
      <div
        className="absolute left-0 top-0 h-full neon-glow"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg,#f472b6 6%,#7c3aed 93%)`,
          filter: barGlow,
          transition: "width 0.86s cubic-bezier(.29,1.27,.57,.67)"
        }}
      />
      <div
        className="relative z-10 font-bold text-xs text-accent py-0.5 px-2 flex items-center justify-between font-poppins select-none"
      >
        {showLabel && <span>Focus</span>}
        <span>{maxFocus > 0 ? `${Math.round(pct)}%` : focus}</span>
      </div>
    </div>
  );
}

FocusMeter.propTypes = {
  focus: PropTypes.number,
  maxFocus: PropTypes.number,
  showLabel: PropTypes.bool,
  barHeight: PropTypes.number,
};
