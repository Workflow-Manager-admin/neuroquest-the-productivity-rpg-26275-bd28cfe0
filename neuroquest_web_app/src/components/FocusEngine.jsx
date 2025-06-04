import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import FocusMeter from "./FocusMeter";
import FloatingOrb from "./FloatingOrb";
import NeonButton from "./NeonButton";
import LottieAnim from "./LottieAnim";
import { useGame } from "../context/GameContext";

// Demo/fallback RPG particle effect (can be swapped with any fantasy Lottie)
const PARTICLE_LOTTIE = "/src/assets/magic-fantasy-particles.json";
const DEMO_BG = PARTICLE_LOTTIE || "/src/assets/starfield.json";

const CALM_MODE_THRESH = 60; // % focus for Calm Mode
const FOCUS_GAIN_RATE = { min: 6, max: 18 }; // XP per tick
const STREAK_GAIN = 1; // streak per focus
const FOCUS_INTERVAL_SEC = 15; // sec per simulation tick

// PUBLIC_INTERFACE
/**
 * FocusEngine.jsx: RPG overlay/side-panel with animated FocusMeter,
 * streak tracker, Calm Mode badge, particle fantasy visual,
 * and real-time focus simulation. XP/streak sync to context.
 * Immersive neon-glow/fantasy polish and mobile-friendliness built-in.
 */
export default function FocusEngine({
  style = {},
  className = "",
  overlay = false, // Use side overlay or embed mode
}) {
  const { game, updateGame, incrementStreak } = useGame();
  const [focus, setFocus] = useState(70); // percent, mock starting value
  const [isFocus, setIsFocus] = useState(true);
  const [isCalm, setIsCalm] = useState(true);
  const [streak, setStreak] = useState(game.streak || 0);
  const [xp, setXP] = useState(game.xp || 0);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  // Removed setBgAnimLoaded (was unused)
  const [bgAnimLoaded] = useState(true); // Assume exists, not used directly

  // Refs for tab visibility/etc.
  const focusTimer = useRef(null);
  const visibleRef = useRef(document.visibilityState);

  // Focus simulation and XP/streak sync
  useEffect(() => {
    // On mount, restore from context
    setStreak(game.streak || 0);
    setXP(game.xp || 0);
    setFocus(70 + Math.floor(Math.random() * 20));

    // Cleanup and tab visibility tracking
    function handleVis() {
      visibleRef.current = document.visibilityState;
    }
    document.addEventListener("visibilitychange", handleVis);

    // Main interval: simulate focus/distraction and XP gain/loss
    focusTimer.current = setInterval(() => {
      let nowVis = visibleRef.current === "visible";
      // Random simulate distraction
      const distracted = Math.random() > 0.81 || !nowVis;
      if (distracted) {
        setIsFocus(false);
        setToastMsg("Distraction appeared! 🐉");
        setShowToast(true);
        setFocus((prev) => Math.max(0, prev - 22 - Math.random() * 6));
        setIsCalm(false);
      } else {
        setIsFocus(true);
        const focusGain =
          FOCUS_GAIN_RATE.min +
          Math.floor(Math.random() * (FOCUS_GAIN_RATE.max - FOCUS_GAIN_RATE.min + 1));
        setFocus((prev) => Math.min(100, prev + 3 + Math.random() * 5));
        setXP((xpPrev) => {
          const nextXP = xpPrev + focusGain;
          updateGame({ xp: nextXP });
          return nextXP;
        });
        if (focus + 5 >= CALM_MODE_THRESH && !isCalm) {
          setIsCalm(true);
          setToastMsg("Calm Mode activated! 🔮 Bonus Streak!");
          setShowToast(true);
          setStreak((s) => {
            const streakNow = (s || 0) + STREAK_GAIN;
            updateGame({ streak: streakNow });
            incrementStreak();
            return streakNow;
          });
        }
      }
    }, FOCUS_INTERVAL_SEC * 1000);

    return () => {
      clearInterval(focusTimer.current);
      document.removeEventListener("visibilitychange", handleVis);
    };
    // eslint-disable-next-line
  }, []);

  // Live sync to Firestore/context on XP/streak update
  useEffect(() => {
    setXP(game.xp || 0);
    setStreak(game.streak || 0);
  }, [game.xp, game.streak]);

  const panelStyle = [
    "fixed",
    "top-0",
    "right-0",
    "z-[40]",
    "w-full",
    "max-w-[390px]",
    "h-[100dvh]",
    "bg-gradient-to-bl",
    "from-[#271755ee]",
    "via-[#150e46e6]",
    "to-[#120735f5]",
    "shadow-xl",
    "neon-accent",
    "p-0",
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "glass-morph",
    "border-l-2",
    "border-accent/50",
    "overflow-hidden",
    "transition-all",
    "ease-in-out",
    "duration-300",
    "md:w-[386px]",
    "mobile:px-1",
    "mobile:max-w-full",
  ].join(" ");

  // === Badge and Focus Orb visuals ===
  function CalmModeBadge() {
    if (!isCalm) return null;
    return (
      <span
        className="flex items-center px-3 py-1 rpg-rounded neon-accent border border-accent/70 bg-accent/20 font-bold text-accent text-lg shadow-lg mb-2 animate-glowPulse"
        style={{
          boxShadow: "0 0 20px #7c3aed66,0 0 4px 2px #a855f640",
          letterSpacing: "0.03em",
        }}
      >
        <LottieAnim
          src="/src/assets/calm-orb.json"
          size={38}
          loop
          autoplay
        />
        <span className="ml-1">Calm Mode</span>
        <span className="ml-2 text-accent text-2xl" aria-label="Calm">
          🔮
        </span>
      </span>
    );
  }

  function FocusStatusText() {
    return isFocus ? (
      <span className="text-green-400 font-bold animate-pulse">Focused✨</span>
    ) : (
      <span className="text-red-400 font-bold animate-shake">Distracted!</span>
    );
  }

  // === Streak+XP tracker ===
  function StreakXPPanel() {
    return (
      <div className="flex flex-row gap-5 justify-center items-center my-1 w-full px-5">
        <span className="font-bold text-green-400 text-lg">
          🔥 Streak: {streak}
        </span>
        <span className="font-bold text-brand-orange text-lg">
          XP: {xp}
        </span>
      </div>
    );
  }

  // === Mobile close button (side-overlay only) ===
  function MobileCloseBtn() {
    if (!overlay) return null;
    return (
      <button
        onClick={() => {
          // For overlays: try back or close panel parent
          if (window.history.length > 1) window.history.back();
        }}
        className="absolute top-4 right-5 z-50 text-3xl text-accent bg-black/60 rpg-rounded px-3 py-2 neon-accent font-bold shadow"
        aria-label="Close Focus Panel"
      >
        ×
      </button>
    );
  }

  // === XP/focus orb ===
  function FocusOrb() {
    return (
      <FloatingOrb size={96} color={isCalm ? "#c084fc" : "#7c3aed"}>
        <span className="font-bold text-3xl text-accent drop-shadow-lg">
          {isFocus ? "🧘" : "💡"}
        </span>
        <div
          className={`absolute w-full text-xs text-brand-orange font-mono font-bold left-0 text-center mt-2`}
        >
          {isFocus ? "Focusing" : "Paused"}
        </div>
      </FloatingOrb>
    );
  }

  // === Animated Lottie background ===
  function FancyBG() {
    return (
      <div
        className="absolute inset-0 w-full h-full z-[-1] pointer-events-none"
        style={{
          opacity: bgAnimLoaded ? 0.64 : 0.32,
          filter: "blur(0.2px)",
          background: "radial-gradient(circle at 70% 10%, #9384f688 0%, #0f172a 96%)",
        }}
      >
        {bgAnimLoaded ? (
          <LottieAnim
            src={DEMO_BG}
            size={420}
            loop
            autoplay
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-accent/30 via-[#0f172a] to-black/90" />
        )}
      </div>
    );
  }

  // Neon/Glow CSS (injected at mount)
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .glass-morph {
        background: rgba(28,19,46,0.78);
        border-radius: 19px;
        backdrop-filter: blur(13px);
      }
      .animate-glowPulse {
        animation: glowPulse .96s infinite alternate cubic-bezier(.72,0,.29,1);
      }
      .animate-shake {
        animation: shakeRPG .55s cubic-bezier(0.16, 1, 0.3, 1) 1;
      }
      @keyframes glowPulse {
        0% { box-shadow: 0 0 20px 6px #a855f655,0 0 4px 2px #7c3aed; }
        100% { box-shadow: 0 0 36px 14px #c084fc99,0 0 12px 2px #c084fc; }
      }
      @keyframes shakeRPG {
        0% { transform: translateX(0);}
        12% { transform: translateX(-7px);}
        24% { transform: translateX(6px);}
        36% { transform: translateX(-7px);}
        48% { transform: translateX(7px);}
        60% { transform: translateX(-3px);}
        72% { transform: translateX(3px);}
        80% { transform: translateX(0);}
        100% { transform: translateX(0);}
      }
    `;
    document.body.appendChild(style);
    return () => document.body.removeChild(style);
  }, []);

  // ===================== RENDER =======================
  return (
    <aside
      className={`${panelStyle} ${className}`}
      style={{
        ...style,
        boxShadow: "0 0 44px 10px #a78bfa88,0 0 4px 2px #a78bfa,0 1px 41px #7c3aed44",
        minHeight: "360px",
        maxWidth: "420px",
        borderTopLeftRadius: "28px",
        borderBottomLeftRadius: "28px",
        ...(overlay ? { position: "fixed" } : {}),
      }}
      tabIndex={0}
      aria-label="Focus Engine - RPG Focus Tracker"
    >
      <FancyBG />
      <MobileCloseBtn />
      <div className="flex flex-col items-center gap-3 w-full pt-5 pb-7 z-10 relative">
        <div className="font-poppins text-xl text-accent neon-accent font-extrabold drop-shadow mb-2">
          Focus Engine
        </div>
        <StreakXPPanel />
        <FocusOrb />
        <div className="w-[86%] md:w-[92%] mt-4 mb-1">
          <FocusMeter focus={focus} maxFocus={100} showLabel />
        </div>
        <div className="mb-1">{FocusStatusText()}</div>
        <CalmModeBadge />
        <div className="flex flex-row gap-3 mt-4 w-full justify-center">
          <NeonButton
            onClick={() => {
              setFocus(85 + Math.random() * 11);
              setIsFocus(true);
              setIsCalm(true);
              setToastMsg("Instant Calm Mode!");
              setShowToast(true);
            }}
            variant="accent"
            className="py-1 px-5 text-md"
          >
            Focus Boost
          </NeonButton>
          <NeonButton
            onClick={() => {
              setFocus(Math.max(7, focus - Math.random() * 23));
              setIsFocus(false);
              setIsCalm(false);
              setToastMsg("Simulated Distraction!");
              setShowToast(true);
            }}
            variant="orange"
            className="py-1 px-5 text-md"
          >
            Distract
          </NeonButton>
        </div>
        <div className="w-full flex flex-row justify-center mt-2 gap-3 text-xs text-textFaded font-mono opacity-75">
          <span>
            Focus = XP. Maintain Calm Mode for bonus streak 🔮
          </span>
        </div>
      </div>
      {/* Toast – fantasy themed, floating at bottom */}
      {showToast && (
        <div className="fixed left-1/2 bottom-[8dvh] z-[99] px-8 py-3 rpg-rounded shadow-xl border-2 border-accent/30 bg-[#180c2d] font-bold text-brand-orange neon-accent text-lg transform -translate-x-1/2 animate-fadeIn">
          <span>{toastMsg}</span>
          <button
            className="ml-5 text-accent hover:text-white text-2xl font-bold"
            onClick={() => setShowToast(false)}
            aria-label="Close focus toast"
          >
            ×
          </button>
        </div>
      )}
    </aside>
  );
}

FocusEngine.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  overlay: PropTypes.bool,
};
