import React from "react";
/**
 * FloatingOrb - glowing, float-anim (CSS), fantasy orb, optional children.
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
        background: `radial-gradient(circle at 65% 35%, ${color}bb, #1e1836 90%)`,
        boxShadow: `0 0 30px 0 ${color}, 0 0 3px 3px #fff2`,
        border: `3px solid ${color}`,
        animation: "orbFloat 2.5s ease-in-out infinite alternate",
        overflow: "visible",
        zIndex: 20,
      }}
    >
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
