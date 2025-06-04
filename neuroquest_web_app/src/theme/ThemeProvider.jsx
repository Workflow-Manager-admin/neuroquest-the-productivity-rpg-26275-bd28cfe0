import React, { createContext, useContext, useLayoutEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * ThemeProvider: Global color mode (dark/light/auto), neon accent, and RPG CSS root custom properties.
 * Provides: { themeMode, setThemeMode, accentColor, setAccentColor }
 * Usage: Wrap App with <ThemeProvider>
 */
// PUBLIC_INTERFACE
const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

// PUBLIC_INTERFACE
export function ThemeProvider({ children }) {
  // "auto", "dark", "light"
  const defaultMode = "auto";
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("themeMode") || defaultMode;
    }
    return defaultMode;
  });
  const [accentColor, setAccentColor] = useState("#7c3aed"); // RPG accent

  // Update CSS variables & dark mode class on themeMode/accentColor change
  useLayoutEffect(() => {
    const root = document.documentElement;
    // Accent and brand colors
    root.style.setProperty("--accent", accentColor);
    root.style.setProperty("--brand-orange", "#E87A41");
    root.style.setProperty("--brand-dark", "#1A1A1A");

    // Color mode
    if (themeMode === "dark") root.classList.add("dark");
    else if (themeMode === "light") root.classList.remove("dark");
    else if (themeMode === "auto") {
      // Prefer system
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? root.classList.add("dark")
        : root.classList.remove("dark");
    }
    window.localStorage.setItem("themeMode", themeMode);
  }, [themeMode, accentColor]);

  const value = {
    themeMode,
    setThemeMode,
    accentColor,
    setAccentColor,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

ThemeProvider.propTypes = { children: PropTypes.node.isRequired };

