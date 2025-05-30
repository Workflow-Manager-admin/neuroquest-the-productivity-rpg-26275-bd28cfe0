import React from "react";
/**
 * StatsPanel – compact grid: LV, Streak, XP, Coins.
 * @param {object} stats – { level, streak, xp, coins }
 */
 // PUBLIC_INTERFACE
export default function StatsPanel({ stats }) {
  const { level, streak, xp, coins } = stats || {};
  return (
    <div className="bg-black/70 neon-accent rpg-rounded p-3 w-max flex gap-4 items-center border border-accent/40 shadow-neon-accent text-white text-center">
      <div className="flex flex-col items-center min-w-[52px]">
        <span className="font-bold font-inter opacity-85">LV</span>
        <span className="text-xl text-accent font-poppins font-extrabold">{level ?? 1}</span>
      </div>
      <div className="flex flex-col items-center min-w-[52px]">
        <span className="font-bold font-inter">Streak</span>
        <span className="text-xl text-green-400 font-poppins">{streak ?? 0}🔥</span>
      </div>
      <div className="flex flex-col items-center min-w-[52px]">
        <span className="font-bold font-inter">XP</span>
        <span className="text-xl text-brand-orange font-poppins">{xp ?? 0}</span>
      </div>
      <div className="flex flex-col items-center min-w-[52px]">
        <span className="font-bold font-inter">Coins</span>
        <span className="text-xl text-yellow-400 font-poppins">{coins ?? 0}🪙</span>
      </div>
    </div>
  );
}
