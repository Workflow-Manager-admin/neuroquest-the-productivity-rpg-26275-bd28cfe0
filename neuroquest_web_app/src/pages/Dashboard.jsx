/*
  Dashboard (The Kingdom) – fantasy RPG dashboard with XP/HP bars, glowing avatar, core zones (Focus Forest, Deadline Dungeon, Daily Hills),
  floating quest orb, and RPG neon/fantasy visuals. Responsive and mobile-ready.
*/
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useGame } from "../context/GameContext";
import XPBar from "../components/XPBar";
import HPBar from "../components/HPBar";
import Avatar from "../components/Avatar";
import StatsPanel from "../components/StatsPanel";
import FloatingOrb from "../components/FloatingOrb";
import NeonButton from "../components/NeonButton";
import ZoneCard from "../components/ZoneCard";

/*
  ASSET NOTE:
  Replace the zone/hero/skin images with your own art in /src/assets for full-fantasy immersion.
  Current demo uses public domain art. ZoneCard will fallback to fantasy stock if image fails.
*/

// Main RPG neon background/overlay
function RPGNeonGradient() {
  return (
    <div
      className="absolute inset-0 pointer-events-none -z-10"
      aria-hidden
      style={{
        background: `
          radial-gradient(ellipse at 55% 12%, #9f63f236 0%, transparent 54%),
          radial-gradient(ellipse at 30% 80%, #fbbf2462 0%, transparent 74%),
          linear-gradient(135deg, #1d1632 70%, #6047a888 100%)
        `,
        opacity: 0.97,
      }}
    ></div>
  );
}
/**
 * Fantasy hero/zones image logic:
 * - HERO_BANNER: public domain fantasy wizard/forest as example. Replace URL with your own asset for polish.
 * - ZONES: each uses a fantasy public URL demo image. Drop your own PNGs/SVGs in /src/assets and update here.
 */
const HERO_BANNER =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"; // Fantasy woods/hero (Unsplash, demo)

const ZONES = [
  {
    name: "Focus Forest",
    description: "Enter deep work, earn XP, defeat distractions.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=320&q=80", // Fantasy forest
    // TODO: Drop your zone art in /src/assets and update image value for production!
    to: "/focus",
  },
  {
    name: "Deadline Dungeon",
    description: "Face your deadlines in dramatic RPG boss fights.",
    image: "https://opengameart.org/sites/default/files/preview_128.png", // Dungeon (Opengameart)
    // TODO: Swap with /src/assets/zone_dungeon.png if added!
    to: "/bossbattle",
  },
  {
    name: "Daily Hills",
    description: "Complete daily quests for streak and coin rewards.",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=320&q=80", // Fantasy hills Unsplash
    // TODO: Swap with /src/assets/zone_hills.png
    to: "/questlog",
  },
];

/* Removed unused getEquippedItems. */

// PUBLIC_INTERFACE
/**
 * Dashboard – RPG home: XPBar, HPBar, Avatar, Stats, Zones, floating quest orb.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useUser();
  const { game } = useGame();

  // fallback for quick skeleton state
  const XP = game?.xp ?? 0;
  const MaxXP = game?.maxXp ?? 1000; // Should come from level system or next-level mark
  const HP = game?.hp ?? 100;
  const MaxHP = game?.maxHp ?? 100;
  const Level = game?.level ?? 1;
  const Streak = game?.streak ?? 0;
  const Coins = game?.coins ?? 0;
  const avatarIdx =
    (profile && profile.onboarding && profile.onboarding.avatarIdx != null)
      ? profile.onboarding.avatarIdx
      : 0;

  // "Quick Quest" orb shortcut - links to questlog (could be modal in future)
  function QuickQuestOrb() {
    return (
      <div className="absolute right-0 top-0 -mt-10 md:-mt-6 mr-2 md:mr-6 z-40 flex flex-col items-end">
        <FloatingOrb size={78} color="#c084fc" >
          <button
            type="button"
            onClick={() => navigate("/questlog")}
            aria-label="Open Quest Log"
            className="focus:outline-none"
            style={{ width: "100%", height: "100%", background: "none" }}
          >
            <span className="text-brand-orange text-2xl md:text-3xl drop-shadow-lg" role="img" aria-label="Quest">🧭</span>
            <div className="text-sm font-bold text-accent -mt-1">Quest</div>
          </button>
        </FloatingOrb>
      </div>
    );
  }

  // Main responsive RPG layout
  return (
    <div className="relative flex flex-col w-full min-h-[60vh] items-center justify-center">
      {/* Floating orb for quick quest (top-right, overlaps) */}
      <QuickQuestOrb />

      {/* Fantasy RPG hero/zone banner */}
      <div
        className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-7 mb-4 px-2 sm:px-5"
      >
        <div className="flex flex-1 items-center justify-center">
          <div
            className="rpg-rounded overflow-hidden hero-fantasy-bg border border-accent/40 shadow-neon-accent flex items-center p-3"
            style={{
              minWidth: 120,
              backgroundImage: `linear-gradient(180deg,#26063b 64%,#8f61e7 150%), url('${HERO_BANNER}')`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              minHeight: "144px"
            }}
          >
            <Avatar
              size={90}
              demoIndex={avatarIdx}
              ringColor="#a74eff"
              alt="Hero Avatar"
            />
            <div className="ml-7 flex flex-col items-start justify-center">
              <span className="font-poppins font-extrabold text-2xl text-accent neon-glow drop-shadow-lg">
                Level {Level}
              </span>
              <XPBar xp={XP} maxXp={MaxXP} showPercent={false} />
              <HPBar hp={HP} maxHp={MaxHP} showPercent={false} />
              <span className="font-mono text-md text-green-400 mt-1">
                Streak: {Streak}🔥
              </span>
            </div>
          </div>
        </div>
        {/* Quick Stats Panel and Actions */}
        <div className="flex flex-col items-center justify-between gap-2 flex-1 mt-3 sm:mt-0">
          <StatsPanel
            stats={{
              level: Level,
              streak: Streak,
              xp: XP,
              coins: Coins,
            }}
          />
          <div className="flex flex-row gap-3 mt-5">
            <NeonButton
              onClick={() => navigate("/inventory")}
              variant="accent"
              className="px-4 py-2"
            >
              <span className="mr-2">🎒</span> Inventory
            </NeonButton>
            <NeonButton
              onClick={() => navigate("/settings")}
              variant="orange"
              className="px-4 py-2"
            >
              <span className="mr-1">⚙️</span> Settings
            </NeonButton>
          </div>
        </div>
      </div>

      {/* Zones Section */}
      <div className="relative w-full max-w-4xl mt-8 z-10">
        <div className="flex flex-col md:flex-row gap-5 md:gap-8 justify-center items-stretch w-full">
          {ZONES.map((zone, idx) => (
            <div key={zone.name} className="flex-1 min-w-[220px]">
              <ZoneCard
                name={zone.name}
                description={zone.description}
                image={zone.image}
                onClick={() => navigate(zone.to)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile sticky quick stats & quest orb (for mobile layout only) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 md:hidden flex gap-4 items-center bg-black/70 rpg-rounded neon-accent border border-accent/40 px-4 py-2 shadow-lg">
        <FloatingOrb size={52} color="#7c3aed">
          <button
            type="button"
            onClick={() => navigate("/questlog")}
            aria-label="Quest"
            className="focus:outline-none w-full h-full bg-none text-accent"
          >
            <span role="img" aria-label="Quest" className="text-2xl">
              🧭
            </span>
          </button>
        </FloatingOrb>
        <div className="flex flex-row items-center gap-4">
          <div className="font-bold text-accent">LV {Level}</div>
          <div className="font-mono text-green-400">🔥{Streak}</div>
          <div className="text-brand-orange font-bold">XP {XP}</div>
          <div className="text-yellow-400 font-bold">🪙{Coins}</div>
        </div>
      </div>

      {/* RPG Background effect (can be swapped for Lottie/starfield/parallax) */}
      <div
        className="absolute inset-0 -z-1 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 60% 15%, #7c3aed22 10%, #0f172a 87%)",
          opacity: "0.85",
        }}
      ></div>
    </div>
  );
}
