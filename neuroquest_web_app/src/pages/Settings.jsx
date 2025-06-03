import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useGame } from "../context/GameContext";
import Modal from "../components/Modal";
import LottieAnim from "../components/LottieAnim";
import NeonButton from "../components/NeonButton";
import Toast from "../components/Toast";
// Import fantasy/scifi assets below as you add them (e.g., import fantasyBackdrop from "../assets/fantasy_bg.svg";)
// Required Firebase dependencies
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Neon Effect helpers
function neonGlow(color = "#7c3aed", blur = 12) {
  return {
    boxShadow: `0 0 ${blur}px 2px ${color}, 0 0 ${blur * 2}px 0px ${color}`,
    textShadow: `0 0 0.6em ${color}, 0 0 1.5em ${color}`,
    border: `2px solid ${color}`,
  };
}

// Fancy switch (toggle) for RPG
function NeonSwitch({ checked, onChange, label, asset, color = "#a5b4fc" }) {
  return (
    <label className="flex items-center gap-4 cursor-pointer group select-none" style={{ padding: 8 }}>
      <div className="relative w-14 h-8">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-900 to-cyan-700 shadow-lg opacity-90"
          style={neonGlow(color, 16)}
        ></div>
        <div
          className={`absolute left-1 top-1 w-6 h-6 rounded-full transition-all duration-300
            ${checked ? "translate-x-6 bg-cyan-300" : "bg-violet-400"} 
            shadow-lg`}
          style={neonGlow(checked ? "#22d3ee" : "#a5b4fc")}
        >
          {asset && (
            <img 
              src={asset}
              alt={label}
              className="w-5 h-5 object-contain mx-auto my-auto"
              style={{ filter: "drop-shadow(0 0 4px #fff5)" }}
            />
          )}
        </div>
      </div>
      <span
        className="ml-2 text-xl font-bold tracking-wider"
        style={{
          color: checked ? "#60f7f9" : "#a5b4fc",
          ...neonGlow(checked ? "#60f7f9" : "#a5b4fc"),
        }}
      >
        {label}
      </span>
    </label>
  );
}

// Main Settings Page
// PUBLIC_INTERFACE
export default function Settings() {
  // User and global preferences context
  const { user, logout: contextLogout } = useUser();
  const { game, updateGame, loading: gameLoading, ...gameRest } = useGame();
  // Preferences may come from game or separate mechanism:
  // (for now retain original variable logic, fallback if undefined)
  const preferences = game && game.preferences ? game.preferences : {};
  const setPreferences = (newPrefs) => {
    // fallback setter if needed
    updateGame({ preferences: newPrefs });
  };

  // Local state for toggles/modals
  const [darkMode, setDarkMode] = useState(preferences.darkMode ?? false);
  const [animations, setAnimations] = useState(preferences.animations ?? true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState(preferences.majorGoal || "");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", lottie: null });
  const [goalConfirmModal, setGoalConfirmModal] = useState(false);

  // Firebase
  const db = getFirestore();
  const auth = getAuth();

  // Neon-glow feedback
  function showFeedback(msg, lottie) {
    setToast({ show: true, msg, lottie });
    setTimeout(() => setToast({ show: false, msg: "", lottie: null }), 2500);
  }

  // Update preferences in context and Firestore
  async function savePreferences(updates) {
    setIsSaving(true);
    try {
      // Merge updates into local state/context
      const newPrefs = { ...preferences, ...updates };
      setPreferences(newPrefs);
      // Save to Firestore
      if (user?.uid) {
        await setDoc(doc(db, "users", user.uid), { preferences: newPrefs }, { merge: true });
      }
      showFeedback("Preferences saved!", "sparkle");
    } catch (err) {
      showFeedback("Failed to save. Check connection.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  // Toggle handlers
  const handleDarkToggle = () => {
    setDarkMode((prev) => {
      const next = !prev;
      savePreferences({ darkMode: next });
      document.documentElement.classList.toggle("dark", next); // Immediately toggle
      return next;
    });
  };
  const handleAnimationsToggle = () => {
    setAnimations((prev) => {
      const next = !prev;
      savePreferences({ animations: next });
      return next;
    });
  };

  // Goal changing logic
  const handleGoalSave = async () => {
    // Confirmation modal step
    setGoalConfirmModal(true);
  };
  const reallyChangeGoal = async () => {
    setShowGoalModal(false);
    setGoalConfirmModal(false);
    await savePreferences({ majorGoal: goalInput });
    showFeedback("Quest goal updated!", "levelup"); // Fun RPG Lottie
  };

  // Logout
  const handleLogout = async () => {
    setIsSaving(true);
    try {
      await signOut(auth);
      contextLogout && contextLogout();
      showFeedback("Logged out!", "logoff");
      // Could also redirect to /login if router available
    } catch {
      showFeedback("Logout failed.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Panel backgrounds & assets
  const panelStyle = (color) => ({
    borderRadius: "1rem",
    padding: "2rem",
    marginBottom: "2rem",
    position: "relative",
    background:
      "linear-gradient(135deg, rgba(23,22,50,0.88) 80%, rgba(23,132,255,0.12) 100%)",
    border: "2.5px solid #7c3aed55",
    ...neonGlow(color, 20),
    minWidth: 280,
  });

  // Responsive/fantasy header
  return (
    <div
      className="min-h-screen px-2 md:px-10 py-10 flex flex-col items-center bg-gradient-to-bl from-gray-950/90 to-violet-900/80"
      style={{
        backgroundImage: `radial-gradient(circle at 60% 20%, #4f36e9bb 0%, transparent 65%), radial-gradient(circle at 10% 80%, #22d3ee66 0%, transparent 66% )`,
      }}
    >
      {/* RPG Title */}
      <h1
        className="text-4xl lg:text-5xl font-fantasy text-center pb-8 select-none"
        style={{
          color: "#7c3aed",
          ...neonGlow("#7c3aed", 32),
          letterSpacing: "0.07em",
        }}
      >
        <span>
          <span className="hidden md:inline">⚙️&nbsp;&nbsp;</span>
          Settings <span className="text-accent">Sanctum</span>
        </span>
      </h1>

      {/* Main Settings Sections */}
      <div className="w-full max-w-2xl space-y-10">
        {/* Theme toggle */}
        <div style={panelStyle("#60f7f9")}>
          <div className="flex items-center gap-6 mb-3">
            <img
              src={"https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f31a.svg"}
              alt="Moon"
              className="w-10 h-10"
              draggable={false}
            />
            <h2 className="text-2xl font-semibold" style={neonGlow("#60f7f9")}>
              Appearance
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 mt-2">
            <NeonSwitch
              checked={darkMode}
              onChange={handleDarkToggle}
              label="Dark Mode"
              asset="https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f319.svg"
              color="#6475fa"
            />
            <NeonSwitch
              checked={animations}
              onChange={handleAnimationsToggle}
              label="Battle Animations"
              asset="https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/2728.svg"
              color="#69ffe3"
            />
          </div>
        </div>

        {/* Major goal panel */}
        <div style={panelStyle("#7c3aed")}>
          <div className="flex items-center gap-6 mb-3">
            <img
              src={"https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f3af.svg"}
              alt=""
              className="w-10 h-10"
              draggable={false}
            />
            <h2 className="text-2xl font-semibold" style={neonGlow("#a56bff")}>
              Current Quest
            </h2>
          </div>
          <p className="text-base text-white/80 mb-3">
            <span className="font-bold" style={neonGlow("#fff7")}>Goal:</span>{" "}
            <span className="text-cyan-200 font-semibold">{preferences.majorGoal || "Unspecified"}</span>
          </p>
          <NeonButton
            onClick={() => setShowGoalModal(true)}
            color="#ba63f9"
            className="mt-2"
          >
            Change Quest Goal
          </NeonButton>
        </div>

        {/* Logout & Danger Zone */}
        <div style={panelStyle("#f87171")}>
          <div className="flex items-center gap-6 mb-3">
            <img
              src={"https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f47b.svg"}
              alt="Ghost/Logout"
              className="w-10 h-10"
              draggable={false}
            />
            <h2 className="text-2xl font-semibold" style={neonGlow("#f87171")}>
              Account
            </h2>
          </div>
          <NeonButton
            onClick={handleLogout}
            color="#f87171"
            className="mt-2"
          >
            <span>Logout of Guild</span>
          </NeonButton>
        </div>
      </div>

      {/* Goal modal & confirmation */}
      <Modal
        open={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        title="Change Quest Goal"
        style={{ minWidth: 320, ...neonGlow("#7c3aed") }}
      >
        <div className="text-center pb-3">
          <LottieAnim name="quest" style={{ maxWidth: 160, margin: "auto" }} />
          <p className="mb-4 text-white/75">
            Set your new major goal—this will reboot your questline!
          </p>
          <input
            className="w-full px-4 py-2 rounded-lg mb-4 border-2 border-accent focus:ring-2 outline-none text-xl bg-black/70"
            placeholder="Enter your new Quest goal..."
            value={goalInput}
            onChange={e => setGoalInput(e.target.value)}
            maxLength={120}
            autoFocus
          />
        </div>
        <div className="flex gap-3 justify-center">
          <NeonButton onClick={() => setShowGoalModal(false)} color="#888">
            Cancel
          </NeonButton>
          <NeonButton
            onClick={handleGoalSave}
            color="#7c3aed"
            disabled={!goalInput || goalInput.trim().length < 3}
          >
            Confirm Change
          </NeonButton>
        </div>
      </Modal>
      <Modal
        open={goalConfirmModal}
        onClose={() => setGoalConfirmModal(false)}
        title="Are you sure?"
        style={{ minWidth: 320, ...neonGlow("#a5b4fc") }}
      >
        <div className="text-center pb-1">
          <LottieAnim name="warning" style={{ maxWidth: 120, margin: "auto" }} />
          <p className="mb-3 text-white/80">
            Changing your quest will reset your current progress.<br />
            <span className="text-accent font-bold">Continue?</span>
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <NeonButton onClick={() => setGoalConfirmModal(false)} color="#888">
            Cancel
          </NeonButton>
          <NeonButton
            onClick={reallyChangeGoal}
            color="#7c3aed"
          >
            Start New Quest
          </NeonButton>
        </div>
      </Modal>

      {/* Toast/animated feedback */}
      <Toast show={toast.show} lottie={toast.lottie}>
        <span className="font-fantasy text-xl text-glow">{toast.msg}</span>
      </Toast>

      {/* Saving spinner overlay */}
      {isSaving && (
        <div className="fixed z-[100] inset-0 flex justify-center items-center bg-black/30 pointer-events-none">
          <LottieAnim name="progress" style={{ width: 120, minHeight: 120 }} />
        </div>
      )}

      {/* Decorative ambient assets (example) */}
      <div className="pointer-events-none fixed left-0 bottom-0 w-screen h-48 opacity-35 select-none" style={{
        background: "radial-gradient(circle at 90% 60%, #a56bff 0%, transparent 90%)",
        zIndex: 1,
      }}></div>
    </div>
  );
}
