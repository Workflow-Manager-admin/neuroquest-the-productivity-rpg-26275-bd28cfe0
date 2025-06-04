import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import LottieAnim from "../components/LottieAnim";
import NeonButton from "../components/NeonButton";
import Toast from "../components/Toast";
import FloatingOrb from "../components/FloatingOrb";

// (Replace with actual Lottie wizard JSON file path in assets)
const WIZARD_LOTTIE = "/src/assets/wizard-magic.json";

/**
 * LoginPage – Advanced RPG login with glassmorphic neon-glow card, Lottie wizard,
 * Auth via Google/Email, animated feedback, error handling, themed UI.
 * Redirects on success.
 */
// PUBLIC_INTERFACE
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "", type: "accent" });
  const navigate = useNavigate();

  const auth = getAuth();

  // PUBLIC_INTERFACE
  async function handleGoogle() {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      setToast({ show: true, msg: "Welcome, adventurer!", type: "success" });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (e) {
      setError("Google sign-in failed. Try again or use Email.");
      setToast({ show: true, msg: "Google sign-in error.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function handleEmail(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      setToast({ show: true, msg: "Welcome, adventurer!", type: "success" });
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (e) {
      setError("Incorrect email or password. Try again.");
      setToast({ show: true, msg: "Email login error.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // Redirect if already logged in
  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) navigate("/dashboard");
    });
    return () => unsub();
  }, [auth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#160e33] via-[#251947] to-[#0f172a]">
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* RPG background or magical glowing particles could go here */}
        <div className="w-full h-full blur-2xl opacity-60" />
      </div>
      <div
        className="relative z-10 w-full max-w-md px-4 py-8 glass-morph neon-accent border-2 border-accent/80 shadow-2xl rpg-rounded flex flex-col items-center gap-6 animate-fadeIn"
        style={{
          background: "rgba(34, 18, 67, 0.83)",
          boxShadow: "0 0 24px 5px #7c3aed66, 0 0 6px 2px #f8fafc1a",
          borderRadius: "28px",
          border: "2.5px solid #9f88ea66",
          backdropFilter: "blur(11px)",
        }}
      >
        <div className="flex flex-col items-center gap-2 w-full">
          <FloatingOrb size={90}>
            <LottieAnim
              src={WIZARD_LOTTIE}
              size={85}
              autoplay
              loop
            />
          </FloatingOrb>
          <h1
            className="font-extrabold text-4xl text-accent neon-accent drop-shadow-lg"
            style={{
              fontFamily: "'Poppins', serif",
              letterSpacing: "0.04em",
              marginTop: "14px",
            }}
          >
            Welcome, Adventurer
          </h1>
          <p className="text-base text-textFaded text-center -mt-2">
            Embark on your quest.<br />
            <span className="text-brand-orange font-semibold">Login to begin your journey.</span>
          </p>
        </div>

        <NeonButton
          onClick={handleGoogle}
          disabled={loading}
          variant="accent"
          className="w-full py-3 mt-2 font-semibold text-lg flex items-center justify-center gap-2"
        >
          <svg width="25" height="25" viewBox="0 0 20 20" fill="currentColor" className="mr-2 -ml-1"><g><path d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.79h5.52c-.24 1.3-1.28 2.41-2.64 2.85v2.36h4.28C18.7 15.41 19.6 13.05 19.6 10.23z" fill="#4285F4"/><path d="M10 20c2.43 0 4.47-.81 5.97-2.19l-4.28-2.36c-.6.4-1.37.63-2.16.63-1.67 0-3.08-1.13-3.58-2.67H2.55v2.52C4.05 18.29 6.83 20 10 20z" fill="#34A853"/><path d="M6.42 12.57A3.997 3.997 0 0 1 6 10c0-.89.15-1.74.42-2.57V4.91H2.55A9.98 9.98 0 0 0 0 10c0 1.63.39 3.17 1.08 4.51l4.34-2.01z" fill="#FBBC05"/><path d="M10 4c1.32 0 2.51.45 3.44 1.33l2.58-2.52C14.46 1.47 12.43.55 10 .55 6.83.55 4.05 2.29 2.55 4.91l3.87 3.52C6.92 6.46 8.34 4 10 4z" fill="#EA4335"/></g></svg>
          Sign in with Google
        </NeonButton>

        <div className="my-2 text-center text-accent font-bold">OR</div>

        {!showEmail ? (
          <NeonButton
            onClick={() => setShowEmail(true)}
            disabled={loading}
            variant="orange"
            className="w-full font-bold py-2"
          >
            Use Email &amp; Password
          </NeonButton>
        ) : (
          <form className="w-full flex flex-col gap-4 fade-in-quick" onSubmit={handleEmail}>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rpg-rounded border-2 border-accent/30 bg-black/60 text-white focus:border-accent focus:ring-accent focus:outline-none font-medium text-lg placeholder:text-textFaded shadow-sm"
              autoComplete="email"
              placeholder="Email Address"
              required
            />
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full px-4 py-3 rpg-rounded border-2 border-accent/30 bg-black/60 text-white focus:border-accent focus:ring-accent focus:outline-none font-medium text-lg placeholder:text-textFaded shadow-sm"
              autoComplete="current-password"
              placeholder="Password"
              required
              minLength={6}
            />
            <NeonButton
              type="submit"
              disabled={loading}
              variant="accent"
              className="w-full font-bold py-3 mt-2"
            >
              {loading ? (
                <span className="animate-pulse">Logging in...</span>
              ) : (
                "Login"
              )}
            </NeonButton>
          </form>
        )}

        {error && <div className="w-full text-center text-red-400 font-bold mt-2">{error}</div>}

        <div className="w-full text-center text-textFaded mt-4 text-xs opacity-75">
          <span className="opacity-90">Having trouble? <a href="mailto:support@neuroquest.app" className="underline text-accent hover:text-brand-orange">Contact support</a></span>
        </div>
      </div>
      <Toast
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.msg}
        type={toast.type}
      />

      <style>
        {`
          .glass-morph {
            background: rgba(33, 18, 69, 0.80);
            backdrop-filter: blur(12px);
          }
          .fade-in-quick { animation: fadeIn .45s cubic-bezier(.65,0,.35,1) both; }
          @keyframes fadeIn { 0%{opacity:0;transform:translateY(16px);} 100%{opacity:1;transform:translateY(0);} }
        `}
      </style>
    </div>
  );
}
