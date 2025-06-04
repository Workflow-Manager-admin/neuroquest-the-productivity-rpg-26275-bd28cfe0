import React from "react";
import PropTypes from "prop-types";

/**
 * PUBLIC_INTERFACE
 * FocusMeter – RPG/fantasy style focus/progress meter.
 * Animated/fancy for immersive productivity game UI.
 * @param {number} focus - Focus/energy value
 * @param {number} maxFocus - Max focus/energy
 * @param {boolean} showLabel - Show "Focus" label
 * @param {string} className - Custom className (optional)
 */
export default function FocusMeter({
  focus = 45,
  maxFocus = 100,
  showLabel = false,
  className = ""
}) {
  // Clamp percent for display
  const percent = maxFocus > 0 ? Math.max(0, Math.min(100, (focus / maxFocus) * 100)) : 0;
  return (
    <div
      className={`relative h-4 w-full bg-[#18132b] border border-accent/50 rpg-rounded shadow-neon-accent overflow-hidden ${className}`}
      style={{ minWidth: 80 }}
      aria-label="Focus Meter"
    >
      <div
        className="absolute left-0 top-0 h-full neon-accent"
        style={{
          width: `${percent}%`,
          transition: "width 0.7s cubic-bezier(.39,1.18,.58,.77)",
          background:
            "linear-gradient(90deg,#98f5e1bb 0%, #a78bfa 72%, #91c2ff 100%)",
          boxShadow: "0 0 15px #38bdf8, 0 0 24px #a78bfa99",
        }}
      />
      <div className="relative z-10 font-bold text-xs text-white px-2 flex items-center justify-between font-poppins select-none">
        {showLabel && <span className="pr-2 text-accent">Focus</span>}
        <span>
          {percent.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

FocusMeter.propTypes = {
  focus: PropTypes.number,
  maxFocus: PropTypes.number,
  showLabel: PropTypes.bool,
  className: PropTypes.string
};
