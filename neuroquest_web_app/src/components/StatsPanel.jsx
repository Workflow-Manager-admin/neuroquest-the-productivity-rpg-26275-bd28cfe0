import React from "react";
/**
 * StatsPanel – compact grid: LV, Streak, XP, Coins.
 * @param {object} stats – { level, streak, xp, coins }
 */
 // PUBLIC_INTERFACE
export default function StatsPanel({ stats }) {
  const { level, streak, xp, coins } = stats || {};
  return (
    <div className="bg-black/60 neon-accent rpg-rounded p-3 w-max flex gap-4 items-center border border-accent/30 shadow-lg text-white">
      <div className="flex flex-col items-center">
        <span className="font-bold">LV</span>
        <span className="text-xl text-accent">{level ?? 1}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-bold">Streak</span>
        <span className="text-xl text-green-400">{streak ?? 0}🔥</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-bold">XP</span>
        <span className="text-xl text-brand-orange">{xp ?? 0}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-bold">Coins</span>
        <span className="text-xl text-yellow-400">{coins ?? 0}🪙</span>
      </div>
    </div>
  );
}
