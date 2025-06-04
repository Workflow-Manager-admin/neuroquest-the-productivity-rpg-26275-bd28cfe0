import React from "react";
import PropTypes from "prop-types";

/**
 * PUBLIC_INTERFACE
 * Avatar – RPG/fantasy themed avatar (hero, player, NPC, etc), ready for
 * animation/FX, ring color, and variant support. Treated as modular and reusable.
 *
 * @param {number} size - Size in pixels.
 * @param {number} demoIndex - Which demo avatar to show.
 * @param {string} ringColor - Neon/flair color for the border ring.
 * @param {string} alt - alt text for accessibility.
 * @param {string} className
 */
export default function Avatar({
  size = 70,
  demoIndex = 0,
  ringColor = "#a78bfa",
  alt = "Player Avatar",
  className = "",
  ...props
}) {
  // Provide several avatar art variants; devs can expand by dropping in /src/assets
  const AVATAR_DEMOS = [
    "/src/assets/wizard_hero_01.png",
    "/src/assets/witch_hero_01.png",
    "/src/assets/knight_hero_01.png",
  ];
  const src = AVATAR_DEMOS[demoIndex % AVATAR_DEMOS.length];
  return (
    <span
      className={`inline-flex items-center justify-center neon-accent bg-black/50 rpg-rounded relative overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        boxShadow: `0 0 14px 2px ${ringColor}66, 0 0 7px 3px ${ringColor}24`,
        border: `.15em solid ${ringColor}`,
        minWidth: 28,
        minHeight: 28,
      }}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full avatar-portrait"
        style={{
          borderRadius: "50%",
          filter: "drop-shadow(0 0 7px #a78bfa88) brightness(1.12)",
          background: "#191332",
        }}
        draggable={false}
      />
      {/* Floating RPG magic ring for future animation */}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none z-10 ring-rpg-glow"
        style={{
          borderRadius: "50%",
          outline: `3px solid ${ringColor}`,
          boxShadow: `0 0 16px 2px ${ringColor}99, 0 0 27px 5px #a78bfa99, 0 0 3px 1px ${ringColor}`,
          opacity: 0.72,
        }}
      />
    </span>
  );
}

Avatar.propTypes = {
  size: PropTypes.number,
  demoIndex: PropTypes.number,
  ringColor: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
};
