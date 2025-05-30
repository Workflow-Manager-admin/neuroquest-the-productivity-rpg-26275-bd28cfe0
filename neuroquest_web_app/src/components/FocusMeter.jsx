import React from "react";
// PUBLIC_INTERFACE
/**
 * FocusMeter - animated, glowy, with value and full/faded.
 * @param {number} focus - Current focus level.
 * @param {number} maxFocus - Maximum focus level.
 * @param {boolean} showLabel - Show label.
 */
export default function FocusMeter({
  focus,
  maxFocus = 100,
  showLabel = true,
}) {
  const percent = maxFocus > 0 ? Math.min(100, (focus / maxFocus) * 100) : 0;
  return (
    <div className="relative h-4 w-full bg-[#20154e] neon-accent border border-accent/20 rpg-rounded overflow-hidden mb-2">
      <div
        className="absolute left-0 top-0 h-full bg-accent/70 transition-all duration-300"
        style={{
          width: `${percent}%`,
          filter: "drop-shadow(0 0 6px #a78bfa)",
        }}
      ></div>
      {showLabel && (
        <div className="relative z-10 text-xs text-white py-0.5 px-2 font-mono">
          Focus {Math.round(percent)}%
        </div>
      )}
    </div>
  );
}
