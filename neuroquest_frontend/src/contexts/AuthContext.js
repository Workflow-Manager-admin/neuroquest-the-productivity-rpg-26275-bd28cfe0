/**
 * AuthContext provides user authentication state and handlers using Firebase Auth.
 * Safe for both Google and Email auth, supports future extensibility.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebaseConfig";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

// PUBLIC_INTERFACE
const AuthContext = createContext();

/**
 * AuthProvider wraps children in AuthContext and manages currentUser state.
 * Handles Google/Email login, registration, logout, and Firebase session changes.
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: subscribe to Firebase user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // PUBLIC_INTERFACE
  async function loginWithGoogle() {
    await signInWithPopup(auth, googleProvider);
  }

  // PUBLIC_INTERFACE
  async function loginWithEmail(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  // PUBLIC_INTERFACE
  async function register(email, password, displayName) {
    // Create and optionally set display name
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(user, { displayName });
    }
  }

  // PUBLIC_INTERFACE
  async function logout() {
    await signOut(auth);
  }

  const value = {
    currentUser,
    loading,
    loginWithGoogle,
    loginWithEmail,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
/** useAuth hook to access AuthContext more easily */
export function useAuth() {
  return useContext(AuthContext);
}
