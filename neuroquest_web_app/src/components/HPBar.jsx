import React from "react";
import PropTypes from "prop-types";

/**
 * PUBLIC_INTERFACE
 * HPBar – RPG/fantasy style neon-glow animated health bar.
 * Supports percent/absolute, ready for animations.
 * @param {number} hp - Current HP
 * @param {number} maxHp - Max HP
 * @param {boolean} showPercent - Show percentage
 */
export default function HPBar({ hp, maxHp, showPercent = true }) {
  // Clamp percent for display
  const percent = maxHp > 0 ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 0;
  return (
    <div
      className="relative h-5 w-full bg-neutral-800 border border-red-500/60 rpg-rounded overflow-hidden shadow-[0_0_11px_#e87a4170]"
      style={{ minWidth: 100 }}
      aria-label="HP Bar"
    >
      <div
        className="absolute left-0 top-0 h-full neon-glow"
        style={{
          width: `${percent}%`,
          transition: "width 0.8s cubic-bezier(.27,1.1,.6,.7)",
          background:
            "linear-gradient(90deg, #e87a41 8%, #fb7185 80%, #ff5d51 100%)",
          boxShadow: "0 0 13px #e87a41, 0 0 18px #fb718561",
        }}
      />
      <div className="relative z-10 font-bold text-xs text-white py-0.5 px-2 flex items-center justify-between font-poppins mix-blend-difference">
        <span>HP</span>
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
};
