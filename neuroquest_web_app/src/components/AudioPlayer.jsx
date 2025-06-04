import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

/**
 * AudioPlayer.jsx – Global RPG background music, context scene switching,
 * user controls, and neon UI for NeuroQuest.
 * - Handles per-route scene music, crossfades, mute/volume.
 * - Use useAudio().switchTheme("dashboard"/"focus"/"boss"...) on page mount.
 */

// Map of scene names to their mp3 assets (add more as needed)
const BG_THEMES = {
  dashboard: { src: "/src/assets/bg_rpg_theme.mp3", label: "Theme" },
  focus: { src: "/src/assets/bg_focus_theme.mp3", label: "Focus" },
  boss: { src: "/src/assets/boss_theme.mp3", label: "Boss Battle" },
  inventory: { src: "/src/assets/bg_rpg_theme.mp3", label: "Inventory" },
  settings: { src: "/src/assets/bg_rpg_theme.mp3", label: "Settings" },
};

const DEFAULT_THEME = "dashboard";

const AudioCtx = createContext();

// PUBLIC_INTERFACE
export function useAudio() {
  return useContext(AudioCtx);
}

// PUBLIC_INTERFACE
export function AudioProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.55);
  const [mute, setMute] = useState(false);

  const audioRef = useRef(null);
  const fadeRef = useRef();

  // Theme/track switching with crossfade
  useEffect(() => {
    const theme = BG_THEMES[currentTheme] || BG_THEMES[DEFAULT_THEME];
    if (!theme || !theme.src) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    audioRef.current = new window.Audio(theme.src);
    audioRef.current.loop = true;
    audioRef.current.volume = mute ? 0 : volume;
    if (isPlaying && !mute) {
      audioRef.current.play().catch(() => {});
    }

    return () => {
      // Pause (do not delete, needed for seamless switching)
      if (audioRef.current) audioRef.current.pause();
    };
    // eslint-disable-next-line
  }, [currentTheme]);

  // Sync volume/mute consistently
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = mute ? 0 : volume;
      if (!isPlaying || mute) audioRef.current.pause();
      else audioRef.current.play().catch(() => {});
    }
  }, [mute, volume, isPlaying]);

  // Robust API for page context to request theme change
  function switchTheme(scene) {
    if (scene === currentTheme) return;
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (fadeRef.current) clearTimeout(fadeRef.current);
    fadeRef.current = setTimeout(() => {
      setCurrentTheme(scene in BG_THEMES ? scene : DEFAULT_THEME);
      setIsPlaying(true);
    }, 200);
  }

  function handleMute() {
    setMute((m) => !m);
  }
  function handleVol(val) {
    setVolume(val);
    setMute(val === 0);
  }
  function handleToggle() {
    setIsPlaying((play) => {
      if (play && audioRef.current) audioRef.current.pause();
      else if (!play && audioRef.current && !mute) audioRef.current.play().catch(() => {});
      return !play;
    });
  }

  // Neon RPG controls UI, always on
  function AudioControls() {
    return (
      <div
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[98] flex items-center gap-3 glass-morph neon-accent rpg-rounded px-4 py-2"
        style={{
          minWidth: 78,
          borderRadius: 14,
          background: "rgba(22,12,36,0.91)",
          boxShadow: "0 0 12px #7c3aed96, 0 0 28px #c084fc70",
        }}
        tabIndex={0}
        aria-label="Music controls"
      >
        <button
          className="text-accent text-2xl"
          onClick={handleToggle}
          aria-label={isPlaying && !mute ? "Pause music" : "Play music"}
        >
          {isPlaying && !mute ? "⏸️" : "▶️"}
        </button>
        <button
          className={
            "text-accent text-2xl " + (mute ? "opacity-45" : "")
          }
          onClick={handleMute}
          aria-label={mute ? "Unmute music" : "Mute music"}
        >
          {mute ? "🔇" : "🔊"}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={mute ? 0 : volume}
          onChange={(e) => handleVol(Number(e.target.value))}
          style={{
            accentColor: "#9447fa",
            width: 65,
            marginLeft: 9,
          }}
          title="Music Volume"
        />
        <span
          className="ml-3 px-1.5 py-0.5 text-xs font-bold text-accent border border-accent rpg-rounded"
          style={{
            background: "#170e34",
            letterSpacing: "0.01em"
          }}
        >
          {BG_THEMES[currentTheme]?.label || "Theme"}
        </span>
      </div>
    );
  }

  useEffect(
    () => () => {
      if (audioRef.current) audioRef.current.pause();
      if (fadeRef.current) clearTimeout(fadeRef.current);
    },
    []
  );

  const ctxValue = {
    isPlaying,
    mute,
    volume,
    currentTheme,
    switchTheme,
    setVolume,
    setMute,
    setCurrentTheme,
    AudioControls,
  };

  return (
    <AudioCtx.Provider value={ctxValue}>
      {children}
      <AudioControls />
    </AudioCtx.Provider>
  );
}
AudioProvider.propTypes = { children: PropTypes.node.isRequired };
