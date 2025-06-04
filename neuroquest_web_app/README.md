# neuroquest-the-productivity-rpg-26275-bd28cfe0

## Quick Start: Environment Variables

To configure this app, **copy `.env.example` to `.env`** in the `neuroquest_web_app/` folder and set all required values.

> **Vite requires `.env` files to be present at the project root (alongside `vite.config.js` and `package.json`).**  
> Do **NOT** place `.env` files inside subfolders like `src` — environment variables will not be loaded.

You **must** fill in your own Firebase credentials as environment variables for local development and deployment.

**Required `.env` variables for Firebase:**
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...   # (optional, for analytics)
REACT_APP_GOOGLE_CLIENT_ID=...     # (for Google Calendar sync)
```
See `.env.example` for details and copy/paste.

---

## User-Supplied API Key Management (OpenAI, etc.)

NeuroQuest now supports secure runtime injection and persistence of user-supplied API keys (e.g., for OpenAI) using a dedicated React Context.

---

## Error Handling, Boundaries, and UX Fail-Safes

**Error Boundaries**:

All major app routes and top-level critical flows (authentication, Quest/AI, calendar sync, inventory/cosmetics, music/audio) are wrapped in a reusable `<ErrorBoundary />` component. This ensures:

- Any unhandled error in a subtree is caught and does not crash the entire app.
- The user is presented with immersive, RPG neon-styled error feedback, with actionable prompts and retry/self-heal options.
- Error states are designed to maintain the RPG theme, feedback clarity, and navigational recovery.

**Policy for Error and Edge-Case Handling:**
- Every API call, user action, and critical rendering flow must provide:
  - Descriptive error messages on failure, styled consistently with the neon RPG/UX.
  - Self-healing/retry flows (where possible) – e.g., prompt to reload, try again, or proceed to support.
  - Recovery UI: Never dead-end the user; always permit app navigation even after major errors.
  - Documentation in code comments for all error/recovery logic.

**Developer Instructions:**
- For new pages/features: wrap the main component in `<ErrorBoundary>`.
- For all async/API logic: catch errors, set error state, and display feedback using RPG event/toast modals, NOT browser alerts.

See `src/components/ErrorBoundary.jsx` for details and usage.

### How API Key Storage Works

- **User-supplied key:** Entered via the Settings or Onboarding UI, and stored securely in React Context and browser `localStorage` (never sent to any backend).
- **Persistence:** Key survives page reloads and browser restarts via localStorage.
- **Fallback:** If the user does NOT set a key, the app will use the key from `.env` (i.e., `process.env.REACT_APP_OPENAI_API_KEY`).
- **Update at Runtime:** Changing/removing the key via UI triggers updates everywhere, and falls back to .env as needed.
- **Security:** Never display or log user API keys in plain text. Input fields for the API key should use `type="password"` for safety.

### Retrieving the Effective Key (for API calls)

**Example:**
```js
import { useApiKey } from "./context/ApiKeyContext";

// in a component or service
const { getKey } = useApiKey();
const apiKey = getKey(); // Most up-to-date, user-supplied or .env

// ...use apiKey in your API requests
```

### Adding/Updating the API Key (e.g., from UI)

**Example (Settings UI):**
```js
const { setApiKey, clearApiKey, apiKey } = useApiKey();

// Update to new user-supplied value:
setApiKey("sk-user-entry...");

// Clear the user key (fallback to env):
clearApiKey();
```

**Note:** To wrap the app,
```js
import { ApiKeyProvider } from "./src/context/ApiKeyContext";
...
<ApiKeyProvider>
  <App />
</ApiKeyProvider>
```

### Best Practices

- Keys are always kept on the client—never displayed or sent elsewhere.
- .env keys are only suitable for test, non-sensitive, or client-safe API secrets.
- Users can manage/change their API key in-app at any time.

### For Developers

- The context is located at `/src/context/ApiKeyContext.jsx`.
- Use `useApiKey()` anywhere within a child component to retrieve or update the key.
- Full docstrings and usage examples are in the source code of `ApiKeyContext.jsx`.

---
