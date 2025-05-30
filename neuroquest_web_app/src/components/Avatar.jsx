import React from "react";
// Demo fantasy avatar images for wizard/witch/hero. Put fantasy images in /src/assets/ after download.
const avatarImages = [
  "/src/assets/wizard_hero_01.png",
  "/src/assets/witch_hero_01.png",
  "/src/assets/knight_hero_01.png",
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
      {/* Example fantasy art (swap out for real) */}
      <img
        src={demoSrc}
        alt={alt}
        className="rounded-full object-cover rpg-glow-anim"
        style={{ width: size - 10, height: size - 10, borderRadius: "50%" }}
        draggable={false}
      />
    </div>
  );
}
