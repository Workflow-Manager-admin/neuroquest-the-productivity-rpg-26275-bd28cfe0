import React from "react";
// Demo fantasy avatar images for wizard/witch/hero. Put fantasy images in /src/assets/ after download.
const avatarImages = [
  "/src/assets/wizard_hero_01.png",
  "/src/assets/witch_hero_01.png",
  "/src/assets/knight_hero_01.png",
];
/**
 * Avatar with RPG/framed styling, fallback demo art for wizard/witch/hero.
 * @param {string} src - Avatar src or picks demo if omitted.
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
      className="flex items-center justify-center rounded-full relative"
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 16px 3px ${ringColor}77, 0 0 2px ${ringColor}`,
        border: `3px solid ${ringColor}`,
        background: "rgba(47,16,97,0.9)",
      }}
    >
      {/* Example fantasy art (swap out for real) */}
      <img
        src={demoSrc}
        alt={alt}
        className="rounded-full object-cover"
        style={{ width: size - 6, height: size - 6 }}
        draggable={false}
      />
    </div>
  );
}
