import React, { useState } from "react";
import LottieAnim from "../components/LottieAnim";
import LoaderAnim from "../assets/lottie/loader.json";

// PUBLIC_INTERFACE
/**
 * Calendar Sync page: Placeholder for Google Calendar integration.
 */
export default function CalendarSync() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const handleSync = () => {
    setSyncing(true);
    // Placeholder: simulate sync
    setTimeout(() => {
      setLastSync(new Date());
      setSyncing(false);
    }, 1700);
  };

  return (
    <div className="max-w-lg mx-auto glass-bg px-6 py-8 mt-10 shadow-xl rounded-2xl text-center flex flex-col gap-5 justify-center items-center">
      <div className="mb-2">
        <LottieAnim anim={LoaderAnim} height={68} />
      </div>
      <h1 className="text-2xl font-semibold neon-glow mb-1">Calendar Sync</h1>
      <p className="text-base text-white/80 mb-2">
        Connect your Google Calendar to transform real events into in-game Bosses and milestones. Stay on top of upcoming deadlines in your RPG journey!
      </p>
      {lastSync && (
        <span className="block neon-glow text-xs mb-2">
          Last synced: {lastSync.toLocaleString()}
        </span>
      )}
      <button
        onClick={handleSync}
        className="neon-btn w-full max-w-xs"
        disabled={syncing}
      >
        {syncing ? "Syncing..." : "Sync Google Calendar"}
      </button>
      <div className="mt-4 text-xs text-kaviaAccent/80">
        <span role="img" aria-label="shield">🛡️</span> Your data stays private and is never shared.
      </div>
    </div>
  );
}
