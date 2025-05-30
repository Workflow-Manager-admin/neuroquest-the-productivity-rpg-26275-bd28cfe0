import React from "react";

// PUBLIC_INTERFACE
/**
 * Renders a floating magical orb for the RPG dashboard.
 */
export default function FloatingOrb() {
  return (
    <div
      className="fixed left-1/2 top-36 -translate-x-1/2 z-10 pointer-events-none select-none"
      style={{
        filter: "drop-shadow(0 0 80px #7c3aed66)",
        width: 140,
        height: 140,
        animation: "float-orb 5s infinite ease-in-out"
      }}
    >
      <div
        className="rounded-full"
        style={{
          width: "140px",
          height: "140px",
          background: "radial-gradient(circle at 50% 40%, #b993ff 35%, #7c3aed 90%, #0f172a 100%)",
          boxShadow: "0 0 64px 16px #7c3aed88, 0 0 128px #b993ff33",
          border: "2px solid #9d63fe55",
          opacity: 1
        }}
      >
        {/* Swirling magic inside */}
        <div
          style={{
            width: "60px",
            height: "60px",
            background: "radial-gradient(circle at 56% 46%, #fff4 60%, #b993ff 85%, transparent 98%)",
            borderRadius: "50%",
            filter: "blur(2px)",
            margin: "36px auto 0"
          }}
        />
      </div>
      {/* Anim keyframes */}
      <style>
        {`
          @keyframes float-orb {
            0% { transform: translateX(-50%) translateY(0px);}
            50% { transform: translateX(-50%) translateY(-16px);}
            100% { transform: translateX(-50%) translateY(0px);}
          }
        `}
      </style>
    </div>
  );
}
