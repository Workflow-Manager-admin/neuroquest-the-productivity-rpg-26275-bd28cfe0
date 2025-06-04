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
 * This file now includes runtime checks and diagnostics for environment variables.
 */

// Debug: log the entire env object for easier diagnostics
if (typeof window !== "undefined" && import.meta && import.meta.env) {
  // You may comment this console log for production if desired.
  // eslint-disable-next-line
  console.debug("Firebase ENV config at runtime:", import.meta.env);
}

// Collect essential keys
const getFirebaseEnvVal = (key) => import.meta.env[key];
// List required keys
const REQUIRED_FIREBASE_KEYS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

let anyMissing = false;
const firebaseConfig = {};
for (const key of REQUIRED_FIREBASE_KEYS) {
  let value = getFirebaseEnvVal(key);
  if (typeof value === "undefined") {
    anyMissing = true;
    // Fallback to empty string and warn.
    value = "";
    if (typeof window !== "undefined") {
      // eslint-disable-next-line
      console.warn(
        `[NeuroQuest] ENV WARNING: The environment variable ${key} is undefined at runtime. Please verify your .env file. Firebase may fail to initialize.`
      );
    }
  }
  firebaseConfig[
    key.replace("VITE_FIREBASE_", "").replace(/_/g, "").replace("MESSAGINGSENDERID", "messagingSenderId").replace("APPID", "appId") // for clarity
  ] = value;
}
// Explicit map to required Firebase config field names
firebaseConfig.apiKey = getFirebaseEnvVal("VITE_FIREBASE_API_KEY") || "";
firebaseConfig.authDomain = getFirebaseEnvVal("VITE_FIREBASE_AUTH_DOMAIN") || "";
firebaseConfig.projectId = getFirebaseEnvVal("VITE_FIREBASE_PROJECT_ID") || "";
firebaseConfig.storageBucket = getFirebaseEnvVal("VITE_FIREBASE_STORAGE_BUCKET") || "";
firebaseConfig.messagingSenderId = getFirebaseEnvVal("VITE_FIREBASE_MESSAGING_SENDER_ID") || "";
firebaseConfig.appId = getFirebaseEnvVal("VITE_FIREBASE_APP_ID") || "";
firebaseConfig.measurementId = getFirebaseEnvVal("VITE_FIREBASE_MEASUREMENT_ID") || "";

// Throw if any are critically missing to avoid silent misconfig
if (anyMissing) {
  // For dev, warn not crash; change to throw if you prefer hard fail
  if (typeof window !== "undefined") {
    // eslint-disable-next-line
    console.error(
      "[NeuroQuest] Firebase configuration is incomplete! At least one required environment variable is missing. See console warnings for details and check your .env."
    );
  }
  // Optionally: Throw error for critical missing config (uncomment to enforce)
  // throw new Error("[NeuroQuest] Fatal: Missing Firebase env vars, see console for required keys and check .env.");
}

// Initialize Firebase app (singleton)
let firebaseApp;
try {
  firebaseApp = initializeApp(firebaseConfig);
} catch (e) {
  // App may already be initialized; ignore error.
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
