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
import classNames from "classnames";

// Demo images (real images should be placed at /src/assets/)
const ZONES = [
  {
    name: "Focus Forest",
    description: "Enter deep work, earn XP, defeat distractions.",
    image: "/src/assets/zone_forest.png",
    to: "/focus",
  },
  {
    name: "Deadline Dungeon",
    description: "Face your deadlines in dramatic RPG boss fights.",
    image: "/src/assets/zone_dungeon.png",
    to: "/bossbattle",
  },
  {
    name: "Daily Hills",
    description: "Complete daily quests for streak and coin rewards.",
    image: "/src/assets/zone_hills.png",
    to: "/questlog",
  },
];

function getEquippedItems(inventory = []) {
  // Inventory shape: [{ name, slot, image, equipped }]
  // For future extension: return array of items where equipped===true, grouped by slot
  return (inventory || []).filter((item) => item.equipped);
}

// PUBLIC_INTERFACE
/**
 * Dashboard – RPG home: XPBar, HPBar, Avatar, Stats, Zones, floating quest orb.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading: loadingUser } = useUser();
  const { game, loading: loadingGame } = useGame();

  // fallback for quick skeleton state
  const XP = game?.xp ?? 0;
  const MaxXP = game?.maxXp ?? 1000; // Should come from level system or next-level mark
  const HP = game?.hp ?? 100;
  const MaxHP = game?.maxHp ?? 100;
  const Level = game?.level ?? 1;
  const Streak = game?.streak ?? 0;
  const Coins = game?.coins ?? 0;
  const equippedItems = getEquippedItems(game?.inventory);
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

      {/* Top Section: Avatar + Quick Stats/XP/HP */}
      <div
        className={classNames(
          "w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-stretch gap-8 mt-0 md:mt-6 z-10 mb-2",
        )}
      >
        {/* Avatar with equipped items ring */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/3 max-w-xs">
          <div className="mb-3 relative">
            <Avatar
              size={100}
              demoIndex={avatarIdx}
              ringColor="#7c3aed"
              alt="Your Avatar"
            />
            {/* Equipped items overlays - simple demo for now */}
            {equippedItems?.length > 0 && (
              <div className="absolute top-0 right-0">
                <img
                  src={equippedItems[0]?.image}
                  alt={equippedItems[0]?.name}
                  className="w-8 h-8 rpg-rounded border-2 border-accent glowing"
                  style={{ boxShadow: "0 0 10px #e87a4180" }}
                  title={equippedItems[0]?.name}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-accent font-bold text-lg drop-shadow">
              Level {Level}
            </span>
            <div className="min-w-[120px] w-full">
              <XPBar xp={XP} maxXp={MaxXP} showPercent={false} />
            </div>
            <div className="min-w-[120px] w-full mt-1">
              <HPBar hp={HP} maxHp={MaxHP} showPercent={false} />
            </div>
            <div className="font-mono text-sm text-green-400 mt-1">
              Streak: {Streak}🔥
            </div>
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/3 mt-6 md:mt-0">
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
      <div className="relative w-full max-w-4xl mt-10 z-10">
        <div className="flex flex-col md:flex-row gap-5 md:gap-8 justify-center items-stretch w-full">
          {ZONES.map((zone) => (
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
