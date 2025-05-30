import React from "react";
/**
 * ZoneCard – RPG fantasy zone: glow frame, zone art bg, responsive, immersive.
 * @param {string} name - Name of the zone
 * @param {string} description
 * @param {string} image - Fantasy image
 * @param {function} onClick
 */
 // PUBLIC_INTERFACE
export default function ZoneCard({ name, description, image, onClick }) {
  return (
    <div
      className="relative cursor-pointer rpg-rounded rpg-zone-img border-2 border-accent/60 shadow-xl p-4 flex items-center gap-4 transition hover:scale-[1.025] hover:shadow-2xl hover:border-accent/90 group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed="false"
      style={{
        minHeight: 86,
        background: "linear-gradient(135deg,#2c254c 70%,#7c3aed33 120%)",
      }}
    >
      <img
        src={image}
        alt={name}
        className="w-14 h-14 rpg-rounded object-cover border-2 border-accent/50 group-hover:shadow-neon-accent bg-black/30 transition"
        style={{ boxShadow: "0 0 12px #9068d744" }}
      />
      <div className="ml-2 flex flex-col flex-1">
        <h2 className="text-accent font-poppins font-extrabold text-xl drop-shadow-xl">{name}</h2>
        <div className="text-textFaded text-sm font-inter">{description}</div>
      </div>
      {/* Magic aura accent */}
      <span
        aria-hidden
        className="absolute pointer-events-none z-0 left-[14px] top-[14px] animate-pulse"
        style={{
          width: 34, height: 34, borderRadius: "100%",
          background: "radial-gradient(circle,#e89ffe38 0%,transparent 80%)",
          filter: "blur(3px)", zIndex: 1
        }}
      />
    </div>
  );
}
