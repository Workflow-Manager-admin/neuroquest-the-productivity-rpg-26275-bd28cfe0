import React from "react";

// PUBLIC_INTERFACE
function HPBar({ value = 100, max = 100 }) {
  /**
   * Modular HP (health) bar. Shows current and max HP.
   * Props:
   *  - value (current HP)
   *  - max (max HP)
   */
  const percent = Math.min(100, (value / max) * 100);
  return (
    <div className="hpbar flex items-center gap-3 my-1">
      <div className="hpbar__label font-bold text-xs text-rpg-gold">HP</div>
      <div className="hpbar__track bg-rpg-dark rounded h-4 w-48 relative">
        <div
          className="hpbar__fill bg-neon-pink h-4 rounded"
          style={{ width: `${percent}%`, transition: "width 0.5s" }}
        />
        <div className="hpbar__text absolute inset-0 flex items-center justify-center text-xs font-bold text-white/80">
          {value} / {max}
        </div>
      </div>
    </div>
  );
}

export default HPBar;
