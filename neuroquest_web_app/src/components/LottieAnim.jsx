import React from "react";
import PropTypes from "prop-types";
import { Player } from "@lottiefiles/react-lottie-player";

/**
 * PUBLIC_INTERFACE
 * LottieAnim – renders a Lottie JSON animation (or fallback icon).
 * Reusable placeholder for fantasy/game animation needs.
 * @param {string} src - path to Lottie JSON asset
 * @param {number} size - width/height of frame in px
 * @param {boolean} loop
 * @param {boolean} autoplay
 */
export default function LottieAnim({
  src,
  size = 90,
  loop = true,
  autoplay = true,
  className = "",
  style = {},
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        ...style,
      }}
      aria-label="Lottie Animation"
    >
      {src ? (
        <Player
          src={src}
          loop={loop}
          autoplay={autoplay}
          speed={1.13}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <span className="font-bold text-2xl text-accent opacity-65" title="Animated spell">
          🧙
        </span>
      )}
    </div>
  );
}

LottieAnim.propTypes = {
  src: PropTypes.string,
  size: PropTypes.number,
  loop: PropTypes.bool,
  autoplay: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};
