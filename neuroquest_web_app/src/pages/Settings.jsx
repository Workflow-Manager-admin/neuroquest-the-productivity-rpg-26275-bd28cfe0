import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NeonButton from '../components/NeonButton';
import FloatingOrb from '../components/FloatingOrb';
import Tabs from '../components/Tabs';
import Modal from '../components/Modal';
import { useGame } from '../context/GameContext';
import { useUser } from '../context/UserContext';
import { useApiKey } from '../context/ApiKeyContext';

const ANIM_LOTTIE = '/src/assets/magic-fantasy-particles.json';

// PUBLIC_INTERFACE
/**
 * Settings – RPG panel for user preferences. Context-integrated toggles (dark/light mode, animation effects), Start New Quest (onboarding reset), Logout action.
 * Modern RPG/fantasy themed, responsive, and immersive.
 */
export default function Settings() {
  const { game, setTheme, updateGame } = useGame();
  const { user, logout } = useUser();
  const { apiKey, setApiKey, clearApiKey } = useApiKey();
  const [theme, setThemeState] = useState(game.theme || 'auto');
  const [animations, setAnimations] = useState(
    localStorage.getItem('rpg_animations') !== 'off'
  );
  const [modal, setModal] = useState({ open: false, type: null });
  const [saving, setSaving] = useState(false);
  const [showApi, setShowApi] = useState(false);
  const [userApiInput, setUserApiInput] = useState(apiKey || '');
  const [apiSaved, setApiSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setThemeState(game.theme || 'auto');
  }, [game.theme]);

  // Apply animation toggle globally
  useEffect(() => {
    if (animations) {
      document.body.classList.remove('no-anim');
      localStorage.setItem('rpg_animations', 'on');
    } else {
      document.body.classList.add('no-anim');
      localStorage.setItem('rpg_animations', 'off');
    }
  }, [animations]);

  const handleThemeChange = (mode) => {
    setThemeState(mode);
    setTheme(mode);
    window.localStorage.setItem('theme', mode);
  };

  const handleStartNewQuest = async () => {
    setSaving(true);
    try {
      // Reset onboarding for current user (but not entire profile)
      // Set flag to false (user must go through onboarding screen again)
      await updateGame({ onboarding: null });
      if (user && user.uid) {
        // Optionally can wipe firestored onboarding if structured that way
        // Only redirect after real save
        setTimeout(() => {
          navigate('/onboarding');
        }, 450);
      }
    } catch {
      // Ignore error, can show toast in future
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    setSaving(true);
    try {
      await logout();
      setTimeout(() => navigate('/login'), 600);
    } catch {
      // Silently ignore; can show feedback
    }
    setSaving(false);
  };

  const handleAnimToggle = () => setAnimations((a) => !a);

  const onApiKeySave = () => {
    setApiKey(userApiInput.trim());
    setApiSaved(true);
    setTimeout(() => setApiSaved(false), 1100);
  };

  // Optionally, allow user to clear API key (will fallback to .env)
  const onApiKeyClear = () => {
    clearApiKey();
    setUserApiInput('');
    setApiSaved(false);
  };

  // Fantasy themed settings page with toggle switches, context integration, and modal confirmation for dangerous actions
  return (
    <div className="flex flex-col items-center min-h-[70vh] px-2 w-full animate-fadeIn relative pb-12">
      <div className="absolute top-0 inset-x-0 pointer-events-none z-0" aria-hidden>
        <FloatingOrb size={140}>
          <img src="/src/assets/hat_arcane.png" alt="hat" className="opacity-60 w-24 h-24" />
        </FloatingOrb>
        <div className="w-full text-center mt-[-19px] text-accent/30 font-bold text-[4.5rem] select-none pointer-events-none">⚙️</div>
      </div>
      <div className="relative z-10 w-full max-w-xl glass-morph neon-accent border border-accent/50 rpg-rounded p-7 mt-6 shadow-2xl">
        <h1
          className="text-3xl font-bold neon-accent text-accent text-center mb-2"
          style={{
            textShadow: '0 0 18px #c084fc99, 0 0 41px #ad54f544',
            fontFamily: "'Poppins','Cinzel Decorative','UnifrakturCook',serif",
            letterSpacing: "0.03em"
          }}
        >
          Settings & Preferences
        </h1>
        <div className="text-brand-orange font-bold text-center mb-8">
          Set your gameplay vibe, magic, and account options.
        </div>
        <Tabs tabs={['Display', 'Gameplay', 'Account']} defaultIndex={0} size="md">
          {/* DISPLAY TAB */}
          <div>
            <div className="flex flex-col gap-5">
              {/* Dark/Light/Auto Mode switch */}
              <section className="flex flex-row items-center gap-6 mb-1">
                <div className="font-bold text-accent text-lg mr-1 flex items-center gap-2">
                  Theme
                  <span className="ml-2 text-brand-orange text-2xl" role="img" aria-label="palette">🎨</span>
                </div>
                <div className="flex flex-row gap-3">
                  {['auto', 'dark', 'light'].map((mode) => (
                    <button
                      key={mode}
                      className={`px-5 py-2 rpg-rounded border-2 font-extrabold transition-neon-colors ${
                        theme === mode
                          ? 'bg-accent text-white border-accent neon-accent'
                          : 'bg-black/70 text-accent border-accent/60'
                      }`}
                      onClick={() => handleThemeChange(mode)}
                      tabIndex={0}
                    >
                      {mode === 'auto' && 'Auto'}
                      {mode === 'dark' && (
                        <span>
                          🌙<span className="ml-1">Dark</span>
                        </span>
                      )}
                      {mode === 'light' && (
                        <span>
                          ☀️<span className="ml-1">Light</span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </section>
              {/* Animations toggle */}
              <section className="flex flex-row items-center gap-7 mb-1">
                <div className="font-bold text-accent text-lg mr-1 flex items-center gap-2">
                  Animations
                  <span className="ml-2 text-2xl text-brand-orange">✨</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={animations}
                    onChange={handleAnimToggle}
                    className="form-checkbox h-6 w-6 accent-accent"
                  />
                  <span className="text-white font-semibold text-base">
                    {animations ? 'On' : 'Off'}
                  </span>
                </label>
              </section>
            </div>
          </div>
          {/* GAMEPLAY TAB */}
          <div>
            <div className="flex flex-col gap-6">
              <section className="flex flex-col gap-3 mb-5">
                <div className="font-bold text-accent text-lg flex items-center gap-2">
                  Start New Quest&nbsp;
                  <span role="img" aria-label="New Quest" className="text-2xl text-brand-orange">🗺️</span>
                </div>
                <div className="text-textFaded max-w-lg">
                  Reset your current major quest and start a new adventure. 
                  <span className="text-brand-orange font-semibold ml-1">
                    This action will clear your onboarding progress, but keep your XP/items.
                  </span>
                </div>
                <NeonButton
                  variant="accent"
                  className="px-6 py-2 font-bold mt-1"
                  onClick={() => setModal({ open: true, type: 'newquest' })}
                  disabled={saving}
                >
                  Start New Quest
                </NeonButton>
              </section>
              <section className="flex flex-col gap-3 mb-5">
                <div className="font-bold text-accent text-lg flex items-center gap-2">
                  RPG API Key&nbsp;
                  <span className="text-2xl text-accent">🔑</span>
                </div>
                <div className="text-textFaded mb-1">
                  Enter your OpenAI API key for custom quest and AI magic. Never shared or saved to server, always local.
                </div>
                {!showApi ? (
                  <NeonButton
                    className="font-bold w-fit px-5 py-1"
                    variant="accent"
                    onClick={() => setShowApi(true)}
                  >
                    {apiKey ? 'Edit API Key' : 'Add API Key'}
                  </NeonButton>
                ) : (
                  <div className="flex flex-row gap-2 items-center">
                    <input
                      type="password"
                      value={userApiInput}
                      placeholder="sk-... (your OpenAI key)"
                      onChange={e => setUserApiInput(e.target.value)}
                      className="px-3 py-2 rpg-rounded border border-accent/30 bg-black/70 text-white font-mono text-sm w-[220px]"
                      autoComplete="off"
                    />
                    <NeonButton
                      size="sm"
                      className="px-4 py-2 font-bold"
                      variant="brand-orange"
                      onClick={onApiKeySave}
                      disabled={userApiInput.length < 16}
                    >
                      Save
                    </NeonButton>
                    <NeonButton
                      size="sm"
                      className="px-1 py-2 font-bold"
                      variant="accent"
                      onClick={onApiKeyClear}
                    >
                      Clear
                    </NeonButton>
                    <button type="button"
                      className="ml-1 font-bold text-accent"
                      aria-label="Close API key input"
                      onClick={() => setShowApi(false)}
                    >{"✕"}</button>
                  </div>
                )}
                {apiSaved && (
                  <span className="text-green-400 font-bold text-xs ml-1 animate-pulse">
                    Key {userApiInput ? "saved" : "cleared"}!
                  </span>
                )}
              </section>
            </div>
          </div>
          {/* ACCOUNT TAB */}
          <div>
            <div className="flex flex-col gap-6">
              <section>
                <div className="flex flex-row items-center gap-3 mb-0">
                  <div className="font-bold text-accent text-lg flex items-center gap-2">
                    Logout
                    <span className="ml-1 text-2xl" role="img" aria-label="logout">🚪</span>
                  </div>
                  <NeonButton
                    variant="orange"
                    className="px-6 py-2 font-bold ml-5"
                    onClick={() => setModal({ open: true, type: 'logout' })}
                    disabled={saving}
                  >
                    Logout
                  </NeonButton>
                </div>
                <div className="text-textFaded mt-1">
                  Leave NeuroQuest — You&apos;ll stay logged out until you return.
                </div>
              </section>
              {/* Future: Add Email update, Account deletion etc */}
            </div>
          </div>
        </Tabs>
      </div>
      {/* Modals for confirmations */}
      <Modal open={modal.open && modal.type === 'newquest'} title="Start New Quest?" onClose={() => setModal({ open: false, type: null })}>
        <div className="flex flex-col gap-3 items-center p-1">
          <div className="text-brand-orange text-xl font-bold">Are you sure?</div>
          <div className="text-textFaded text-base mb-2 max-w-xs text-center">
            Starting a new quest will take you through the onboarding process again.
            <br />
            <span className="font-bold text-accent">Your XP, inventory, and progress remain safe.</span>
          </div>
          <NeonButton
            variant="accent"
            className="px-7 py-2 font-bold mb-1"
            onClick={() => {
              setModal({ open: false, type: null }); handleStartNewQuest();
            }}
            disabled={saving}
          >Begin New Quest
          </NeonButton>
          <NeonButton
            variant="orange"
            className="px-7 py-2"
            onClick={() => setModal({ open: false, type: null })}
          >
            Cancel
          </NeonButton>
        </div>
      </Modal>
      <Modal open={modal.open && modal.type === 'logout'} title="Logout?" onClose={() => setModal({ open: false, type: null })}>
        <div className="flex flex-col gap-3 items-center py-2">
          <div className="text-brand-orange text-xl font-bold">Confirm logout?</div>
          <div className="text-textFaded text-base max-w-xs text-center">
            You can return any time by logging in again.
          </div>
          <NeonButton
            variant="orange"
            className="px-7 py-2 font-bold mb-1"
            onClick={() => { setModal({ open: false, type: null }); handleLogout(); }}
            disabled={saving}
          >
            Logout Now
          </NeonButton>
          <NeonButton
            variant="accent"
            className="px-7 py-2"
            onClick={() => setModal({ open: false, type: null })}
          >
            Cancel
          </NeonButton>
        </div>
      </Modal>
      {/* Neon fantasy CSS */}
      <style>
        {`
        .glass-morph {
          background: rgba(24,19,39,0.85);
          border-radius: 22px;
          backdrop-filter: blur(12px);
        }
        .rpg-rounded { border-radius: 18px; }
        .neon-accent { box-shadow: 0 0 17px 2px #7c3aed99, 0 0 4px 2px #7c3aed66; }
        .animate-fadeIn { animation: fadeInSettings .6s cubic-bezier(.62,0,.39,1) both;}
        @keyframes fadeInSettings {
          0%{opacity:0;transform:translateY(15px) scale(.99);}
          100%{opacity:1;transform:translateY(0) scale(1);}
        }
        .no-anim *, .no-anim {
          animation: none !important;
          transition: none !important;
        }
        `}
      </style>
    </div>
  );
}
