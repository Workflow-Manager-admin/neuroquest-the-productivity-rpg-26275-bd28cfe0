import React from "react";
import PropTypes from "prop-types";

/**
 * LottieAnim: Placeholder/flexible wrapper for Lottie animation, ready for modular fantasy RPG visual effects.
 * Easily integrates lottie-react; falls back to themed fantasy placeholder if not present/failed.
 * Supports: single JSON src or imported object, size, loop, autoplay.
 *
 * @param {string|object} src - Lottie JSON path or imported animation object
 * @param {number} size - px dimension (width/height)
 * @param {boolean} loop
 * @param {boolean} autoplay
 */
// PUBLIC_INTERFACE
export default function LottieAnim({ src, size = 88, loop = false, autoplay = true }) {
  if (!src) {
    // Fallback: fantasy magic swirl
    return (
      <div
        style={{
          width: size,
          height: size,
          background: "#181032",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.35,
          color: "#c084fc",
          filter: "drop-shadow(0 0 9px #c084fc55)",
        }}
        aria-label="Animated orb"
      >
        🪄
      </div>
    );
  }
  try {
    const Lottie = require("lottie-react").default;
    // Import .json if input is path
    let animData = src;
    if (typeof src === "string" && src.endsWith(".json")) {
      // Try direct require, will fail silently (Vite might not support)
      try {
        animData = require(`${src}`);
      } catch (e) {
        animData = undefined; // fallback
      }
    }
    if (animData) {
      return (
        <Lottie
          animationData={animData}
          loop={loop}
          autoplay={autoplay}
          style={{ width: size, height: size, margin: "auto" }}
        />
      );
    }
  } catch (e) {
    // fall through to fallback
  }
  // Fallback: fantasy portal or magic glimmer
  return (
    <div
      style={{
        width: size,
        height: size,
        background: "#181032",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.32,
        color: "#c084fc",
        filter: "drop-shadow(0 0 10px #a78bfa88)",
      }}
      aria-label="Lottie placeholder"
    >
      ✨
    </div>
  );
}

LottieAnim.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  size: PropTypes.number,
  loop: PropTypes.bool,
  autoplay: PropTypes.bool,
};
