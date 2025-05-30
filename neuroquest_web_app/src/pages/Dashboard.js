import React from "react";
import { useAuth } from "../context/AuthContext";
import XPBar from "../components/XPBar";
import HPBar from "../components/HPBar";
import Avatar from "../components/Avatar";
import StatCard from "../components/StatCard";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * Dashboard "Kingdom": RPG hub, XP/HP, avatar, quick stats+links.
 */
export default function Dashboard() {
  const { user, xp, hp, level, streak } = useAuth();

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-10 pt-5">
      <div className="glass-bg shadow-xl rounded-2xl px-6 py-8 flex flex-col items-center mb-2">
        <Avatar />
        <div className="flex flex-col gap-3 w-full">
          <div className="w-full flex flex-row justify-between gap-2 mt-5">
            <XPBar xp={xp} level={level} />
            <HPBar hp={hp} />
          </div>
          <div className="w-full flex flex-row justify-between gap-3 mt-6">
            <StatCard label="Quest Streak" value={`${streak} days`} icon="🔥" />
            <StatCard label="Current Level" value={level} icon="⭐" />
            <StatCard label="Inventory" value={<Link to="/inventory" className="underline text-kaviaAccent hover:text-b993ff">View</Link>} icon="🎁" />
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <Link to="/quest-log" className="glass-bg rounded-xl shadow-md p-5 hover:ring-2 hover:ring-kaviaAccent transition cursor-pointer flex flex-col items-center neon-glow">
          <span className="text-xl mb-1">📜</span>
          <span className="font-semibold text-lg">Quest Log</span>
          <span className="text-xs text-white/60 mt-2">All quests & tasks</span>
        </Link>
        <Link to="/boss" className="glass-bg rounded-xl shadow-md p-5 hover:ring-2 hover:ring-kaviaAccent transition cursor-pointer flex flex-col items-center neon-glow">
          <span className="text-xl mb-1">👹</span>
          <span className="font-semibold text-lg">Boss Battle</span>
          <span className="text-xs text-white/60 mt-2">Face urgent deadlines</span>
        </Link>
        <Link to="/focus" className="glass-bg rounded-xl shadow-md p-5 hover:ring-2 hover:ring-kaviaAccent transition cursor-pointer flex flex-col items-center neon-glow">
          <span className="text-xl mb-1">⏳</span>
          <span className="font-semibold text-lg">Focus Engine</span>
          <span className="text-xs text-white/60 mt-2">Boost concentration</span>
        </Link>
        <Link to="/calendar-sync" className="glass-bg rounded-xl shadow-md p-5 hover:ring-2 hover:ring-kaviaAccent transition cursor-pointer flex flex-col items-center neon-glow">
          <span className="text-xl mb-1">🗓️</span>
          <span className="font-semibold text-lg">Calendar Sync</span>
          <span className="text-xs text-white/60 mt-2">Import events as Bosses</span>
        </Link>
      </div>
    </div>
  );
}
