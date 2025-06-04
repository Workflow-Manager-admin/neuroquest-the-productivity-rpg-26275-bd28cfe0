import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";
import { useUser } from "./UserContext";
// Import Toast for global RPG feedback
import Toast from "../components/Toast";

const db = getFirestore();

// Shape for default game state (offline fallback skeleton)
const DEFAULT_GAME = {
  xp: 0,
  hp: 100,
  level: 1,
  streak: 0,
  theme: "auto", // or "light" | "dark"
  quests: [],
  // add coins, inventory, etc. as desired
};

// PUBLIC_INTERFACE
/**
 * GameContext provides RPG game state (XP, HP etc), quest log, streak, theme, game setters.
 * value: { game, updateGame, loading }
 */
const GameContext = createContext();
// PUBLIC_INTERFACE
export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const { user } = useUser();
  const [game, setGame] = useState(DEFAULT_GAME);
  const [loading, setLoading] = useState(true);

  // State for RPG error Toasts
  const [toast, setToast] = useState({ show: false, msg: "", type: "error", retryFn: null });

  // Fetch RPG game state from Firestore (and subscribe to changes)
  useEffect(() => {
    if (!user) {
      setGame(DEFAULT_GAME);
      setLoading(false);
      return;
    }
    setLoading(true);
    const docRef = doc(db, "game", user.uid);
    // Listen to changes
    const unsub = onSnapshot(
      docRef,
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            setGame(snapshot.data());
            window.localStorage.setItem("game", JSON.stringify(snapshot.data()));
          } else {
            setGame(DEFAULT_GAME);
          }
        } catch (e) {
          setToast({
            show: true,
            msg: "⚔️ The mists obstruct your progress! Failed to sync your heroic stats. Try refreshing.",
            type: "error",
            retryFn: () => window.location.reload()
          });
        }
        setLoading(false);
      },
      (err) => {
        // If Firestore is unreachable, fall back to localStorage with RPG guidance
        try {
          const cached = window.localStorage.getItem("game");
          if (cached) {
            setGame(JSON.parse(cached));
            setToast({
              show: true,
              msg: "🧙 You are traveling offline. Progress will be saved locally, but some magical powers are limited.",
              type: "error"
            });
          } else {
            setGame(DEFAULT_GAME);
            setToast({
              show: true,
              msg: "🛡️ You venture forth with a blank legend. Online features may be unavailable.",
              type: "error"
            });
          }
        } catch {
          setGame(DEFAULT_GAME);
          setToast({
            show: true,
            msg: "🌪️ Both memory and the server have failed! Please try reloading this page.",
            type: "error",
            retryFn: () => window.location.reload()
          });
        }
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  // Save game state to Firestore, with robust error/feedback
  const updateGame = async (update) => {
    if (!user) {
      setToast({
        show: true,
        msg: "You must be logged in to save your RPG progress.",
        type: "error"
      });
      return;
    }
    const newGame = { ...game, ...update };
    setGame(newGame);
    try {
      await setDoc(doc(db, "game", user.uid), newGame, { merge: true });
      window.localStorage.setItem("game", JSON.stringify(newGame));
    } catch (e) {
      setToast({
        show: true,
        msg: "🛡️ Failed to save your stats! The Runestone (server) is not responding. Try again shortly. No progress lost: your actions will be saved once the portal opens.",
        type: "error",
        retryFn: () => updateGame(update)
      });
      // Do not revert optimistic UI; allow retry above.
    }
  };

  // Optionally, load from localStorage if no Firestore/user
  useEffect(() => {
    if (!user && !loading) {
      try {
        const cached = window.localStorage.getItem("game");
        if (cached) setGame(JSON.parse(cached));
        else setGame(DEFAULT_GAME);
      } catch {
        setGame(DEFAULT_GAME);
        setToast({
          show: true,
          msg: "⭐ Local backup for your saga is missing! You'll start fresh unless online sync resumes.",
          type: "error"
        });
      }
    }
  }, [user, loading]);

  // Streak and theme helpers (example hook-style ergonomics)
  const incrementStreak = () => updateGame({ streak: (game.streak || 0) + 1 });
  const setTheme = (theme) => updateGame({ theme });

  const value = {
    game,
    updateGame,
    incrementStreak,
    setTheme,
    loading,
  };

  // RPG Toasts: only render if open
  return (
    <GameContext.Provider value={value}>
      {children}
      <Toast
        show={toast.show}
        message={toast.msg}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false, retryFn: null })}
      />
      {/* Retry button for actionable recovery */}
      {toast.show && toast.retryFn && (
        <div className="fixed top-28 left-1/2 transform -translate-x-1/2 z-[100]">
          <button
            className="neon-accent bg-accent text-white px-6 py-2 rpg-rounded font-bold border border-accent animate-pulse shadow-xl mt-2"
            onClick={() => {
              setToast({ ...toast, show: false });
              toast.retryFn && toast.retryFn();
            }}
          >
            ⭯ Retry Action
          </button>
        </div>
      )}
    </GameContext.Provider>
  );
}

GameProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
