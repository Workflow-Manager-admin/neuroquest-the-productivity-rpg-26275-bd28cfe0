import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

/**
 * Firebase configuration for NeuroQuest.
 * 
 * REQUIRED: You must set the following variables in your .env (Vite requires VITE_ prefix) before running the app:
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_AUTH_DOMAIN
 * - VITE_FIREBASE_PROJECT_ID
 * - VITE_FIREBASE_STORAGE_BUCKET
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 * - (optional for analytics) VITE_FIREBASE_MEASUREMENT_ID
 * 
 * These should be copied from your Firebase Console, never hardcoded.
 * IMPORTANT: If your variables started with REACT_APP_, rename them to VITE_ (see docs).
 *
 * This file now includes robust runtime checks and diagnostics for environment variables.
 */

// Runtime DEBUG log for all env variables before Firebase setup
if (
  typeof window !== "undefined" &&
  typeof import !== "undefined" &&
  import.meta &&
  import.meta.env
) {
  // This log helps developers see which env keys are injected at runtime.
  // Comment this out before production if desired.
  // eslint-disable-next-line
  console.debug("[NeuroQuest][Firebase] import.meta.env at runtime:", import.meta.env);
}

// Helper: Get variable, warn if missing, with defensive fallback.
function getFirebaseEnvVal(key) {
  const val = import.meta.env[key];
  if (typeof val === "undefined") {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line
      console.warn(
        `[NeuroQuest] ENV WARNING: ${key} is undefined at runtime (import.meta.env). Check your .env file, and verify you are launching Vite from the correct folder and with .env present.`
      );
    }
    return "";
  }
  return val;
}

// REQUIRED Firebase keys for config (strict for stability)
const REQUIRED_FIREBASE_KEYS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const firebaseConfig = {
  // Always set each required field using helper. If missing, safe fallback to "".
  apiKey: getFirebaseEnvVal("VITE_FIREBASE_API_KEY"),
  authDomain: getFirebaseEnvVal("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getFirebaseEnvVal("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getFirebaseEnvVal("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getFirebaseEnvVal("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getFirebaseEnvVal("VITE_FIREBASE_APP_ID"),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

// Check for missing required Firebase config keys BEFORE initialization
const missingKeys = REQUIRED_FIREBASE_KEYS.filter(
  (key) => !import.meta.env[key]
);

if (missingKeys.length > 0) {
  // Always log the whole env for clarity, then provide a clear error/warning:
  if (typeof window !== "undefined") {
    // eslint-disable-next-line
    console.error(
      `[NeuroQuest] CRITICAL: Missing environment variables for Firebase!`,
      { missing: missingKeys, envVars: import.meta.env }
    );
    // eslint-disable-next-line
    console.warn(
      `[NeuroQuest] You must set all required VITE_FIREBASE_* keys in your .env at the project root and restart the dev server. Missing: ${missingKeys.join(", ")}`
    );
    // Optionally: Display a visible warning (DEV only)
    if (document && document.body) {
      const existing = document.getElementById("firebase-missing-warning");
      if (!existing) {
        const warn = document.createElement("div");
        warn.id = "firebase-missing-warning";
        warn.style =
          "background:#7c3aed;color:#fff;padding:20px 18px;z-index:99999;position:fixed;top:0;left:0;right:0;font-size:1.0rem;font-family:sans-serif;text-align:center;border-bottom:3px solid #e87a41";
        warn.innerHTML =
          `<b>Firebase configuration missing keys:</b> ${missingKeys.join(
            ", "
          )}.<br/>Check your .env, restart dev/build, and see console for import.meta.env dump.<br/>The app will run in DEGRADATION MODE and may crash or fail authentication.`;
        document.body.prepend(warn);
      }
    }
  }
  // Fallback: Optionally throw a fatal error in development (uncomment to enforce):
  // throw new Error(`[NeuroQuest] FATAL: Firebase env vars missing: ${missingKeys.join(", ")} - see console for details.`);
} else {
  // All keys present - optionally log config for developer clarity
  // eslint-disable-next-line
  console.debug("[NeuroQuest][Firebase] Configured for Firebase with config:", firebaseConfig);
}

// Defensive: always setup Firebase with whatever config we have (safe fallbacks)
// This avoids "Cannot read properties of undefined" errors.

let firebaseApp;
try {
  firebaseApp = initializeApp(firebaseConfig);
} catch (err) {
  // Firebase may throw if already initialized, ignore such error.
  if (
    !(
      err &&
      typeof err.message === "string" &&
      err.message.includes("already exists")
    )
  ) {
    // eslint-disable-next-line
    console.error(
      "[NeuroQuest] Firebase failed to initialize! See the error below and check your .env variables.",
      err,
      "Config used: ",
      firebaseConfig
    );
    // Optionally throw if desired for fatal failure.
    // throw err;
  }
}
const auth = getAuth();
const db = getFirestore();

// PUBLIC_INTERFACE
/**
 * UserContext provides Firebase user, profile info, and auth helpers.
 * - value: { user, profile, loading, logout }
 */
const UserContext = createContext();

// PUBLIC_INTERFACE
export function useUser() {
  return useContext(UserContext);
}

// PUBLIC_INTERFACE
export function UserProvider({ children }) {
  // user: Firebase Auth user, profile: custom user doc (name, avatar, etc.)
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        // Try to fetch Firestore profile (extend as needed)
        const profileRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(profileRef);
        if (snap.exists()) setProfile(snap.data());
        else setProfile(null);
      } else {
        setProfile(null);
      }
    });
    // eslint-disable-next-line
    return () => unsub();
  }, []);

  // Update Firestore profile and localStorage
  const updateProfile = async (profileUpdate) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, profileUpdate, { merge: true });
    setProfile((prev) => ({ ...prev, ...profileUpdate }));
    // Optionally sync to localStorage if offline-first is desired
    window.localStorage.setItem("profile", JSON.stringify({ ...profile, ...profileUpdate }));
  };

  // Clear auth and profile
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    window.localStorage.removeItem("profile");
  };

  // Optionally load profile from localStorage as fallback (offline)
  useEffect(() => {
    if (!profile && !loading) {
      const lsProfile = window.localStorage.getItem("profile");
      if (lsProfile) setProfile(JSON.parse(lsProfile));
    }
  }, [profile, loading]);

  const value = { user, profile, updateProfile, logout, loading };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
