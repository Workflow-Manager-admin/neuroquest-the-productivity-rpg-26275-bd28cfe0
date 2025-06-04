import React from "react";
import PropTypes from "prop-types";

/**
 * Avatar: Fantasy RPG avatar with neon ring, themable and modular for profile, card, and stat use.
 * - Highly reusable: accepts either built-in demoIndex or src/children with fallback
 * - Thematically RPG/fantasy (hero art, round neon borders)
 * - Suitable for use in lists, dashboards, cards, etc.
 * - Ready for animation/effect overlays (children prop)
 *
 * @param {number} size - px (default: 86)
 * @param {number} demoIndex - Pick demo hero (0: wizard, 1: witch, 2: knight)
 * @param {string} src - Provide your own override avatar art (overrides demoIndex)
 * @param {string} ringColor - Neon accent ring color
 * @param {string} alt - Alt text for image
 * @param {React.ReactNode} children - Overlay for live cosmetic effects or accessories
 */
// PUBLIC_INTERFACE
export default function Avatar({
  size = 86,
  demoIndex = 0,
  src,
  ringColor = "#a78bfa",
  alt = "",
  children,
}) {
  // Demo avatar/fallback (swap with /src/assets as desired)
  const avatars = [
    "/src/assets/wizard_hero_01.png",
    "/src/assets/witch_hero_01.png",
    "/src/assets/knight_hero_01.png",
  ];
  const imgSrc = src || avatars[demoIndex % avatars.length];

  return (
    <div
      className="relative rpg-rounded overflow-hidden shadow-neon-accent flex items-center justify-center"
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: size / 2,
        boxShadow: `0 0 0 ${Math.floor(size / 18)}px ${ringColor}77, 0 0 26px 9px ${ringColor}33, 0 1px 19px #7c3aed44`,
        border: `2px solid ${ringColor}`,
        background: "#231a40",
      }}
    >
      <img
        src={imgSrc}
        alt={alt || "Avatar"}
        className="object-cover w-full h-full"
        style={{ borderRadius: size / 2, background: "#150e24" }}
        draggable={false}
        onError={e => {
          e.target.onerror = null;
          e.target.style.display = "none";
        }}
      />
      {/* Children overlays for cosmetics, etc. */}
      {children && (
        <div className="absolute left-0 top-0 w-full h-full pointer-events-none z-20">
          {children}
        </div>
      )}
      {/* RPG/fantasy fallback icon (rarely shown) */}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white select-none"
        aria-label="avatar fallback"
        style={{
          fontSize: Math.round(size * 0.54),
          filter: "drop-shadow(0 0 8px #e87a41), drop-shadow(0 0 18px #c084fc99)",
          display: "none",
        }}
      >
        🧙
      </span>
    </div>
  );
}

Avatar.propTypes = {
  size: PropTypes.number,
  demoIndex: PropTypes.number,
  src: PropTypes.string,
  ringColor: PropTypes.string,
  alt: PropTypes.string,
  children: PropTypes.node,
};
