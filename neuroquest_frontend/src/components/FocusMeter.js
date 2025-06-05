import React from "react";

// PUBLIC_INTERFACE
function FocusMeter({ value = 70, max = 100 }) {
  /**
   * Focus meter UI. Modular.
   * Props: value (current focus), max (max focus)
   */
  const percent = Math.min(100, (value / max) * 100);
  return (
    <div className="focusmeter flex flex-col gap-1 w-full">
      <div className="focusmeter__label font-bold text-xs text-neon-pink">Focus</div>
      <div className="focusmeter__track relative bg-rpg-dark rounded h-3 w-full">
        <div
          className="focusmeter__fill bg-violetneon h-3 rounded"
          style={{ width: `${percent}%`, transition: "width 0.5s" }}
        />
        <div className="focusmeter__text absolute inset-0 flex items-center justify-center text-xs text-white/70 font-bold">
          {value} / {max}
        </div>
      </div>
    </div>
  );
}

export default FocusMeter;
