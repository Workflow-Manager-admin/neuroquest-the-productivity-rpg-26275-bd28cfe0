import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * ApiKeyContext securely manages a user-supplied API key (e.g., for OpenAI) at runtime.
 * 
 * Features:
 *  - Stores the key in React Context for real-time access across the app.
 *  - Persists the key to browser localStorage for session persistence.
 *  - Allows updating (and clearing) the key live via a UI (Settings).
 *  - **Fallback:** If no user key is present, uses the .env key (e.g., process.env.REACT_APP_OPENAI_API_KEY).
 * 
 * Usage (see examples below):
 * 1. Wrap your app in <ApiKeyProvider>.
 * 2. Use the useApiKey() hook to access and update the API key anywhere in the app.
 * 3. To retrieve the effective key for API calls (user-supplied → .env fallback): useApiKey().getKey()
 */

// PUBLIC_INTERFACE
const ApiKeyContext = createContext();

// PUBLIC_INTERFACE
export function useApiKey() {
  return useContext(ApiKeyContext);
}

// PUBLIC_INTERFACE
/**
 * ApiKeyProvider
 * 
 * Wrap your app at the top level for access to the API key context:
 * 
 *   <ApiKeyProvider>
 *     <App />
 *   </ApiKeyProvider>
 * 
 * Provides:
 *   - apiKey: The currently set user API key (string) or "" if none set.
 *   - setApiKey(key): Function to update user API key (persists to localStorage).
 *   - clearApiKey(): Remove user-supplied API key (falls back to env if set).
 *   - getKey(): Returns user-supplied key if set, else .env key if available, else "".
 */
export function ApiKeyProvider({ children }) {
  const STORAGE_KEY = "user_api_key";
  const ENV_KEY =
    process.env.REACT_APP_OPENAI_API_KEY ||
    process.env.REACT_APP_API_KEY || // in case alternate naming
    "";

  // Holds the user-supplied API key (may be empty if not set)
  const [apiKey, setApiKeyState] = useState(() => {
    // Try to load from localStorage for persistence
    if (typeof window !== "undefined") {
      try {
        const ls = window.localStorage.getItem(STORAGE_KEY);
        if (ls && typeof ls === "string") return ls;
      } catch {}
    }
    return "";
  });

  // On first mount, hydrate from localStorage to context
  useEffect(() => {
    if (!apiKey && typeof window !== "undefined") {
      try {
        const ls = window.localStorage.getItem(STORAGE_KEY);
        if (ls && typeof ls === "string") setApiKeyState(ls);
      } catch {}
    }
    // No deps: runs once
    // eslint-disable-next-line
  }, []);

  // When apiKey changes, sync to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (apiKey && apiKey.length > 2) {
          window.localStorage.setItem(STORAGE_KEY, apiKey);
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } catch {}
    }
  }, [apiKey]);

  // Setter to be called from UI (Settings) or elsewhere
  // PUBLIC_INTERFACE
  function setApiKey(key) {
    setApiKeyState(key || "");
  }

  // PUBLIC_INTERFACE
  function clearApiKey() {
    setApiKeyState("");
  }

  // PUBLIC_INTERFACE
  function getKey() {
    // Return precedence: user-supplied, else .env, else ""
    return apiKey && apiKey.length > 2 ? apiKey : ENV_KEY || "";
  }

  const value = {
    apiKey,
    setApiKey,
    clearApiKey,
    getKey,
  };

  return (
    <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>
  );
}

ApiKeyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/*
  == USAGE PATTERNS ==

  1. **Provider Setup (in App.js or index.js):**
        import { ApiKeyProvider } from "./context/ApiKeyContext";
        // ...
        <ApiKeyProvider>
          <App />
        </ApiKeyProvider>

  2. **Consuming API Key:**
        import { useApiKey } from "../context/ApiKeyContext";

        function SomeComponent() {
          const { apiKey, setApiKey, clearApiKey, getKey } = useApiKey();

          // Effective key for an API call:
          const key = getKey();

          // Update user key (e.g., on settings UI form submit):
          setApiKey("user-value-here");

          // Wipe user key (restore fallback to .env):
          clearApiKey();
        }

  3. **Best Security Practice:**
     - Do NOT display the key to users after input.
     - Use secure input fields (<input type="password" ... />).
     - Never log the API key to the console.
     - Only persist locally in browser; never to backend (unless designed for server).
     - .env fallback should be safe to expose ONLY for public/test OpenAI keys.
*/

