import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LottieAnim from "../components/LottieAnim";
import LoaderAnim from "../assets/lottie/loader.json";

// PUBLIC_INTERFACE
/**
 * Onboarding page: Enter life goal, RPG theming, directs to Dashboard.
 */
export default function Onboarding() {
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleStart = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // Mock quest roadmap creation
      nav("/dashboard");
    }, 1500);
  };

  return (
    <div className="max-w-lg mx-auto glass-bg px-8 py-10 mt-14 shadow-xl rounded-3xl flex flex-col items-center">
      <div className="mb-4">
        <LottieAnim anim={LoaderAnim} height={74} />
      </div>
      <h1 className="text-2xl font-bold neon-glow text-center mb-2">
        Welcome, Adventurer!
      </h1>
      <p className="text-base text-white/80 mb-4 text-center">
        Your journey begins here. What epic life quest will you conquer?<br />Set a bold goal, and let the kingdom forge your questline.
      </p>
      <form className="flex flex-col gap-4 w-full" onSubmit={handleStart}>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-kaviaAccent neon-glow">Your Main Goal</span>
          <input
            type="text"
            required
            value={goal}
            onChange={e => setGoal(e.target.value)}
            className="rounded px-4 py-2 bg-kaviaDark/70 border border-kaviaAccent/30 text-white focus:ring-1 focus:ring-kaviaAccent"
            placeholder="(e.g., Launch my startup)"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-kaviaAccent neon-glow">Deadline</span>
          <input
            type="date"
            required
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            className="rounded px-4 py-2 bg-kaviaDark/70 border border-kaviaAccent/30 text-white focus:ring-1 focus:ring-kaviaAccent"
          />
        </label>
        <button
          type="submit"
          className="neon-btn w-full mt-2"
          disabled={loading}
        >
          {loading ? "Summoning Quests..." : "Forge My Roadmap"}
        </button>
      </form>
      <div className="text-xs text-white/40 text-center mt-4">
        <span role="img" aria-label="crystal">🔮</span> NeuroQuest uses AI to personalize your journey.
      </div>
    </div>
  );
}
