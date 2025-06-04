import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import NeonButton from "../components/NeonButton";
import Toast from "../components/Toast";
import FloatingOrb from "../components/FloatingOrb";
import Modal from "../components/Modal";
import { useUser } from "../context/UserContext";
import { useGame } from "../context/GameContext";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Google APIs
// Note: OAuth is not persisted for long, so refresh if page reloads.
const SCOPES =
  "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
/*
 * REQUIRED: Set REACT_APP_GOOGLE_CLIENT_ID in your .env for Google Calendar sync features.
 * Example: REACT_APP_GOOGLE_CLIENT_ID=xxxx-xxxxxxxxxxxxx.apps.googleusercontent.com
 */
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// Fantasy themed color palette for events
const EVENT_COLORS = [
  "#a78bfa", // violet
  "#facc15", // golden legendary
  "#7c3aed", // accent
  "#e87a41", // boss
  "#34d399", // quest/side
  "#f472b6", // fairy
  "#60a5fa", // ocean
  "#fb7185"  // urgent
];

/**
 * Helper to load Google API JS client on the fly (pure browser)
 */
function loadGapiScript() {
  return new Promise((resolve, reject) => {
    if (window.gapi) return resolve(window.gapi);
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.onload = () => resolve(window.gapi);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// Fantasy RPG event card
function RPGEventCard({ event, color, onBoss, bossStatus, pushing }) {
  return (
    <div
      className="relative flex flex-col rpg-rounded neon-accent shadow-xl border-2 border-accent/25 bg-[#1B1432de] py-4 px-4 min-h-[102px] event-card mb-1"
      style={{
        boxShadow: `0 0 14px 5px ${color}38, 0 0 4px 2px ${color}`,
        borderLeft: `4px solid ${color}`,
        borderBottom: `2.5px solid ${color}`,
        transition: "box-shadow 0.2s"
      }}
      tabIndex={0}
    >
      <div className="flex justify-between gap-2 items-center">
        <div>
          <div className="text-accent font-bold text-lg" style={{ color }}>
            {event.summary || "Untitled Event"}
          </div>
          <div className="text-xs text-textFaded font-mono mt-0.5">
            {event.startStr} — {event.endStr}
          </div>
          {event.location && (
            <div className="text-[0.9em] text-brand-orange mt-1 max-w-[220px] truncate">
              📍 {event.location}
            </div>
          )}
        </div>
        <div>
          <FloatingOrb size={39} color={color}>
            <span role="img" aria-label="event">
              {event.isBossBattle ? "🐉" : "🗓️"}
            </span>
          </FloatingOrb>
        </div>
      </div>
      <div className="flex flex-row gap-3 mt-3">
        <NeonButton
          disabled={event.isBossBattle || bossStatus === "loading" || pushing}
          onClick={() => onBoss(event)}
          variant="accent"
          className="py-1 px-4 text-sm"
        >
          {event.isBossBattle
            ? "🌟 Boss Battle"
            : bossStatus === "loading"
            ? "Converting..."
            : "Convert to Boss Battle"}
        </NeonButton>
        {event.canPush && (
          <NeonButton
            variant="orange"
            disabled={bossStatus === "pushing" || pushing}
            onClick={() => event.pushToCalendar(event)}
            className="py-1 px-4 text-sm"
          >
            {bossStatus === "pushing" ? "Pushing..." : "Push to Google"}
          </NeonButton>
        )}
      </div>
      {event.description && (
        <div className="mt-1 text-textFaded text-xs">{event.description}</div>
      )}
      {bossStatus === "done" && (
        <div className="text-green-400 font-bold text-xs mt-1">
          Boss Battle saved!
        </div>
      )}
      {bossStatus === "error" && (
        <div className="text-red-400 font-bold text-xs mt-1">
          Failed to convert!
        </div>
      )}
    </div>
  );
}

RPGEventCard.propTypes = {
  event: PropTypes.shape({
    summary: PropTypes.string,
    startStr: PropTypes.string,
    endStr: PropTypes.string,
    location: PropTypes.string,
    isBossBattle: PropTypes.bool,
    canPush: PropTypes.bool,
    pushToCalendar: PropTypes.func,
    description: PropTypes.string,
    id: PropTypes.any,
    color: PropTypes.string,
  }).isRequired,
  color: PropTypes.string.isRequired,
  onBoss: PropTypes.func.isRequired,
  bossStatus: PropTypes.string,
  pushing: PropTypes.bool,
};

// PUBLIC_INTERFACE
/**
 * CalendarSync - RPG themed Google Calendar bi-directional sync
 */
export default function CalendarSync() {
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [authInst, setAuthInst] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bossMap, setBossMap] = useState({}); // {eventId: "loading"|"done"|"error"}
  const [toast, setToast] = useState({ show: false, msg: "", type: "accent" });
  const [syncing, setSyncing] = useState(false);
  const [modal, setModal] = useState({ open: false, content: null });
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const { user } = useUser();
  const { game, updateGame } = useGame();
  const db = getFirestore();

  // ======= GAPI INIT + OAUTH ============
  async function initGapi() {
    setLoading(true);
    setError("");
    try {
      const gapi = await loadGapiScript();
      await new Promise((resolve, reject) => {
        gapi.load("client:auth2", {
          callback: resolve,
          onerror: reject,
        });
      });
      await gapi.client.init({
        apiKey: "", // Not strictly needed for OAuth user-specific
        discoveryDocs: [DISCOVERY_DOC],
        clientId: CLIENT_ID,
        scope: SCOPES,
      });
      setGapiLoaded(true);
      const auth2 = gapi.auth2.getAuthInstance();
      setAuthInst(auth2);
      setIsSignedIn(auth2.isSignedIn.get());
      setUserEmail((auth2.currentUser.get().getBasicProfile()?.getEmail()) || "");
      auth2.isSignedIn.listen((val) => {
        setIsSignedIn(val);
        if (val) setUserEmail(auth2.currentUser.get().getBasicProfile()?.getEmail() || "");
      });
    } catch (e) {
      setError("Google API failed to load. Try again.");
      setToast({ show: true, msg: "Google API load error.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    initGapi();
    // eslint-disable-next-line
  }, []);

  // ======= AUTH HANDLERS ==========
  // PUBLIC_INTERFACE
  function handleSignIn() {
    setLoading(true);
    if (!authInst) return;
    authInst.signIn().then(() => {
      setIsSignedIn(true);
      setUserEmail(authInst.currentUser.get().getBasicProfile()?.getEmail() || "");
      setToast({ show: true, msg: "Google sign-in successful!", type: "success" });
    }).catch(() => {
      setToast({ show: true, msg: "Failed to sign in.", type: "error" });
    }).finally(() => setLoading(false));
  }

  // PUBLIC_INTERFACE
  function handleSignOut() {
    if (!authInst) return;
    setLoading(true);
    authInst.signOut().then(() => {
      setIsSignedIn(false);
      setEvents([]);
      setUserEmail("");
      setToast({ show: true, msg: "Signed out.", type: "accent" });
    }).finally(() => setLoading(false));
  }

  // ======= FETCH EVENTS =======
  // PUBLIC_INTERFACE
  async function fetchCalendarEvents() {
    setLoading(true);
    setError("");
    try {
      const gapi = window.gapi;
      if (!gapi || !gapi.auth2.getAuthInstance().isSignedIn.get()) {
        setError("Not signed in.");
        return;
      }
      // Fetch upcoming 7 days
      const start = new Date();
      const end = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
      const params = {
        calendarId: "primary",
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        maxResults: 24,
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime"
      };
      const resp = await gapi.client.calendar.events.list(params);
      const gEvents = (resp.result.items || []).map((e, idx) => ({
        ...e,
        summary: e.summary,
        description: e.description,
        location: e.location,
        id: e.id,
        startStr: (e.start?.dateTime || e.start?.date || "").replace(/T.*/,""),
        endStr: (e.end?.dateTime || e.end?.date || "").replace(/T.*/,""),
        color: EVENT_COLORS[idx % EVENT_COLORS.length],
        canPush: false // Google events cannot push (only app-side)
      }));
      setEvents(gEvents);
      setToast({ show: true, msg: "Fetched GCal events!", type: "success" });
    } catch (e) {
      setError("Failed to fetch Google Calendar events.");
      setToast({ show: true, msg: "Fetch error: " + e.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // Fetch events after sign-in
  useEffect(() => {
    if (isSignedIn) fetchCalendarEvents();
    // eslint-disable-next-line
  }, [isSignedIn]);

  // === IDENTIFY BOSS BATTLES ===
  function remapWithBossBattles(gEvents) {
    // Cross-check gEvents against Firestore (quests/bosses)
    // App-side: "bossBattles" is an array of calendar event ids
    const battles = (game?.bossBattles || []);
    return gEvents.map((ev) =>
      ({
        ...ev,
        isBossBattle: battles.includes(ev.id)
      })
    );
  }

  // Remap events with boss battle flag on update
  useEffect(() => {
    setEvents((evs) => remapWithBossBattles(evs));
    // eslint-disable-next-line
  }, [game]);

  // ==== CONVERT TO BOSS BATTLE ====
  // PUBLIC_INTERFACE
  async function handleConvertToBossBattle(ev) {
    setBossMap((bm) => ({ ...bm, [ev.id]: "loading" }));
    try {
      // Save to Firestore (update "bossBattles" in Game doc)
      const cur = [...(game?.bossBattles || [])];
      if (!cur.includes(ev.id)) cur.push(ev.id);
      await updateGame({ bossBattles: cur });
      setBossMap((bm) => ({ ...bm, [ev.id]: "done" }));
      setToast({ show: true, msg: "Event converted to Boss Battle!", type: "success" });
    } catch (e) {
      setBossMap((bm) => ({ ...bm, [ev.id]: "error" }));
      setToast({ show: true, msg: "Failed: Firestore error.", type: "error" });
    }
  }

  // === PUSH APP EVENT TO GOOGLE CALENDAR ===
  // PUBLIC_INTERFACE
  async function handlePushToCalendar(appEv) {
    setSyncing(true);
    setBossMap((bm) => ({ ...bm, ["push_" + appEv.id]: "pushing" }));
    try {
      const gapi = window.gapi;
      // Compose event
      const req = {
        summary: appEv.summary,
        description: appEv.description || "Created from NeuroQuest RPG",
        start: { dateTime: appEv.start },
        end: { dateTime: appEv.end },
        location: appEv.location || undefined,
      };
      await gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: req
      });
      setToast({ show: true, msg: "Event pushed to Google Calendar!", type: "success" });
      setBossMap((bm) => ({ ...bm, ["push_" + appEv.id]: "done" }));
      // Optionally, refresh calendar
      fetchCalendarEvents();
    } catch (e) {
      setToast({ show: true, msg: "Failed to push event.", type: "error" });
      setBossMap((bm) => ({ ...bm, ["push_" + appEv.id]: "error" }));
    } finally {
      setSyncing(false);
    }
  }

  // === MOCK: APP EVENTS LIST (Bosses from Firestore, 7d) ===
  function appBossEvents() {
    // Insert demo generated boss battle from app not present in Google
    const allEvents = [];
    if (game?.bossBattles?.length) {
      game.bossBattles.forEach((eventId, idx) => {
        // If exists in events, skip (already mapped to GCal)
        if (!events.find((e) => e.id === eventId)) {
          allEvents.push({
            id: eventId,
            summary: `Boss Battle #${idx + 1}`,
            description: "Epic deadline battle — converted from app.",
            startStr: "TBD",
            endStr: "TBD",
            color: "#e87a41",
            isBossBattle: true,
            canPush: true,
            pushToCalendar: handlePushToCalendar,
            start: new Date().toISOString(),
            end: new Date(Date.now() + 60 * 60 * 1000).toISOString()
          });
        }
      });
    }
    // Could also add support for RPG "create boss battle" quick form
    return allEvents;
  }

  // == UI
  function GoogleSigninRPG() {
    return isSignedIn ? (
      <div className="flex flex-col items-center gap-3">
        <div className="text-sm text-accent font-bold mb-1">Signed in as {userEmail}</div>
        <NeonButton
          onClick={handleSignOut}
          variant="orange"
          className="py-1 px-4 font-bold"
        >
          Sign Out of Google
        </NeonButton>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-3">
        <NeonButton
          onClick={handleSignIn}
          className="px-8 py-3 text-lg font-bold"
          disabled={loading}
        >
          <span className="mr-2">🔑</span> Sign in with Google
        </NeonButton>
        <div className="text-textFaded text-xs mt-2">
          To sync your legendary quests with the kingdom’s calendar!
        </div>
      </div>
    );
  }

  function LoadingState() {
    return (
      <div className="flex items-center justify-center py-10">
        <FloatingOrb size={54}>
          <span className="text-accent text-3xl animate-spin" role="img" aria-label="loading">
            🕰️
          </span>
        </FloatingOrb>
        <span className="ml-4 text-brand-orange font-bold text-lg">
          Loading magic...
        </span>
      </div>
    );
  }

  function RPGGridEvents() {
    const mappedEvents = remapWithBossBattles(events);
    if (!mappedEvents.length)
      return (
        <div className="text-center text-textFaded font-bold mt-10">
          No calendar events found for next 7 days.
        </div>
      );
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-2 mb-2 w-full max-w-5xl">
        {mappedEvents.map((ev, idx) => (
          <RPGEventCard
            key={ev.id}
            event={ev}
            color={ev.color || EVENT_COLORS[idx % EVENT_COLORS.length]}
            onBoss={handleConvertToBossBattle}
            bossStatus={bossMap[ev.id]}
            pushing={syncing}
          />
        ))}
      </div>
    );
  }

  function AppGridEvents() {
    const bosses = appBossEvents();
    if (!bosses.length) return null;
    return (
      <div>
        <div className="font-bold text-accent text-lg mb-2 mt-7">App Boss Battles</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 mb-6">
          {bosses.map((ev, idx) => (
            <RPGEventCard
              key={ev.id}
              event={ev}
              color={ev.color}
              onBoss={() => {}}
              bossStatus={bossMap["push_" + ev.id]}
              pushing={syncing}
            />
          ))}
        </div>
      </div>
    );
  }

  // == RENDER ==
  return (
    <div className="flex flex-col items-center min-h-[65vh] justify-start animate-fadeIn px-2 w-full">
      <div className="text-3xl font-bold neon-accent mb-1 mt-1">Calendar Sync</div>
      <div className="text-base text-brand-orange mb-2 font-bold">
        Integrate your Google Calendar and turn real events into RPG Boss Battles!
      </div>
      <div className="w-full max-w-2xl neon-accent glass-morph border border-accent/30 rpg-rounded p-5 mb-7 mt-2 shadow-lg text-center">
        <GoogleSigninRPG />
        {!isSignedIn && error && (
          <div className="text-red-400 font-bold mt-2">{error}</div>
        )}
        {isSignedIn && (
          <NeonButton
            onClick={fetchCalendarEvents}
            variant="accent"
            className="px-5 py-2 mt-3 text-md font-bold"
            disabled={loading}
          >
            <span className="mr-2">📅</span>
            Fetch Next 7 Days
          </NeonButton>
        )}
      </div>
      {loading ? <LoadingState /> : (
        <div className="w-full max-w-6xl">
          <div className="text-lg text-accent font-bold mb-2">Upcoming Calendar Events</div>
          <RPGGridEvents />
          <AppGridEvents />
        </div>
      )}
      <Toast
        show={toast.show}
        message={toast.msg}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
      <Modal open={modal.open} onClose={() => setModal({ open: false, content: null })}>
        {modal.content}
      </Modal>
      <style>
        {`
        .glass-morph { background: rgba(18,17,32,0.80); border-radius: 20px; backdrop-filter: blur(8px);}
        .event-card { animation: fadeInEvent .62s cubic-bezier(.77,0,.18,1) both;}
        @keyframes fadeInEvent { 0%{opacity:0;transform:translateY(12px) scale(.94);} 100%{opacity:1;transform:translateY(0) scale(1);} }
        `}
      </style>
    </div>
  );
}
