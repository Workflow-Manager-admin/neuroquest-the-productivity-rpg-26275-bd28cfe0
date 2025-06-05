import React from "react";
import { useGame } from "../contexts/GlobalGameContext";
import { useAuth } from "../contexts/AuthContext";
import XPBar from "../components/XPBar";
import HPBar from "../components/HPBar";
import FocusMeter from "../components/FocusMeter";
import Avatar from "../components/Avatar";
import FloatingOrb from "../components/FloatingOrb";
import { Link } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * DashboardPage - The premium, RPG dashboard.
 * Features animated orb, XP/HP bars, avatar, modern RPG nav zones, and global stat context. Ultra responsive and accessible.
 */
function DashboardPage() {
  // Read global RPG stats and user from contexts
  const {
    xp = 0,
    hp = 100,
    streak = 0,
    level = 1,
    user: gameUser
  } = useGame();
  const { currentUser } = useAuth();

  // Determine avatar displayName/email (fallback)
  const avatarName =
    (currentUser && (currentUser.displayName || currentUser.email)) ||
    (gameUser && (gameUser.displayName || gameUser.email)) ||
    "Hero";

  // For now, no profilePic in context; let Avatar fallback to initial
  const avatarSrc = (currentUser && currentUser.photoURL) || null;

  // XP leveling: every 100 XP == next level (matches reducer logic)
  const XP_MAX_PER_LEVEL = 100;
  const currentLevelXp = xp % XP_MAX_PER_LEVEL;
  const xpToNext = XP_MAX_PER_LEVEL - currentLevelXp;

  // Optional: focus metric; placeholder (could be streak or custom value)
  const focusValue = 40 + (streak * 10); // Example formula for now, max: 100

  // Accessibility: ARIA label for orb and main regions
  return (
    <section className="dashboard-page container flex flex-col items-center gap-7 md:gap-10 py-4 px-1 w-full mx-auto">
      {/* Top Bar: Stats and Avatar */}
      <div className="w-full flex flex-col md:flex-row items-center md:items-end justify-between gap-4 mb-1">
        <div className="flex flex-col gap-1 md:gap-2 w-full md:w-auto">
          <XPBar value={currentLevelXp} max={XP_MAX_PER_LEVEL} level={level} />
          <HPBar value={hp} max={100} />
          <FocusMeter value={focusValue > 100 ? 100 : focusValue} max={100} />
        </div>
        <div className="order-first md:order-none mb-3 md:mb-0">
          <Avatar src={avatarSrc} name={avatarName} size={82} />
        </div>
        <div className="flex flex-col items-center gap-1 md:items-end w-full md:w-auto">
          <div className="rounded-lg bg-midnight/80 px-3 py-1 text-base text-rpg-gold font-display shadow-neon-violet flex items-center gap-2">
            <span className="hidden md:inline">🔥</span> Streak: {streak} day{streak !== 1 && "s"}
          </div>
          <div className="text-xs text-white/60 mt-1">Lv. {level}&nbsp;&bull;&nbsp;XP to next: {xpToNext}</div>
        </div>
      </div>
      {/* Centerpiece: Animated Floating Orb */}
      <div className="relative flex flex-col items-center justify-center w-full my-1" aria-label="Quest Orb with RPG status">
        <div className="relative animate-float">
          <FloatingOrb>
            <div className="flex flex-col items-center">
              <span className="font-display text-lg text-rpg-gold drop-shadow-neon-cyan mb-0.5">Quest Orb</span>
              <span className="text-white text-xs font-medium">Level {level}</span>
              <span className="animate-pulse text-neon-cyan text-2xl mt-1">◎</span>
            </div>
          </FloatingOrb>
          {/* Neon aura accent for orb */}
          <div className="absolute inset-0 w-28 h-28 mx-auto pointer-events-none blur-3xl opacity-40 z-0 bg-neon-cyan rounded-full animate-pulse"></div>
        </div>
      </div>
      {/* RPG Zones Navigation */}
      <nav className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-4" aria-label="Kingdom navigation zones">
        {/* Focus Forest */}
        <Link
          to="/focusengine"
          className="group bg-gradient-to-br from-neon-cyan/70 to-violetneon/60 border-2 border-neon-cyan rounded-xl shadow-neon-cyan hover:scale-105 focus:scale-105 focus:outline-none transition-transform min-h-[120px] p-4 flex flex-col items-center justify-center gap-2 cursor-pointer"
          tabIndex={0}
        >
          <span className="text-3xl mb-0.5 drop-shadow-neon-cyan">🌲</span>
          <span className="text-lg md:text-xl font-bold text-neon-cyan font-display drop-shadow">Focus Forest</span>
          <span className="text-white/80 text-xs text-center">Boost your focus, track streaks, earn extra XP!</span>
        </Link>
        {/* Deadline Dungeon */}
        <Link
          to="/bossbattle"
          className="group bg-gradient-to-br from-neon-pink/60 to-midnight/80 border-2 border-neon-pink rounded-xl shadow-neon-violet hover:scale-105 focus:scale-105 focus:outline-none transition-transform min-h-[120px] p-4 flex flex-col items-center justify-center gap-2 cursor-pointer"
          tabIndex={0}
        >
          <span className="text-3xl mb-0.5 drop-shadow-neon-pink">👹</span>
          <span className="text-lg md:text-xl font-bold text-neon-pink font-display drop-shadow">Deadline Dungeon</span>
          <span className="text-white/80 text-xs text-center">Face your toughest quests and battle epic bosses!</span>
        </Link>
        {/* Daily Hills */}
        <Link
          to="/questlog"
          className="group bg-gradient-to-tr from-rpg-gold/60 to-violetneon/50 border-2 border-rpg-gold rounded-xl shadow-neon-violet hover:scale-105 focus:scale-105 focus:outline-none transition-transform min-h-[120px] p-4 flex flex-col items-center justify-center gap-2 cursor-pointer"
          tabIndex={0}
        >
          <span className="text-3xl mb-0.5 drop-shadow-neon-gold">⛰️</span>
          <span className="text-lg md:text-xl font-bold text-rpg-gold font-display drop-shadow">Daily Hills</span>
          <span className="text-white/80 text-xs text-center">Tackle daily quests & progress your adventure.</span>
        </Link>
      </nav>
      {/* Responsive spacing */}
      <div className="h-4 md:h-10"></div>
    </section>
  );
}

export default DashboardPage;
