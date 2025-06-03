import React from "react";
import PropTypes from "prop-types";
import { Player } from "@lottiefiles/react-lottie-player";
// PUBLIC_INTERFACE
/**
 * LottieAnim – convenient Lottie animation wrapper
 * @param {string} src - Path or URL to lottie JSON
 * @param {number} size - Width/height in px (square)
 * @param {boolean} loop - Loop animation
 * @param {boolean} autoplay - Autoplay on mount
 */
export default function LottieAnim({
  src,
  size = 64,
  loop = true,
  autoplay = true,
}) {
  return (
    <div style={{ width: size, height: size }}>
      <Player
        src={src}
        loop={loop}
        autoplay={autoplay}
        style={{ width: size, height: size }}
      />
    </div>
  );
}

LottieAnim.propTypes = {
  src: PropTypes.string,
  size: PropTypes.number,
  loop: PropTypes.bool,
  autoplay: PropTypes.bool,
};
