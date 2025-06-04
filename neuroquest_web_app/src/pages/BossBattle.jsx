import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { useAudio } from "../components/AudioPlayer";
import HPBar from "../components/HPBar";
import XPBar from "../components/XPBar";
import NeonButton from "../components/NeonButton";
import FloatingOrb from "../components/FloatingOrb";
import LottieAnim from "../components/LottieAnim";
import Toast from "../components/Toast";

/**
 * Constants for Boss Battle (can be refactored for future extensibility)
 * Boss can be made dynamic (various types), but for now, single "Deadline Dragon".
 */
const BOSS_ANIM = "/src/assets/boss-dragon.json";
const BOSS_COMBAT_TIME = 60;
const BOSS_MUSIC = "/src/assets/boss_theme.mp3";
const VICTORY_SOUND = "/src/assets/victory-bling.mp3";
const FAILURE_SOUND = "/src/assets/fail-hit.mp3";

const BOSS_CONFIG = {
  name: "Deadline Dragon",
  anim: BOSS_ANIM,
  maxHp: 150,
  combatTime: BOSS_COMBAT_TIME,
  intro: "Face your greatest foe! Can you beat the deadline and save the realm?",
  victoryText: "You defeated the Deadline Dragon! Legendary Focus and XP earned!",
  failText: "The boss overwhelmed you. Dust off and try again!",
  rewardXP: 210,
  hurtHP: 27
};

/**
 * Stub for sound FX; can later add complex event-driven sound manager.
 */
function playSoundStub(src, volume = 1.0) {
  if (!src) return;
  try {
    const audio = new window.Audio(src);
    audio.volume = volume;
    audio.loop = false;
    audio.play();
    return audio;
  } catch (e) {
    // Silent stub fail
  }
}

/**
 * PUBLIC_INTERFACE
 * BossBattle.jsx – Fully immersive, animated, dynamic boss battle experience.
 * Features:
 * - Countdown timer
 * - Animated Lottie RPG boss
 * - Neon glowing HP/XP bars
 * - Event-driven sound FX stub
 * - Responsive and mobile-first
 * - Dramatic neon/fantasy CSS effects
 * - Placeholder for Lottie FX overlays
 */
export default function BossBattle() {
  const { game, updateGame } = useGame();
  const navigate = useNavigate();
  const { switchTheme } = useAudio();
  const [timer, setTimer] = useState(BOSS_CONFIG.combatTime);
  const [bossHp, setBossHp] = useState(BOSS_CONFIG.maxHp);
  const [bossDead, setBossDead] = useState(false);
  const [playerActing, setPlayerActing] = useState(false);
  const [battleEnded, setBattleEnded] = useState(false);
  const [result, setResult] = useState(null); // 'win' | 'fail'
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    switchTheme("boss");
    // eslint-disable-next-line
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (battleEnded || bossDead) return;
    if (timer <= 0) {
      setBattleEnded(true);
      doBattleEnd();
      return;
    }
    const i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
    // eslint-disable-next-line
  }, [timer, battleEnded, bossDead]);

  // Attack player action
  function handleAttack() {
    if (playerActing || bossDead || battleEnded) return;
    setPlayerActing(true);
    // Randomized but dramatic attack
    const hit = Math.min(Math.round(Math.random() * 25) + 11, bossHp);
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
      // Dramatic hit sound (stub)
      playSoundStub(FAILURE_SOUND, 0.28);
    }, 530);
  }

  // End battle: Victory/failure, update player XP/HP
  async function doBattleEnd() {
    if (battleEnded) return;
    if (bossDead || bossHp <= 0) {
      setResult("win");
      setToastMsg(BOSS_CONFIG.victoryText);
      setShowToast(true);
      playSoundStub(VICTORY_SOUND, 0.91);
      const xpGained = BOSS_CONFIG.rewardXP;
      await updateGame({ xp: (game.xp || 0) + xpGained });
    } else {
      setResult("fail");
      setToastMsg(BOSS_CONFIG.failText);
      setShowToast(true);
      playSoundStub(FAILURE_SOUND, 1.0);
      const hpLost = BOSS_CONFIG.hurtHP;
      await updateGame({ hp: Math.max(0, (game.hp ?? 100) - hpLost) });
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  // Neon/fantasy themed background glow/accent
  function BattleGlowBg() {
    return (
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-[0]"
        style={{
          background:
            "radial-gradient(circle at 50% 15%, #a855f769 0%, #271755ee 80%, #0f172a 100%)",
          opacity: 0.94,
        }}
        aria-hidden
      />
    );
  }

  // Boss visual + neon/neumorphic frame
  function BossVisual() {
    return (
      <div className="relative flex flex-col items-center mt-4 mb-2 animate-fadeIn">
        <div className="relative">
          <LottieAnim
            src={BOSS_CONFIG.anim}
            size={218}
            loop={!bossDead && !battleEnded}
            autoplay
          />
          {bossDead && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Victory effect: floating sparkles orb */}
              <FloatingOrb size={130} color="#a78bfa">
                <span className="text-6xl animate-bounce">✨</span>
              </FloatingOrb>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Timer, Boss HP, Reward info card
  function BossStatsPanel() {
    return (
      <div className="flex flex-col gap-3 items-center w-full max-w-[350px] mx-auto neon-accent glass-morph p-6 border-2 border-accent/60 rpg-rounded shadow">
        <div className="flex items-center gap-3 justify-between w-full">
          <span className="font-bold text-accent text-xl">{BOSS_CONFIG.name}</span>
          <FloatingOrb size={38} color="#ff5d51">
            <span className="text-2xl">🐲</span>
          </FloatingOrb>
        </div>
        <div className="w-full mt-2">
          <HPBar hp={bossHp} maxHp={BOSS_CONFIG.maxHp} showPercent={false} />
        </div>
        <div className="flex justify-between items-center w-full mt-2 text-xs">
          <div>
            Time Left:{" "}
            <span
              className={`font-bold ${
                timer < 10 ? "text-red-400 animate-pulse" : "text-accent"
              }`}
            >
              {timer}s
            </span>
          </div>
          <div className="font-mono text-brand-orange">
            Reward: +{BOSS_CONFIG.rewardXP} XP
          </div>
        </div>
      </div>
    );
  }

  // Player stats panel (XP/HP/Level)
  function PlayerPanel() {
    return (
      <div className="flex flex-col gap-1 items-center w-full max-w-[340px] neon-accent glass-morph p-4 border border-accent/30 rpg-rounded mt-3">
        <XPBar xp={game.xp || 0} maxXp={game.maxXp || 1000} />
        <div className="mt-1 w-full">
          <HPBar hp={game.hp ?? 100} maxHp={game.maxHp ?? 100} />
        </div>
        <div className="font-bold text-brand-orange text-xs mt-1 mb-0">
          Level {game.level ?? 1}
          <span className="mx-2 text-accent">•</span> HP: {game.hp ?? 100}
        </div>
      </div>
    );
  }

  // Main action button (Attack)
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
          boxShadow: "0 0 18px 4px #a78bfa99, 0 0 4px 2px #a78bfa",
        }}
        aria-label="Attack"
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

  // Result/feedback overlay: victory/failure, return/try again
  function ResultFeedback() {
    if (!result) return null;
    return (
      <div className="absolute top-[21dvh] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center text-center animate-fadeIn px-4">
        {result === "win" ? (
          <>
            <div className="text-6xl font-bold text-brand-orange mb-2 drop-shadow-lg animate-bounce">🏆</div>
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

  // Dramatic RPG/fantasy neon-glow CSS injection for immersive polish
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .glass-morph { background: rgba(23, 17, 44, 0.825); border-radius: 19px; backdrop-filter: blur(9px);}
      .glowingBtn, .animate-glowPulse {
        animation: pulseNeon 1.13s infinite alternate cubic-bezier(.68,0,.34,1);
      }
      @keyframes pulseNeon {
        0% { box-shadow: 0 0 18px 6px #a78bfa88, 0 0 4px 2px #7c3aed; }
        100% { box-shadow: 0 0 34px 16px #c084fcbb, 0 0 12px 2px #c084fc; }
      }
      .animate-fadeIn { animation: fadeInBattle .65s cubic-bezier(.67,0,.28,1) both;}
      @keyframes fadeInBattle {
        0% { opacity:0; transform:translateY(29px) scale(.97);}
        100%{opacity:1; transform:translateY(0) scale(1);}
      }
    `;
    document.body.appendChild(style);
    return () => document.body.removeChild(style);
  }, []);

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center z-10 animate-fadeIn pb-12">
      {/* Boss battle dramatic background */}
      <BattleGlowBg />
      {/* Top: Dragon hero art */}
      <img
        src="https://images.unsplash.com/photo-1504881102860-1da75ca5eeff?auto=format&fit=crop&w=700&q=80"
        alt="Boss battle: dragon silhouette"
        className="w-full max-w-md sm:max-w-lg mx-auto mb-4 rounded-xl border-2 border-accent shadow-lg object-cover"
        onError={e => {e.target.style.display='none'}}
        style={{background: "#120c22"}}
      />
      {/* Fallback dragon emoji for failed image */}
      <span className="block text-6xl text-accent my-3" aria-label="Dragon" style={{display:'none'}}>🐉</span>
      {/* Overlay result feedback (centered over everything, dramatic) */}
      <ResultFeedback />
      {/* Main card: boss stats, boss visual, attack button, player stats */}
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center z-20 relative py-6 rounded-xl bg-black/70 glass-morph" style={{boxShadow:"0 12px 34px 2px #7c3aed33"}}>
        <div className="mb-2 font-bold text-2xl text-brand-orange drop-shadow-sm text-center select-none">{BOSS_CONFIG.intro}</div>
        <BossStatsPanel />
        <BossVisual />
        {timer > 0 && !battleEnded && !bossDead && <ActionButton />}
        <PlayerPanel />
        {/* Lottie animation placeholder for special FX (e.g. particle burst, boss death) */}
        <div className="pointer-events-none mt-1 mb-0" aria-hidden>
          {/* <LottieAnim src="/src/assets/victory-fx.json" size={76} loop={false} autoplay /> */}
        </div>
      </div>
      {/* Toast: Dramatic RPG feedback */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMsg}
        type={result === "fail" ? "error" : "accent"}
      />
    </div>
  );
}
