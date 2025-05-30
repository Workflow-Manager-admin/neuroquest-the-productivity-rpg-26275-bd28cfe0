import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useUser } from "./UserContext";

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

// PUBLIC_INTERFACE
export function GameProvider({ children }) {
  const { user } = useUser();
  const [game, setGame] = useState(DEFAULT_GAME);
  const [loading, setLoading] = useState(true);

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
        if (snapshot.exists()) {
          setGame(snapshot.data());
          window.localStorage.setItem("game", JSON.stringify(snapshot.data()));
        } else {
          setGame(DEFAULT_GAME);
        }
        setLoading(false);
      },
      (err) => {
        // If Firestore is unreachable, fall back to localStorage
        const cached = window.localStorage.getItem("game");
        if (cached) setGame(JSON.parse(cached));
        else setGame(DEFAULT_GAME);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  // Save game state to Firestore
  const updateGame = async (update) => {
    if (!user) return;
    const newGame = { ...game, ...update };
    setGame(newGame);
    await setDoc(doc(db, "game", user.uid), newGame, { merge: true });
    window.localStorage.setItem("game", JSON.stringify(newGame));
  };

  // Optionally, load from localStorage if no Firestore/user
  useEffect(() => {
    if (!user && !loading) {
      const cached = window.localStorage.getItem("game");
      if (cached) setGame(JSON.parse(cached));
      else setGame(DEFAULT_GAME);
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

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
