import React from "react";
import PropTypes from "prop-types";
// PUBLIC_INTERFACE
/**
 * HPBar RPG-style, neon-glow, with %/abs support and animated.
 * @param {number} hp - Current HP.
 * @param {number} maxHp - Max HP, default 100.
 * @param {boolean} showPercent - Show percentage or raw HP.
 */
export default function HPBar({ hp, maxHp = 100, showPercent = true }) {
  const percent = maxHp > 0 ? Math.min(100, (hp / maxHp) * 100) : 0;
  return (
    <div className="relative h-5 w-full bg-neutral-800 border border-red-400/70 rpg-rounded overflow-hidden shadow-neon-accent" style={{minWidth:100}}>
      <div
        className="absolute left-0 top-0 h-full hp-bar neon-glow"
        style={{ width: `${percent}%`, transition: "width 0.8s cubic-bezier(.32, 1, .68, .77)" }}
      ></div>
      <div className="relative z-10 font-bold text-xs text-white py-0.5 px-2 flex items-center justify-between mix-blend-difference font-poppins">
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
  maxHp: PropTypes.number,
  showPercent: PropTypes.bool
};
