/* global setTimeout, setInterval, clearInterval */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { useUser } from "../context/UserContext";
import LottieAnim from "../components/LottieAnim";
import HPBar from "../components/HPBar";
import XPBar from "../components/XPBar";
import NeonButton from "../components/NeonButton";
import FloatingOrb from "../components/FloatingOrb";
import Toast from "../components/Toast";

const BOSS_ANIM = "/src/assets/boss-dragon.json";
const BOSS_MUSIC = "/src/assets/boss_theme.mp3";
const VICTORY_SOUND = "/src/assets/victory-bling.mp3";
const FAILURE_SOUND = "/src/assets/fail-hit.mp3";

const BOSS_CONFIG = {
  name: "Deadline Dragon",
  maxHp: 150,
  anim: BOSS_ANIM,
  combatTime: 60, // seconds for the battle
  intro: "Face your greatest foe! Can you beat the deadline and save the realm?",
  victoryText: "You defeated the Deadline Dragon! Legendary Focus and XP earned!",
  failText: "The boss overwhelmed you. Dust off and try again!",
  rewardXP: 210,
  hurtHP: 27
};

function playSound(src, volume = 1.0) {
  const audio = new window.Audio(src);
  audio.volume = volume;
  audio.loop = false;
  audio.play();
  return audio;
}

// PUBLIC_INTERFACE
/** BossBattle.jsx: Intense RPG dungeon/boss fight with Lottie boss, timer, music, themed visuals, live XP/HP, rewarding/failure logic. */
export default function BossBattle() {
  const { game, updateGame } = useGame();
  // const { user } = useUser(); // Unused variable
  const navigate = useNavigate();

  const [timer, setTimer] = useState(BOSS_CONFIG.combatTime);
  const [bossHp, setBossHp] = useState(BOSS_CONFIG.maxHp);
  const [bossDead, setBossDead] = useState(false);
  const [playerActing, setPlayerActing] = useState(false);
  const [battleEnded, setBattleEnded] = useState(false);
  const [result, setResult] = useState(null); // "win"|"fail"
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const audioRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (battleEnded || bossDead) return;
    if (timer <= 0) {
      setBattleEnded(true);
      doBattleEnd();
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [timer, battleEnded, bossDead]);

  // Music: Play/stop boss theme
  useEffect(() => {
    if (!battleEnded) {
      if (typeof window !== "undefined") {
        audioRef.current = new window.Audio(BOSS_MUSIC);
        // Silently fail if not found
        audioRef.current.volume = 0.36;
        audioRef.current.loop = true;
        audioRef.current.play().catch(() => null);
      }
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      };
    }
    // eslint-disable-next-line
  }, [battleEnded]);

  // Player action: "Attack" with animation
  function handleAttack() {
    if (playerActing || bossDead || battleEnded) return;
    setPlayerActing(true);
    const hit = Math.min(Math.floor(Math.random() * 30) + 14, bossHp);
    setTimeout(() => {
      setBossHp((hp) => Math.max(0, hp - hit));
      setPlayerActing(false);
      if (bossHp - hit <= 0) {
        setBossDead(true);
        setBattleEnded(true);
        setTimeout(doBattleEnd, 1200);
      } else {
        setToastMsg(`You strike! -${hit} HP to the boss.`);
        setShowToast(true);
      }
    }, 630);
  }

  // End of battle: Victory or Defeat → Update Firestore (XP/HP)
  async function doBattleEnd() {
    if (battleEnded) return;
    if (bossDead || bossHp <= 0) {
      setResult("win");
      setToastMsg(BOSS_CONFIG.victoryText);
      setShowToast(true);
      playSound(VICTORY_SOUND, 0.9);
      // Grant XP
      const xpGained = BOSS_CONFIG.rewardXP;
      await updateGame({ xp: (game.xp || 0) + xpGained });
    } else {
      setResult("fail");
      setToastMsg(BOSS_CONFIG.failText);
      setShowToast(true);
      playSound(FAILURE_SOUND, 0.85);
      // Take HP penalty
      const hpLost = BOSS_CONFIG.hurtHP;
      await updateGame({ hp: Math.max(0, (game.hp || 100) - hpLost) });
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  // Themed styling: neon/dungeon/animated overlay
  function BattleGlow() {
    return (
      <div
        className="absolute top-0 left-0 w-full h-full z-[-2] pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 20%, #a855f71d, #7c3aed55 40%, #150f31 90%)",
          WebkitBackdropFilter: "blur(0.5px)",
          backdropFilter: "blur(0.5px)",
          opacity: 0.91,
        }}
      />
    );
  }

  function BossStats() {
    return (
      <div className="flex flex-col gap-3 items-center w-full max-w-[350px] mx-auto neon-accent glass-morph p-5 border-2 border-accent/50 rpg-rounded shadow">
        <div className="flex items-center gap-3 justify-between w-full">
          <span className="font-bold text-accent text-xl">{BOSS_CONFIG.name}</span>
          <FloatingOrb size={38} color="#ef4444">
            <span className="text-2xl">🐲</span>
          </FloatingOrb>
        </div>
        <div className="mt-2 w-full">
          <HPBar hp={bossHp} maxHp={BOSS_CONFIG.maxHp} showPercent={false} />
        </div>
        <div className="flex items-center justify-between w-full mt-2 gap-2">
          <div className="text-white text-xs">
            Time Left: <span className={`font-bold ${timer < 8 ? "text-red-400 animate-pulse" : "text-accent"}`}>{timer}s</span>
          </div>
          <div className="font-mono text-brand-orange text-xs">Reward: +{BOSS_CONFIG.rewardXP} XP</div>
        </div>
      </div>
    );
  }

  function PlayerStats() {
    return (
      <div className="flex flex-col gap-1 items-center mt-2 mb-1 w-full max-w-[340px] neon-accent glass-morph p-4 border border-accent/30 rpg-rounded">
        <div className="w-full">
          <XPBar xp={game.xp || 0} maxXp={game.maxXp || 1000} />
        </div>
        <div className="mt-1 w-full">
          <HPBar hp={game.hp || 100} maxHp={game.maxHp || 100} />
        </div>
        <div className="font-bold text-brand-orange text-xs mt-1 mb-0">
          Level {game.level ?? 1}
          <span className="mx-2 text-accent">•</span>
          HP: {game.hp ?? 100}
        </div>
      </div>
    );
  }

  function MainBoss() {
    return (
      <div className="relative flex flex-col items-center mt-3">
        <div className="relative flex justify-center mb-1 z-10">
          <LottieAnim
            src={BOSS_CONFIG.anim}
            size={210}
            loop={!bossDead && !battleEnded}
            autoplay
          />
          {bossDead && (
            <div className="absolute inset-0 flex items-center justify-center">
              <FloatingOrb size={120} color="#7c3aed">
                <span className="text-5xl animate-bounce">✨</span>
              </FloatingOrb>
            </div>
          )}
        </div>
      </div>
    );
  }

  function ActionButton() {
    return (
      <NeonButton
        onClick={handleAttack}
        disabled={playerActing || bossDead || battleEnded}
        className={
          "mt-4 px-10 py-3 text-xl font-bold glowingBtn " +
          (playerActing
            ? " opacity-50 pointer-events-none"
            : " animate-glowPulse cursor-pointer")
        }
        variant="accent"
        style={{
          textShadow: "0 0 5px #fff, 0 0 20px #c084fc",
          boxShadow: "0 0 18px 4px #7c3aed99, 0 0 4px 2px #7c3aed",
        }}
        aria-label="Attack the boss"
      >
        {bossDead
          ? "Victory!"
          : timer <= 0 || battleEnded
          ? "End"
          : playerActing
          ? "Attacking..."
          : "Attack!"}
      </NeonButton>
    );
  }

  function ResultFeedback() {
    if (!result) return null;
    return (
      <div className="absolute top-[20dvh] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center text-center animate-fadeIn px-4">
        {result === "win" ? (
          <>
            <div className="text-5xl font-bold text-brand-orange mb-2 drop-shadow-lg animate-bounce">🏆</div>
            <div className="text-3xl text-accent font-bold mb-2 neon-accent">{BOSS_CONFIG.victoryText}</div>
            <div className="text-lg text-white mt-3">+{BOSS_CONFIG.rewardXP} XP</div>
            <NeonButton
              onClick={() => navigate("/dashboard")}
              className="mt-6 px-10 py-3 text-lg font-bold animate-pulse"
            >
              Return to Dashboard
            </NeonButton>
          </>
        ) : (
          <>
            <div className="text-5xl font-bold text-red-400 mb-1 drop-shadow-lg animate-bounce">☠️</div>
            <div className="text-2xl text-red-500 font-bold mb-2 neon-accent">{BOSS_CONFIG.failText}</div>
            <div className="text-lg text-white mt-2">You lost {BOSS_CONFIG.hurtHP} HP</div>
            <NeonButton
              onClick={() => {
                setResult(null);
                setBattleEnded(false);
                setBossHp(BOSS_CONFIG.maxHp);
                setTimer(BOSS_CONFIG.combatTime);
              }}
              className="mt-5 px-10 py-3 text-lg font-bold animate-glowPulse"
              variant="accent"
            >
              Try Again
            </NeonButton>
            <NeonButton
              onClick={() => navigate("/dashboard")}
              className="mt-2 px-10 py-2 text-md font-bold"
              variant="orange"
            >
              Return to Dashboard
            </NeonButton>
          </>
        )}
      </div>
    );
  }

  // Neon/ambient battle effects (CSS keyframes)
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .glass-morph { background: rgba(22, 14, 50, 0.78); border-radius: 18px; backdrop-filter: blur(7px);}
      .glowingBtn, .animate-glowPulse {
        animation: pulseNeon 1.1s infinite alternate cubic-bezier(.64,0,.38,1);
      }
      @keyframes pulseNeon {
        0% { box-shadow: 0 0 18px 5px #7c3aed99, 0 0 4px 1.7px #7c3aed; }
        100% { box-shadow: 0 0 32px 11px #8b5cf6bb, 0 0 7px 1px #c084fc; }
      }
      .animate-fadeIn { animation: fadeInDungeon .75s cubic-bezier(.67,0,.28,1) both;}
      @keyframes fadeInDungeon {
        0% { opacity:0; transform:translateY(27px) scale(.96);}
        100%{opacity:1; transform:translateY(0) scale(1);}
      }
    `;
    document.body.appendChild(style);
    return () => document.body.removeChild(style);
  }, []);
  
  // Stop music on unmount
  useEffect(() => () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center relative z-10 animate-fadeIn">
      {/* 
        RPG Boss Battle Hero Art (public Unsplash/PD fantasy dragon) – devs: swap this src for custom boss art if desired!
        https://unsplash.com/photos/dragon-silhouette-on-body-of-water-during-sunset-oGLgDu90A9U 
      */}
      <img
        src="https://images.unsplash.com/photo-1504881102860-1da75ca5eeff?auto=format&fit=crop&w=700&q=80"
        alt="Boss battle: dragon silhouette"
        className="w-full max-w-md sm:max-w-lg mx-auto mb-4 rounded-xl border-2 border-accent shadow-lg object-cover"
        onError={e => {e.target.style.display='none'}}
        style={{background: "#120c22"}}
      />
      {/* Fallback: Dragon emoji if unavailable */}
      <span className="block text-6xl text-accent my-3" aria-label="Dragon" style={{display:'none'}}>
        🐉
      </span>
      {/* End boss hero image, devs can replace above for dramatic boss art */}
      <BattleGlow />
      <ResultFeedback />
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center z-20 relative py-7 rounded-xl bg-black/70 glass-morph" style={{boxShadow:"0 12px 34px 2px #7c3aed33"}}>
        <div className="mb-2 font-bold text-2xl text-brand-orange drop-shadow-sm text-center select-none">{BOSS_CONFIG.intro}</div>
        <BossStats />
        <MainBoss />
        {timer > 0 && !battleEnded && !bossDead && <ActionButton />}
        <PlayerStats />
      </div>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMsg}
        type={result === "fail" ? "error" : "accent"}
      />
    </div>
  );
}
