import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * PUBLIC_INTERFACE
 * LoginPage - Handles Google and Email/Password authentication flows.
 * Features: premium neon-glow visual, detailed error/success UI, session security, production UX.
 */
function LoginPage() {
  // Auth Context & Refs
  const { loginWithGoogle, loginWithEmail, register, currentUser, loading } = useAuth();
  const navigate = useNavigate();

  // Local UI state
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState(""); // "success"|"error"|string
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();

  // With successful login or registration, redirect to dashboard
  if (!loading && currentUser) {
    setTimeout(() => navigate("/dashboard"), 400);
    return (
      <div className="login-page__status flex flex-col items-center justify-center py-28 gap-4">
        <div className="animate-pulse text-3xl text-neon-cyan font-bold drop-shadow-neon-cyan">Welcome back, {currentUser.displayName || currentUser.email || "Hero"}!</div>
        <span className="mt-2 text-lg text-white/80 font-medium">Redirecting to your Dashboard...</span>
      </div>
    );
  }

  // Handle Email/Auth: login or register
  async function handleEmailAuth(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");
    setMessage("");
    try {
      if (isRegistering) {
        await register(email, password, displayName);
        setStatus("success");
        setMessage("Registration successful! Welcome, " + (displayName || email));
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        await loginWithEmail(email, password);
        setStatus("success");
        setMessage("Welcome back!");
        setTimeout(() => navigate("/dashboard"), 900);
      }
    } catch (err) {
      setStatus("error");
      // Detailed error message transform
      let m = err?.message || err?.code || "Authentication failed";
      if (/auth\/wrong-password/.test(m)) m = "Incorrect password. Please retry.";
      else if (/auth\/user-not-found/.test(m)) m = "Account does not exist. Sign up first!";
      else if (/auth\/email-already-in-use/.test(m)) m = "This email is already registered. Please log in.";
      else if (/auth\/invalid-email/.test(m)) m = "Please enter a valid email address.";
      else if (/auth\/too-many-requests/.test(m)) m = "Too many attempts, please wait and retry.";
      setMessage(m);
      setTimeout(() => setSubmitting(false), 1500);
      return;
    }
    setSubmitting(false);
  }

  // Handle Google Sign-In (with error UX)
  async function handleGoogleAuth() {
    setSubmitting(true);
    setMessage("");
    setStatus("");
    try {
      await loginWithGoogle();
      setStatus("success");
      setMessage("Signed in with Google. Welcome!");
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      setStatus("error");
      setMessage("Could not sign in: " + (err.message || err.code));
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page container flex flex-col items-center justify-center gap-8 py-16 relative z-10 max-w-lg mx-auto">
      <div
        className={`w-full px-8 py-10 bg-midnight/95 rounded-2xl shadow-neon-cyan border-2 border-violetneon md:px-12 flex flex-col items-center
        ${submitting ? "opacity-80 blur-[1px] pointer-events-none" : ""}`}
        aria-live="polite"
        role="form"
        aria-labelledby="login-page-title"
      >
        <h2
          id="login-page-title"
          className="text-3xl font-display font-bold text-neon-cyan shadow-neon-cyan drop-shadow mb-4 text-center"
        >
          {isRegistering ? "Sign Up for NeuroQuest" : "Login to NeuroQuest"}
        </h2>
        <div className="mb-7 text-white/80 font-medium text-center">
          {isRegistering
            ? <>Create your free account to start your RPG adventure.</>
            : <>Gamify your focus. Unlock XP & Boss Battles.<br />Sign in below to play.</>
          }
        </div>

        {/* Google Auth */}
        <button
          onClick={handleGoogleAuth}
          className={`btn flex items-center justify-center gap-2 w-full py-3 bg-neon-cyan/80 hover:bg-neon-pink text-black rounded-full font-bold shadow-neon-cyan text-lg 
            transition-all focus:ring-2 focus:ring-neon-pink focus:outline-none mb-4`}
          disabled={submitting}
          aria-label="Sign in with Google"
          tabIndex={0}
        >
          <svg className="w-6 h-6" width="24" height="24" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <g>
              <circle cx="24" cy="24" r="23" fill="#fff" />
              <path fill="#4285F4" d="M24 10a13.99 13.99 0 0113.63 11.36h-11.6V24h7.8C33.31 27.06 30.21 29.5 27 29.5c-3.86 0-7-3.13-7-7s3.14-7 7-7z" />
              <path fill="#34A853" d="M43.61 20.5H42V24h8v-2c0-2-.38-3.7-.91-5.3L43.61 20.5z" />
              <path fill="#FBBC05" d="M24 9c3.86 0 7 3.13 7 7h7.8v-.01C39.45 10.99 32.43 7 24 7c-8.44 0-15.45 3.99-16.8 8.99L12.8 17.5C13.71 12.33 18.37 9 24 9z" />
              <path fill="#EA4335" d="M8.55 13.37l3.45 4.36c.55 1.25 1.25 2.43 2.24 3.15l-.22.36-4.36-3.45a16.12 16.12 0 010-4.42z" />
            </g>
          </svg>
          <span className="font-semibold tracking-wide">Sign {isRegistering ? "up" : "in"} with Google</span>
        </button>
        <div className="w-full text-center text-white/40 text-xs mb-3 flex items-center gap-2">
          <span className="flex-grow border-t border-gray-700"></span>
          <span>or</span>
          <span className="flex-grow border-t border-gray-700"></span>
        </div>

        {/* Email & Password Auth Form */}
        <form
          onSubmit={handleEmailAuth}
          className="w-full flex flex-col gap-4"
          aria-label={isRegistering ? "Sign Up Form" : "Login Form"}
        >
          {isRegistering && (
            <div className="flex flex-col gap-1 mb-1">
              <label htmlFor="displayName" className="text-xs text-neon-cyan font-bold">Display Name</label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="nickname"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="rounded px-3 py-2 bg-gray-900/90 border border-neon-cyan focus:ring-2 focus:ring-violetneon outline-none text-white shadow"
                placeholder="Let others know your legend..."
                tabIndex={0}
                aria-required="false"
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs text-neon-cyan font-bold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              ref={emailRef}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded px-3 py-2 bg-gray-900/90 border border-neon-cyan focus:ring-2 focus:ring-violetneon outline-none text-white shadow"
              placeholder="your@email.com"
              tabIndex={0}
              aria-required="true"
              aria-label="Email Address"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs text-neon-cyan font-bold">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              ref={passwordRef}
              autoComplete={isRegistering ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="rounded px-3 py-2 bg-gray-900/90 border border-neon-cyan focus:ring-2 focus:ring-violetneon outline-none text-white shadow"
              placeholder={isRegistering ? "Choose a secure password" : "Your password"}
              tabIndex={0}
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            className="btn btn-large mt-2 px-1 py-3 w-full bg-violetneon text-white font-bold rounded-full shadow-neon-violet hover:bg-neon-cyan hover:text-black transition-all active:scale-98"
            disabled={submitting}
            aria-busy={submitting}
            aria-label={isRegistering ? "Sign Up" : "Login"}
          >
            {isRegistering ? "Create Account" : "Login"}
          </button>
        </form>
        {/* Toggle between login/sign up */}
        <div className="py-3 text-center text-white/60 text-sm">
          {isRegistering ? (
            <>
              Already a player?{" "}
              <button
                className="text-neon-cyan font-bold hover:underline"
                onClick={() => {
                  setIsRegistering(false);
                  setMessage(""); setStatus("");
                }}
                tabIndex={0}
              >
                Login instead
              </button>
            </>
          ) : (
            <>
              New adventurer?{" "}
              <button
                className="text-neon-cyan font-bold hover:underline"
                onClick={() => {
                  setIsRegistering(true);
                  setMessage(""); setStatus("");
                }}
                tabIndex={0}
              >
                Sign up
              </button>
            </>
          )}
        </div>

        {/* Error & success status UX */}
        {(message || status) && (
          <div
            className={`w-full my-2 p-3 rounded-lg bg-black/70 border ${
              status === "success" ? "border-neon-cyan text-neon-cyan" : status === "error"
                ? "border-neon-pink text-neon-pink"
                : "border-white/20 text-white/90"
            } drop-shadow animate-flash animate-ease-in-out text-center font-medium text-base transition-all`}
            role={status === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {message}
          </div>
        )}
      </div>
      {/* Neon orb accent UX for RPG style */}
      <div
        aria-hidden="true"
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-[5.5rem] h-[5.5rem] bg-neon-cyan rounded-full blur-3xl opacity-60 pointer-events-none z-0 shadow-neon-cyan animate-pulse"
      ></div>
    </div>
  );
}

export default LoginPage;
