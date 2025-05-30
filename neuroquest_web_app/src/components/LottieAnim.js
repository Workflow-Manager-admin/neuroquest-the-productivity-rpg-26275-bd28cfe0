import React, { useEffect, useRef } from "react";

/**
 * Animated Lottie wrapper – bring in any JSON asset (inline or by import).
 * Uses lottie-web via CDN.
 */
// PUBLIC_INTERFACE
export default function LottieAnim({ anim, height = 80, loop = true, autoplay = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Dynamically load lottie-web only if needed.
    let lottie;
    let animationInstance;
    const load = async () => {
      if (!window.lottie) {
        // Load CDN
        const script = document.createElement("script");
        script.src = "https://unpkg.com/lottie-web@5.10.1/build/player/lottie.min.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise(res => { script.onload = res; });
        lottie = window.lottie;
      } else {
        lottie = window.lottie;
      }
      if (containerRef.current && lottie) {
        containerRef.current.innerHTML = "";
        animationInstance = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop,
          autoplay,
          animationData: anim
        });
      }
    };
    load();
    return () => {
      if (animationInstance && animationInstance.destroy) {
        animationInstance.destroy();
      }
    };
  }, [anim, loop, autoplay]);

  return (
    <div
      ref={containerRef}
      style={{ width: `${height}px`, height: `${height}px`, margin: "0 auto" }}
    >
      {/* fallback for users without JS/lottie */}
      <div style={{
        width: `${height}px`,
        height: `${height}px`,
        background: "#ccc",
        borderRadius: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <span role="img" aria-label="loading">⚡</span>
      </div>
    </div>
  );
}
