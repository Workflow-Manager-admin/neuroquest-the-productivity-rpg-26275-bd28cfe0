import React from "react";
import PropTypes from "prop-types";
/**
 * Avatar fantasy asset management:
 * - Current array uses placeholder URLs of fantasy avatars (public domain or open art).
 * - To use your own: Drop PNGs named wizard_hero_01.png, witch_hero_01.png, knight_hero_01.png, etc. in /src/assets.
 *   Then update the imports below and remove the public URLs.
 * - Each <img> has a robust fallback logic.
 */
const avatarImages = [
  // Example fantasy avatar (OpenGameArt/wikimedia public PNGs as demo)
  "https://opengameart.org/sites/default/files/styles/medium/public/wizard2_0.png", // Wizard (Opengameart)
  "https://opengameart.org/sites/default/files/styles/medium/public/women.png",      // Witch/Magician (Opengameart)
  "https://opengameart.org/sites/default/files/styles/medium/public/armor-2.png",    // Knight (Opengameart)
  // TODO: Replace above URLs by importing your PNGs like:
  // require('../assets/wizard_hero_01.png'), ...
];
/**
 * Avatar with RPG/fantasy frame, multi-layer glow, and fantasy styling.
 * @param {string} src - Avatar src or demo if omitted.
 * @param {string} alt - Alt text.
 * @param {number} size - Avatar size (px).
 * @param {string} ringColor - Neon ring color.
 */
 // PUBLIC_INTERFACE
export default function Avatar({
  src,
  alt = "RPG Hero Avatar",
  size = 64,
  ringColor = "#7c3aed",
  demoIndex = 0,
}) {
  const demoSrc =
    src || avatarImages[demoIndex % avatarImages.length] || avatarImages[0];
  return (
    <div
      className="flex items-center justify-center relative avatar-rpg"
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 26px 6px ${ringColor}bb, 0 0 80px 4px #a36bf7cc`,
        border: `4px solid ${ringColor}`,
        background:
          "linear-gradient(143deg, #321438 80%, #9464fa44 120%)",
        zIndex: 5,
      }}
    >
      {/* Fantasy aura layer */}
      <span
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: "50%", top: "50%", transform: "translate(-50%,-50%) scale(1.08)",
          width: size * 0.97, height: size * 0.97, borderRadius: "100%",
          background: "radial-gradient(circle,#dfb8ff33 0%,transparent 87%)",
          filter: "blur(4px)",
          zIndex: 4,
        }}
      />
      {/* Example fantasy art, fallback if missing image */}
      <img
        src={demoSrc}
        alt={alt}
        className="rounded-full object-cover rpg-glow-anim"
        style={{ width: size - 10, height: size - 10, borderRadius: "50%" }}
        draggable={false}
        onError={e => {
          // Avatar fallback logic:
          e.target.onerror = null;
          e.target.style.display = "none";
          if (e.target.parentNode) {
            e.target.parentNode.innerHTML +=
              `<span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:${size *
                0.44}px;color:#b388ea;font-weight:bold;text-shadow:0 0 12px #6e42c1">🧙</span>`;
          }
        }}
        // TODO: Drop your fantasy avatar PNG/SVG in /src/assets and update avatarImages for production polish
      />
    </div>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.number,
  ringColor: PropTypes.string,
  demoIndex: PropTypes.number,
};
