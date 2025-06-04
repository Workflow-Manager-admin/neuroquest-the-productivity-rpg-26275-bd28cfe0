# neuroquest-the-productivity-rpg-26275-bd28cfe0

## Quick Start: Environment Variables

To configure this app, **copy `.env.example` to `.env`** in the `neuroquest_web_app/` folder and set all required values.
You **must** fill in your own Firebase credentials as environment variables for local development and deployment.

**Required `.env` variables for Firebase:**
```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...   # (optional, for analytics)
```
See `.env.example` for details and copy/paste.

---

## User-Supplied API Key Management (OpenAI, etc.)

NeuroQuest now supports secure runtime injection and persistence of user-supplied API keys (e.g., for OpenAI) using a dedicated React Context.

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
