/*
  Dashboard (The Kingdom) – fantasy RPG dashboard with XP/HP bars, glowing avatar, core zones (Focus Forest, Deadline Dungeon, Daily Hills),
  floating quest orb, and RPG neon/fantasy visuals. Responsive and mobile-ready.
*/
import React from "react";
import PropTypes from "prop-types";
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

/*
 * Dashboard page constants: demo art/zone listings – swap out for game art!
 */
const HERO_BANNER =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80";

const ZONES = [
  {
    name: "Focus Forest",
    description: "Enter deep work, earn XP, defeat distractions.",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=320&q=80",
    to: "/focus",
  },
  {
    name: "Deadline Dungeon",
    description: "Face your deadlines in dramatic RPG boss fights.",
    image: "https://opengameart.org/sites/default/files/preview_128.png",
    to: "/bossbattle",
  },
  {
    name: "Daily Hills",
    description: "Complete daily quests for streak and coin rewards.",
    image:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=320&q=80",
    to: "/questlog",
  },
];

function DashboardHeader() {
  return (
    <header className="w-full flex flex-col items-center mt-2 px-2 mb-0">
      <h1
        className="font-cinzel text-4xl md:text-5xl neon-glow text-accent mb-2 text-center drop-shadow-2xl"
        style={{
          textShadow:
            "0 0 26px #c084fc99, 0 0 82px #ad54f544, 0 0 16px #ffccfa66",
          fontFamily: "'Cinzel Decorative','UnifrakturCook','Poppins',serif",
          letterSpacing: "0.03em",
        }}
      >
        The Kingdom
      </h1>
      <div className="text-base sm:text-lg font-semibold text-brand-orange text-center select-none animate-fadeIn mb-2">
        Welcome to your <span className="text-accent font-bold">Legendary Dashboard</span>.
        <span className="block text-textFaded font-normal mt-1">
          <span className="text-accent">Track your XP, quests, and heroic progress.</span>
        </span>
      </div>
    </header>
  );
}

// PUBLIC_INTERFACE
/**
 * Dashboard – RPG home: XPBar, HPBar, Avatar, Stats, Zones, floating quest orb.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useUser();
  const { game } = useGame();

  // Essential stats, with default fallbacks
  const XP = game?.xp ?? 0;
  const MaxXP = game?.maxXp ?? 1000;
  const HP = game?.hp ?? 100;
  const MaxHP = game?.maxHp ?? 100;
  const Level = game?.level ?? 1;
  const Streak = game?.streak ?? 0;
  const Coins = game?.coins ?? 0;
  const avatarIdx =
    profile && profile.onboarding && profile.onboarding.avatarIdx != null
      ? profile.onboarding.avatarIdx
      : 0;

  // Floated quest orb shortcut (shows on main and as sticky on mobile)
  function QuickQuestOrb({ asMobile = false }) {
    // Desktop: absolute float; Mobile: sticky bar
    if (asMobile) {
      return (
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
      );
    } else {
      // Top-right floating orb
      return (
        <div className="absolute right-0 top-0 -mt-10 md:-mt-6 mr-2 md:mr-6 z-40 flex flex-col items-end animate-fadeIn">
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
  }
  // PropTypes validation for QuickQuestOrb
  QuickQuestOrb.propTypes = {
    asMobile: PropTypes.bool,
  };

  // Decorative overlay lines or particle accents (further immersion)
  function RPGZoneBottomAccent() {
    return (
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full h-[96px] pointer-events-none z-10 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 60% 100%, #a78bfa2a 0, transparent 72%), linear-gradient(90deg, #a78bfa19 10%, #e87a4123 100%)",
        }}
      />
    );
  }

  // ---- RENDER ----
  return (
    <div className="relative flex flex-col w-full min-h-[62vh] items-center justify-center pb-5 px-1 overflow-x-hidden animate-fadeIn">
      <RPGNeonGradient />
      <DashboardHeader />
      {/* Floating orb for quick quest top-right */}
      <QuickQuestOrb />
      {/* Avatar + hero banner + stats: visually immersive, RPG neon/fantasy */}
      <div className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-7 mb-4 px-2 sm:px-5">
        <div className="flex flex-1 items-center justify-center">
          <div
            className="rpg-rounded overflow-hidden hero-fantasy-bg border border-accent/40 neon-accent shadow-xl flex items-center p-3 relative"
            style={{
              minWidth: 120,
              backgroundImage: `linear-gradient(188deg, #201143 72%, #8f61e7 290%), url('${HERO_BANNER}')`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              minHeight: "144px",
              boxShadow: "0 2px 57px 3px #a78bfa44, 0 0 13px #7c3aed44",
              borderTopLeftRadius: "22px",
              borderBottomRightRadius: "30px",
            }}
          >
            <Avatar
              size={96}
              demoIndex={avatarIdx}
              ringColor="#a74eff"
              alt="Hero Avatar"
            />
            <div className="ml-7 flex flex-col items-start justify-center gap-2">
              <span className="font-poppins font-extrabold text-2xl text-accent neon-glow drop-shadow-lg">
                Level {Level}
              </span>
              <XPBar xp={XP} maxXp={MaxXP} showPercent={false} />
              <HPBar hp={HP} maxHp={MaxHP} showPercent={false} />
              <span className="font-mono text-md text-green-400 mt-1 font-semibold">
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
      {/* --- RPG Zones Section (Focus Forest, Dungeon, Daily Hills) --- */}
      <section className="relative w-full max-w-4xl mt-9 z-10 select-none">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-stretch w-full">
          {ZONES.map((zone) => (
            <div key={zone.name} className="flex-1 min-w-[210px]">
              <ZoneCard
                name={zone.name}
                description={zone.description}
                image={zone.image}
                onClick={() => navigate(zone.to)}
              />
            </div>
          ))}
        </div>
        <RPGZoneBottomAccent />
      </section>
      {/* Mobile sticky quick stats/quest orb */}
      <QuickQuestOrb asMobile />
      {/* RPG ambient fantasy glow */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 mix-blend-color-dodge"
        style={{
          background:
            "radial-gradient(circle at 54% 22%, #7c3aed2a 10%, #0f172a 94%)",
          opacity: 0.81,
        }}
      ></div>
      {/* NeonCSS for RPG fantasy polish */}
      <style>
        {`
        .hero-fantasy-bg {
          background-blend-mode: overlay,multiply;
        }
        .rpg-rounded { border-radius: 18px; }
        .neon-accent, .neon-glow {
          filter: drop-shadow(0 0 18px #b28af9bb) drop-shadow(0 0 32px #7c3aed80);
        }
        .animate-fadeIn { animation: fadeInRPG .72s cubic-bezier(.67,0,.28,1) both;}
        @keyframes fadeInRPG {
          0%{opacity:0;transform:translateY(28px) scale(.97);}
          100%{opacity:1;transform:translateY(0) scale(1);}
        }
        `}
      </style>
    </div>
  );
}
