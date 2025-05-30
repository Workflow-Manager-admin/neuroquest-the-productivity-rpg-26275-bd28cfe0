import React from "react";
/**
 * ZoneCard – For Dashboard zone grid (Focus Forest, Deadline Dungeon etc.)
 * @param {string} name - Name of the zone
 * @param {string} description
 * @param {string} image - Fantasy image
 * @param {function} onClick
 */
 // PUBLIC_INTERFACE
export default function ZoneCard({ name, description, image, onClick }) {
  return (
    <div
      className="relative cursor-pointer rpg-rounded neon-accent bg-[#191332cc] border-2 border-accent/50 shadow-xl p-4 transition hover:scale-[1.025]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed="false"
    >
      <div className="w-full flex items-center gap-4">
        <img
          src={image}
          alt={name}
          className="w-14 h-14 rpg-rounded object-cover border-2 border-accent/30 bg-black/30"
        />
        <div>
          <h2 className="text-accent font-bold text-xl">{name}</h2>
          <div className="text-textFaded text-sm">{description}</div>
        </div>
      </div>
    </div>
  );
}
