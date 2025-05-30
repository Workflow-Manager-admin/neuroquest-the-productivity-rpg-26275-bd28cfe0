// PUBLIC_INTERFACE
/**
 * React Context for authentication, RPG stats, and global state.
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Wraps the app, provides user, xp/hp, preferences, and handlers.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [xp, setXp] = useState(0);
  const [hp, setHp] = useState(100);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [prefs, setPrefs] = useState({
    darkMode: true,
    anims: true,
    neon: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication changes.
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        // Try loading player stats from Firestore, else defaults.
        try {
          const statsDoc = await getDoc(doc(db, "users", fbUser.uid));
          if (statsDoc.exists()) {
            const data = statsDoc.data();
            setXp(data.xp ?? 0);
            setHp(data.hp ?? 100);
            setLevel(data.level ?? 1);
            setStreak(data.streak ?? 0);
            setPrefs(prev => ({
              ...prev,
              ...(data.prefs || {})
            }));
          }
        } catch (e) { /* fallback keeps defaults */ }
      } else {
        setUser(null);
        setXp(0); setHp(100); setLevel(1); setStreak(0);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // PUBLIC_INTERFACE
  const value = {
    user,
    xp, setXp,
    hp, setHp,
    level, setLevel,
    streak, setStreak,
    prefs, setPrefs,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
