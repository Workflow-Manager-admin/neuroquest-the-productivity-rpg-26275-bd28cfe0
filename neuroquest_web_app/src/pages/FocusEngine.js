import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LottieAnim from "../components/LottieAnim";
import LoaderAnim from "../assets/lottie/loader.json";

// PUBLIC_INTERFACE
/**
 * FocusEngine: Productivity timer RPG, XP/streak bar, Lottie orb.
 */
const FOCUS_LENGTH = 25 * 60;
const BREAK_LENGTH = 5 * 60;

export default function FocusEngine() {
  const [remaining, setRemaining] = useState(FOCUS_LENGTH);
  const [running, setRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [streak, setStreak] = useState(0);
  const { xp, setXp } = useAuth();

  React.useEffect(() => {
    if (running && remaining > 0) {
      const t = setTimeout(() => setRemaining(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
    if (running && remaining === 0) {
      // Focus or break completed
      if (!onBreak) {
        setXp && setXp(xp + 15); // Add XP for focus session.
        setStreak(s => s + 1);
        setOnBreak(true);
        setRemaining(BREAK_LENGTH);
      } else {
        setOnBreak(false);
        setRemaining(FOCUS_LENGTH);
      }
    }
  }, [running, remaining, onBreak, setXp, xp]);
  
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false); setOnBreak(false); setRemaining(FOCUS_LENGTH);
  };

  return (
    <div className="max-w-md mx-auto glass-bg px-8 py-10 mt-8 rounded-3xl shadow-xl flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold neon-glow mb-3">Focus Engine</h1>
      <LottieAnim anim={LoaderAnim} height={100} />
      <div className="text-lg neon-glow text-center mb-2">
        {onBreak ? "Break Time! Breathe – prepare for the next quest." : "Stay focused to beat distractions and earn XP!"}
      </div>
      <div className="w-full flex flex-col items-center mb-2">
        <div className="text-4xl font-mono font-bold tracking-wider mb-2 glass-bg px-7 py-2 rounded-xl shadow-glass">
          {mins}:{secs.toString().padStart(2, "0")}
        </div>
        <div className="flex flex-row gap-4 mt-2">
          {!running ? (
            <button className="neon-btn px-7" onClick={start}>Start</button>
          ) : (
            <button className="neon-btn bg-kaviaDanger px-7" onClick={pause}>Pause</button>
          )}
          <button className="neon-btn px-6 bg-kaviaAccent/60" onClick={reset}>Reset</button>
        </div>
      </div>
      <div className="w-full mt-3 flex flex-col gap-3 items-center">
        <div className="text-xs text-kaviaAccent neon-glow">Session streak: {streak}</div>
        <div className="text-xs text-white/60">Complete {onBreak ? "your break" : "focus session"} to earn XP and glory.</div>
      </div>
    </div>
  );
}
