import React, { useState } from "react";
import PropTypes from "prop-types";
import { Player } from "@lottiefiles/react-lottie-player";

/**
 * PUBLIC_INTERFACE
 * LottieAnim – Polished RPG Lottie animation wrapper (with robust fallback)
 * - Shows fallback fantasy icon and shimmer particle FX on error or while loading
 * - RPG glow, progressive feedback, and accessibility
 * @param {string} src - Path to Lottie JSON
 * @param {number} size - Animation size (px)
 * @param {boolean} loop
 * @param {boolean} autoplay
 * @param {string} className
 * @param {object} style
 */
export default function LottieAnim({
  src,
  size = 66,
  loop = true,
  autoplay = true,
  className = "",
  style = {},
}) {
  const [errored, setErrored] = useState(false);
  const [loading, setLoading] = useState(true);

  // Robust fallback: show animated orb+fantasy shimmer if error OR missing src
  const fallback = (
    <div
      className={`flex items-center justify-center rpg-rounded bg-gradient-to-br from-accent/30 via-[#251947bf] to-[#0f172a] animate-pulse border-2 border-accent/20 shadow-neon-accent ${className}`}
      style={{
        minWidth: size,
        minHeight: size,
        width: size,
        height: size,
        borderRadius: 14,
        ...style,
      }}
      aria-label="Animated fallback"
    >
      <span
        className="text-accent text-4xl drop-shadow-lg"
        style={{
          filter: "drop-shadow(0 0 16px #ad54f6)",
          fontSize: size > 36 ? "2.2em" : "1.8em",
          transition: "filter 0.22s",
        }}
        aria-label="Magic"
      >
        ✨
      </span>
    </div>
  );

  // Defensive: only render Lottie if not errored and src is provided
  return !src || errored ? (
    fallback
  ) : (
    <div
      style={{
        minWidth: size,
        minHeight: size,
        width: size,
        height: size,
        ...style,
        position: "relative",
      }}
      className={className}
      aria-label="RPG Animation"
    >
      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-[#351655af] animate-pulse rounded-lg z-10"
          style={{
            minWidth: size,
            minHeight: size,
          }}
        >
          <span className="text-accent text-3xl" aria-label="Loading">🪄</span>
        </div>
      )}
      <Player
        src={src}
        autoplay={autoplay}
        loop={loop}
        style={{ width: size, height: size, zIndex: 20 }}
        className={"rpg-rounded"}
        onEvent={ev => {
          if (ev === "error") setErrored(true);
          if (ev === "load") setLoading(false);
        }}
        onLoad={() => setLoading(false)}
        onError={() => setErrored(true)}
      />
    </div>
  );
}

LottieAnim.propTypes = {
  src: PropTypes.string.isRequired,
  size: PropTypes.number,
  loop: PropTypes.bool,
  autoplay: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};
