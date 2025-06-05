import React from "react";

// PUBLIC_INTERFACE
function XPBar({ value = 0, max = 100, level = 1 }) {
  /**
   * Modular XP bar. Shows current XP, max XP, and level.
   * Props:
   *  - value (XP amount)
   *  - max (XP needed for level up)
   *  - level (current level)
   */
  const percent = Math.min(100, (value / max) * 100);
  return (
    <div className="xpbar flex items-center gap-3 my-1">
      <div className="xpbar__label font-bold text-xs text-rpg-gold">XP</div>
      <div className="xpbar__track bg-rpg-dark rounded h-4 w-48 relative">
        <div
          className="xpbar__fill bg-neon-cyan h-4 rounded"
          style={{ width: `${percent}%`, transition: "width 0.5s" }}
        />
        <div className="xpbar__text absolute inset-0 flex items-center justify-center text-xs font-bold text-black/70">
          {value} / {max}
        </div>
      </div>
      <div className="xpbar__level text-xs ml-2 px-2 rounded bg-violetneon text-white">Lv. {level}</div>
    </div>
  );
}

export default XPBar;
