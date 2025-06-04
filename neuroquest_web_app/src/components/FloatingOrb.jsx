import React from "react";
import PropTypes from "prop-types";

/**
 * FloatingOrb: Modular fantasy/neon-glow orb, suitable for stats, tokens, avatars, and magical UI elements.
 * - RPG styled, animated float, and modular
 * - Accepts child content (icon, label, badge, etc)
 * - Can be themed by color/size
 *
 * @param {number} size - diameter px (default 68)
 * @param {string} color - accent border/glow color
 * @param {React.ReactNode} children - icon, stat, overlay, etc
 */
// PUBLIC_INTERFACE
export default function FloatingOrb({
  size = 68,
  color = "#7c3aed",
  children = null,
}) {
  // Animated orb: glass/fantasy highlight, neon-shadow
  return (
    <div
      tabIndex={0}
      className="floating-orb shadow-neon-accent flex items-center justify-center pointer-events-auto"
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        background:
          "radial-gradient(circle, #1b132c 82%, rgba(124,58,237,0.09) 105%)",
        borderRadius: "50%",
        border: `3.4px solid ${color}`,
        boxShadow: `0 0 25px 8px ${color}38, 0 0 9px 2px ${color}`,
        animation: "floatOrb 4.2s ease-in-out infinite alternate",
        filter:
          "drop-shadow(0 0 24px #c084fc44) drop-shadow(0 0 10px #7c3aed88)",
        zIndex: 3,
        position: "relative",
      }}
      aria-label="Floating RPG Orb"
    >
      {children}
      <style>
        {`
          @keyframes floatOrb {
            0% { transform: translateY(0);}
            66% { transform: translateY(-5px);}
            100% { transform: translateY(-11px);}
          }
        `}
      </style>
    </div>
  );
}

FloatingOrb.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  children: PropTypes.node,
};
