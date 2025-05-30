import React, { useEffect, useState } from "react";
import NeonButton from "../components/NeonButton";
import FloatingOrb from "../components/FloatingOrb";
import LottieAnim from "../components/LottieAnim";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import { useUser } from "../context/UserContext";
import { useGame } from "../context/GameContext";

/**
 * RPG-inspired themed settings panel for NeuroQuest RPG
 * - Toggle dark/light mode, animations
 * - Change goal (shows modal)
 * - Log out using Firebase
 * - All settings persist to Firestore/context
 * - Modals and animated feedback for critical actions
 * - Visual neon RPG polish, Lottie, fully responsive
 * - Accessible and mobile-friendly
 */

// Lottie asset paths (replace with your Lottie JSONs as desired)
const SETTINGS_LOTTIE = "/src/assets/settings-cog.json";
const CONFIRM_LOTTIE = "/src/assets/confirm-magic.json";
const SUCCESS_LOTTIE = "/src/assets/success-glow.json";
const DARK_LOTTIE = "/src/assets/dark-mode-orb.json";
const GOAL_LOTTIE = "/src/assets/magic-scroll.json";

const DEMO_AVATAR =
  "/src/assets/wizard_hero_01.png"; // fallback for header

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// PUBLIC_INTERFACE
export default function Settings() {
  // Context state
  const { game, updateGame, setTheme } = useGame();
  const { user, profile, updateProfile, logout } = useUser();

  // UI state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAnimModal, setShowAnimModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "accent" });

  // Preferences: derive from context (fallback to defaults)
  const [theme, setThemeState] = useState(game?.theme || "auto"); // 'dark' | 'light' | 'auto'
  const [animations, setAnimations] = useState(
    profile?.preferences?.animations ?? true
  );
  const [goal, setGoal] = useState(profile?.onboarding?.goal ?? "");
  const [goalInput, setGoalInput] = useState(goal);
  const [goalSaving, setGoalSaving] = useState(false);

  // Reflect context changes
  useEffect(() => {
    setThemeState(game?.theme || "auto");
  }, [game?.theme]);
  useEffect(() => {
    setAnimations(profile?.preferences?.animations ?? true);
    setGoal(profile?.onboarding?.goal ?? "");
    setGoalInput(profile?.onboarding?.goal ?? "");
  }, [profile]);

  // --- Preference Toggles ---
  const handleThemeToggle = (val) => {
    setThemeState(val);
    setShowThemeModal(true);
    setTheme(val);
    updateGame({ theme: val });
    setToast({
      show: true,
      msg:
        val === "dark"
          ? "Embraced the shadow realm! (Dark Mode)"
          : val === "light"
            ? "Blessed by sunlight! (Light Mode)"
            : "Theme set to auto.",
      type: "accent",
    });
    setTimeout(() => setShowThemeModal(false), 1200);
  };

  const handleAnimationsToggle = async (val) => {
    setAnimations(val);
    setShowAnimModal(true);
    await updateProfile({
      preferences: { ...(profile?.preferences || {}), animations: val },
    });
    setTimeout(() => setShowAnimModal(false), 1200);
    setToast({
      show: true,
      msg: val
        ? "Enchanted animations activated! ✨"
        : "Animations disabled. The world grows still.",
      type: "accent",
    });
  };

  // --- Change Goal ---
  const handleGoalSave = async () => {
    if (!goalInput.trim() || goalInput === goal) {
      setShowGoalModal(false);
      return;
    }
    setGoalSaving(true);
    try {
      await updateProfile({
        onboarding: {
          ...profile?.onboarding,
          goal: goalInput,
        },
      });
      setGoal(goalInput);
      setToast({
        show: true,
        msg: "Main quest updated!",
        type: "success",
      });
      setShowGoalModal(false);
    } catch (e) {
      setToast({
        show: true,
        msg: "Failed to update quest. Try again.",
        type: "error",
      });
    }
    setGoalSaving(false);
  };

  // --- Logout ---
  const handleLogout = async () => {
    setSaving(true);
    try {
      await logout();
      setToast({
        show: true,
        msg: "You have left the realm. Come back soon, hero!",
        type: "success",
      });
      setShowLogoutModal(false);
      // Optionally, redirect or reload app here.
    } catch (e) {
      setToast({
        show: true,
        msg: "Logout failed.",
        type: "error",
      });
    }
    setSaving(false);
  };

  // == Panels ==

  // Toggle switch: RPG neon
  function NeonSwitch({ checked, onChange, label, icon, accent }) {
    return (
      <button
        onClick={() => onChange(!checked)}
        className={classNames(
          "w-full flex items-center justify-between rpg-rounded px-5 py-3 my-2 bg-black/60 neon-accent border-2 transition shadow",
          checked
            ? accent
              ? `shadow-[0_0_16px_${accent}] border-accent`
              : "border-accent"
            : "border-accent/30"
        )}
        type="button"
        tabIndex={0}
        aria-pressed={checked}
      >
        <span className="flex items-center gap-2 font-bold text-accent text-lg">
          {icon && (
            <span
              className="text-xl"
              style={{ textShadow: "0 0 5px #fff, 0 0 10px #a78bfa" }}
            >
              {icon}
            </span>
          )}
          {label}
        </span>
        <span
          className={classNames(
            "inline-flex ml-2 w-12 h-7 rpg-rounded neon-accent cursor-pointer relative transition",
            checked ? "bg-accent/80" : "bg-gray-700"
          )}
        >
          <span
            className={classNames(
              "absolute left-1 top-[4px] w-4 h-4 rpg-rounded transition-all duration-200",
              checked
                ? "translate-x-5 bg-brand-orange shadow-[0_0_8px_2px_#e87a41]"
                : "bg-white"
            )}
            style={{
              transition: "transform 0.21s cubic-bezier(0.7,0,.21,1)",
              transform: checked ? "translateX(22px)" : "translateX(0)",
            }}
          />
        </span>
      </button>
    );
  }

  // Theme select block: RPG style
  function ThemeSelector() {
    return (
      <div className="flex flex-col items-stretch gap-2 my-3">
        <div className="font-bold text-brand-orange text-lg mb-2">
          Theme: <span className="text-accent">{themeLabel(theme)}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {["auto", "light", "dark"].map((t) => (
            <button
              key={t}
              onClick={() => handleThemeToggle(t)}
              disabled={theme === t}
              className={classNames(
                "font-bold px-5 py-2 rpg-rounded neon-accent border-2 shadow transition",
                theme === t
                  ? "bg-accent text-white ring-2 ring-brand-orange"
                  : "bg-black/70 text-accent hover:bg-accent/20",
                "flex-1 min-w-[90px]"
              )}
              aria-pressed={theme === t}
              tabIndex={0}
              type="button"
            >
              {t === "auto" ? (
                <>
                  <span className="mr-2">🪄</span>Auto
                </>
              ) : t === "dark" ? (
                <>
                  <span className="mr-2">🌌</span>Dark
                </>
              ) : (
                <>
                  <span className="mr-2">🌞</span>Light
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Goal panel (show/change)
  function GoalPanel() {
    return (
      <div className="w-full flex flex-col gap-2 rpg-rounded bg-[#150e3231] border border-accent/30 neon-accent p-4 shadow mt-2 mb-3">
        <div className="font-bold text-accent mb-1 flex items-center gap-2">
          <span className="text-lg">🎯</span> Main Quest
        </div>
        <div className="text-brand-orange font-semibold mb-1">{goal ? goal : "No quest set."}</div>
        <NeonButton onClick={() => setShowGoalModal(true)} variant="accent" className="px-4 py-2 mt-0 max-w-xs">
          <span className="mr-1">📝</span>Change Main Quest
        </NeonButton>
      </div>
    );
  }

  // Logout panel
  function LogoutPanel() {
    return (
      <div className="flex justify-center my-6">
        <NeonButton
          onClick={() => setShowLogoutModal(true)}
          variant="orange"
          className="px-7 py-3 font-bold text-lg"
        >
          <span className="mr-2">🚪</span>Logout
        </NeonButton>
      </div>
    );
  }

  // ======= Modals =======

  function AnimateModal({ open, onClose, type }) {
    let lottie = null, text = "", accent = "#7c3aed", icon = null;
    if (type === "theme") {
      lottie = DARK_LOTTIE;
      accent = theme === "dark" ? "#2e19df" : "#fae264";
      text =
        theme === "dark"
          ? "Darkness engulfs your journey…"
          : theme === "light"
            ? "Radiance lights your path!"
            : "Magic will decide your theme!";
      icon = theme === "dark" ? "🌌" : theme === "light" ? "🌞" : "🪄";
    } else if (type === "animations") {
      lottie = CONFIRM_LOTTIE;
      text = animations
        ? "Mystic animations are now ON!"
        : "All animations muted. Reality stabilizes.";
      accent = "#c084fc";
      icon = "✨";
    }
    return (
      <Modal open={open} onClose={onClose}>
        <div className="flex flex-col items-center gap-2 text-center">
          <FloatingOrb size={78} color={accent}>
            <LottieAnim src={lottie} size={66} loop autoplay />
          </FloatingOrb>
          <div className="text-2xl font-bold text-accent my-2">{icon} {text}</div>
        </div>
      </Modal>
    );
  }

  function GoalModal() {
    return (
      <Modal open={showGoalModal} onClose={() => setShowGoalModal(false)} title="Change Main Quest">
        <div className="flex flex-col gap-2 items-center mt-2">
          <LottieAnim src={GOAL_LOTTIE} size={54} autoplay loop={false} />
          <div className="text-accent font-bold text-xl mb-1">Edit your main quest:</div>
          <input
            type="text"
            className="w-full px-4 py-2 rpg-rounded border-2 border-accent/30 bg-black/60 text-white font-medium text-lg placeholder:text-textFaded shadow-sm mt-2"
            style={{ maxWidth: 380 }}
            value={goalInput}
            onChange={e => setGoalInput(e.target.value.slice(0, 128))}
            placeholder="Describe your epic quest…"
            maxLength={128}
            autoFocus
          />
          <div className="flex flex-row w-full justify-between gap-2 mt-3">
            <NeonButton
              variant="orange"
              onClick={() => setShowGoalModal(false)}
              className="flex-1"
              type="button"
            >Cancel</NeonButton>
            <NeonButton
              variant="accent"
              onClick={handleGoalSave}
              className="flex-1"
              disabled={goalInput.trim() === "" || goalInput === goal || goalSaving}
              type="button"
            >
              {goalSaving ? "Saving…" : "Save"}
            </NeonButton>
          </div>
        </div>
      </Modal>
    );
  }

  function LogoutModal() {
    return (
      <Modal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Confirm Logout">
        <div className="flex flex-col items-center gap-4 mt-2">
          <LottieAnim src={CONFIRM_LOTTIE} size={72} autoplay loop={false} />
          <div className="text-xl font-bold text-red-400 mb-1">
            Are you sure you want to logout?
          </div>
          <div className="text-textFaded text-sm">
            Your journey is always saved. You can return anytime!
          </div>
          <div className="flex flex-row w-full gap-2 mt-1">
            <NeonButton
              variant="orange"
              onClick={() => setShowLogoutModal(false)}
              className="flex-1">Cancel</NeonButton>
            <NeonButton
              variant="accent"
              onClick={handleLogout}
              className="flex-1"
              disabled={saving}>
              {saving ? "Exiting…" : "Logout"}
            </NeonButton>
          </div>
        </div>
      </Modal>
    );
  }

  // == Label helpers ==
  function themeLabel(t) {
    if (t === "auto") return "Auto";
    if (t === "dark") return "Dark";
    if (t === "light") return "Light";
    return "Auto";
  }

  // =========== RENDER ===========

  return (
    <div className="flex flex-col items-center min-h-[70vh] w-full max-w-2xl mx-auto animate-fadeIn pb-8">
      {/* RPG Header */}
      <div className="w-full flex flex-col items-center gap-2 mt-4 mb-4 select-none">
        <div className="flex items-center justify-center mb-2">
          <FloatingOrb size={68} color="#c084fc">
            <LottieAnim src={SETTINGS_LOTTIE} size={54} autoplay loop />
          </FloatingOrb>
          <span className="ml-3 text-3xl font-extrabold neon-accent text-accent drop-shadow-lg tracking-wide font-poppins">
            Settings
          </span>
        </div>
        <div className="text-brand-orange font-bold text-md -mt-0.5 text-center">
          Tune your journey, hero. Everything syncs to your profile!
        </div>
      </div>
      {/* Profile quick-bar (if exists) */}
      <div className="flex items-center gap-4 bg-black/60 neon-accent px-5 py-2 rpg-rounded border border-accent/40 mb-6">
        {profile?.onboarding?.avatarIdx != null ? (
          <img
            src={
              [
                "/src/assets/wizard_hero_01.png",
                "/src/assets/witch_hero_01.png",
                "/src/assets/knight_hero_01.png",
              ][profile.onboarding.avatarIdx % 3] || DEMO_AVATAR
            }
            alt="Hero avatar"
            className="w-14 h-14 rounded-full border-2 border-accent drop-shadow-md object-cover"
            draggable={false}
          />
        ) : (
          <img
            src={DEMO_AVATAR}
            alt="Avatar"
            className="w-14 h-14 rounded-full border-2 border-accent"
            draggable={false}
          />
        )}
        <div className="flex flex-col font-bold text-white">
          <span>
            {profile?.displayName
              ? profile.displayName
              : (user && user.email ? user.email.split("@")[0] : "Adventurer")}
          </span>
          <span className="text-accent text-xs">
            Level {game?.level ?? 1} • XP {game?.xp ?? 0}
          </span>
        </div>
      </div>

      {/* Settings panels */}
      <div className="w-full max-w-xl flex flex-col gap-4">
        {/* Theme selector */}
        <ThemeSelector />
        {/* Animation toggle */}
        <NeonSwitch
          checked={animations}
          onChange={handleAnimationsToggle}
          label="Animations"
          icon="✨"
          accent="#c084fc"
        />
        {/* Main Quest goal */}
        <GoalPanel />
        {/* Logout */}
        <LogoutPanel />
      </div>

      {/* Animate modals */}
      <AnimateModal
        open={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        type="theme"
      />
      <AnimateModal
        open={showAnimModal}
        onClose={() => setShowAnimModal(false)}
        type="animations"
      />
      {/* Confirm modals */}
      <GoalModal />
      <LogoutModal />

      {/* Toast for feedback */}
      <Toast
        show={toast.show}
        message={toast.msg}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />

      {/* RPG ANIM/CSS */}
      <style>
        {`
        .rpg-rounded { border-radius: 16px; }
        .neon-accent { box-shadow: 0 0 15px 2px #7c3aed44, 0 0 4px 2px #7c3aed; }
        .animate-fadeIn { animation: fadeInSettings .66s cubic-bezier(.65,0,.35,1) both;}
        @keyframes fadeInSettings { 0%{opacity:0;transform:translateY(36px) scale(.979);} 100%{opacity:1;transform:translateY(0) scale(1);} }
        `}
      </style>
    </div>
  );
}
