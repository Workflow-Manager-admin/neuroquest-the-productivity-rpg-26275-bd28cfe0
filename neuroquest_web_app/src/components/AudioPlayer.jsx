import React, { useEffect, useRef, useState, createContext, useContext } from "react";
import PropTypes from "prop-types";

// PUBLIC_INTERFACE
/**
 * AudioPlayer: Global looping music/audio context with mute and volume controls.
 * - Usage: <AudioProvider><App/></AudioProvider>, useAudio() for controls/events.
 * - Handles one global audio stream; for SFX/music layers, fork or triggerAudio().
 */

// Set your RPG bgm file in /src/assets, update default below.
const DEFAULT_BGM = "/src/assets/bg_rpg_theme.mp3"; // Place your song here!

const AudioContext = createContext();

export function useAudio() {
  return useContext(AudioContext);
}

// PUBLIC_INTERFACE
export function AudioProvider({ children, src = DEFAULT_BGM }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.58);

  // Auto-play audio (looped) on mount
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new window.Audio(src);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }
    if (!muted) {
      audioRef.current.volume = volume;
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    } else {
      audioRef.current.muted = true;
      audioRef.current.pause();
      setPlaying(false);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [src, muted]);

  const toggleMute = () => setMuted((m) => !m);
  const setVol = (v) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  // PUBLIC_INTERFACE
  function triggerAudio(event = "effect", effectSrc, loop = false, vol = 1.0) {
    // Quick fx (no conflict with main BGM)
    if (!effectSrc) return;
    const fx = new window.Audio(effectSrc);
    fx.loop = loop;
    fx.volume = vol;
    fx.play().catch(() => {});
    return fx;
  }

  return (
    <AudioContext.Provider
      value={{ playing, muted, volume, setMuted, setVolume: setVol, toggleMute, triggerAudio, audioRef }}
    >
      {children}
      {/* Optional: On-screen audio controls for global music */}
      <div className="fixed bottom-3 right-3 z-[70] flex items-center gap-3 bg-black/70 rpg-rounded px-3 py-2 neon-accent shadow-lg">
        <button
          aria-label={muted ? "Unmute music" : "Mute music"}
          onClick={toggleMute}
          className="text-2xl"
        >
          {muted ? "🔇" : "🎵"}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={e => setVol(Number(e.target.value))}
          className="mx-2 accent-accent"
          title="Music Volume"
        />
      </div>
    </AudioContext.Provider>
  );
}
AudioProvider.propTypes = {
  children: PropTypes.node.isRequired,
  src: PropTypes.string,
};

