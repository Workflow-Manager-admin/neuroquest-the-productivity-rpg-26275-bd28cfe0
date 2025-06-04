import React from "react";
import PropTypes from "prop-types";

/**
 * PUBLIC_INTERFACE
 * FloatingOrb – Animated/fantasy orb or circle container for stats, icons, XP, etc.
 * RPG style; accepts children (icon, text, etc), size, color.
 */
export default function FloatingOrb({
  size = 58,
  color = "#c084fc",
  className = "",
  style = {},
  children,
  ...props
}) {
  return (
    <div
      className={`relative flex items-center justify-center rpg-rounded overflow-visible ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: "50%",
        boxShadow: `0 0 24px 5px ${color}55, 0 0 6px 2px ${color}57`,
        background:
          "radial-gradient(circle at 60% 40%, #9f82fac1 20%, #271755 80%)",
        ...style,
      }}
      aria-label="Floating Magic Orb"
      {...props}
    >
      {/* Orb particles/shine */}
      <span
        className="absolute inset-0 rounded-full animate-orbPulse pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 78% 24%, #fbbf2498 0%, #c084fc31 42%, #27175500 96%)",
          opacity: 0.37,
          boxShadow: `0 0 16px 8px ${color}22, 0 0 4px 2px ${color}36`,
          zIndex: 0,
        }}
      />
      <span className="relative z-10">{children}</span>
    </div>
  );
}

FloatingOrb.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};
