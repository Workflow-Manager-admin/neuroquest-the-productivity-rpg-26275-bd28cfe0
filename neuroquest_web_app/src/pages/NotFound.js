import React from "react";
import { Link } from "react-router-dom";
import LottieAnim from "../components/LottieAnim";
import LoaderAnim from "../assets/lottie/loader.json";

// PUBLIC_INTERFACE
/**
 * 404 Not Found, stylized with RPG flavor and Lottie.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center mt-32 text-center">
      <div className="w-full flex flex-col items-center">
        <div className="max-w-xs w-full">
          <LottieAnim anim={LoaderAnim} height={92} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold neon-glow mt-4 mb-4">404</h1>
        <div className="text-lg text-kaviaAccent neon-glow mb-2">
          Portal not found! <span role="img" aria-label="crystal">🔮</span>
        </div>
        <div className="text-base text-white/70 mb-8 max-w-sm">
          The page you seek is deep in uncharted territory. Return and continue your quest!
        </div>
      </div>
      <Link
        to="/dashboard"
        className="neon-btn text-lg"
      >
        Back to Kingdom
      </Link>
    </div>
  );
}
