import React from "react";
import PropTypes from "prop-types";
/**
 * FloatingOrb - glowing, fantastical float anim, inner glow, RPG orb with child icons or Lottie
 * @param {React.ReactNode} children - Content inside the orb (icon/XP/Lottie etc).
 * @param {number} size - Diameter px.
 * @param {string} color - Neon color (default accent).
 */
 // PUBLIC_INTERFACE
export default function FloatingOrb({ children, size = 72, color = "#7c3aed" }) {
  return (
    <div
      className="relative flex items-center justify-center float-anim"
      style={{
        width: size,
        height: size,
        borderRadius: "100%",
        background: `radial-gradient(circle at 70% 30%, ${color}cc 0%, #311657 99%)`,
        boxShadow: `0 0 44px 2px ${color}99, 0 0 64px 22px #c084fccf, 0 0 20px 3px #fff2`,
        border: `4px solid ${color}`,
        animation: "orbFloat 2.5s ease-in-out infinite alternate",
        overflow: "visible",
        zIndex: 20,
      }}
    >
      {/* Fantasy particle/halo effect */}
      <span
        aria-hidden
        className="absolute animate-pulse"
        style={{
          left: "50%",
          top: "46%",
          transform: "translate(-50%, -50%) scale(1.22)",
          width: size * 0.83,
          height: size * 0.83,
          borderRadius: "100%",
          background: "radial-gradient(circle, #c084fc66 0%, transparent 90%)",
          filter: "blur(6px) opacity(0.81)",
          zIndex: 3,
        }}
      />
      <div className="z-30">{children}</div>
      <style>
        {`
          @keyframes orbFloat {
            0% { transform: translateY(0) scale(1);}
            100% { transform: translateY(-20px) scale(1.04);}
          }
          .float-anim {
            animation: orbFloat 2.3s ease-in-out infinite alternate;
          }
        `}
      </style>
    </div>
  );
}

FloatingOrb.propTypes = {
  children: PropTypes.node,
  size: PropTypes.number,
  color: PropTypes.string,
};
