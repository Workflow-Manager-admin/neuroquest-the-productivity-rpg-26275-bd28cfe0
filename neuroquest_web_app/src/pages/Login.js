import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth, provider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import LottieAnim from "../components/LottieAnim";
import LoaderAnim from "../assets/lottie/loader.json";

// PUBLIC_INTERFACE
/**
 * Login page: Google or email/password, RPG look.
 */
export default function Login() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      setError("Google login failed");
    }
    setLoading(false);
  };

  const handleEmail = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pw);
    } catch (e) {
      setError("Invalid login – try again.");
    }
    setLoading(false);
  };

  if (user) {
    window.location.href = "/dashboard";
    return null;
  }
  return (
    <div className="mx-auto max-w-lg px-8 py-10 mt-16 glass-bg rounded-3xl shadow-xl flex flex-col items-center justify-center">
      <div className="mb-3">
        <LottieAnim anim={LoaderAnim} height={70} />
      </div>
      <div className="text-3xl font-extrabold neon-glow text-center mb-2">Welcome to NeuroQuest</div>
      <div className="text-base text-white/80 mb-5 text-center">
        Enter the Kingdom to begin your epic productivity journey.<br />Sign in to track quests, battle bosses, and master your focus.
      </div>
      <button
        onClick={handleGoogle}
        className="neon-btn w-full mb-4 flex items-center justify-center"
        disabled={loading}
      >
        <span className="mr-2 text-lg">🔮</span> Sign in with Google
      </button>
      <div className="w-full flex flex-row items-center gap-2 my-3">
        <div className="flex-1 border-t border-kaviaAccent/20" />
        <span className="text-xs text-kaviaAccent neon-glow">or</span>
        <div className="flex-1 border-t border-kaviaAccent/20" />
      </div>
      <form
        className="flex flex-col gap-3 w-full"
        onSubmit={handleEmail}
        autoComplete="off"
      >
        <input
          type="email"
          required
          value={email}
          placeholder="Email address"
          onChange={e => setEmail(e.target.value)}
          className="rounded px-4 py-2 bg-kaviaDark/70 border border-glass text-white focus:ring-1 focus:ring-kaviaAccent"
        />
        <input
          type="password"
          required
          value={pw}
          placeholder="Password"
          onChange={e => setPw(e.target.value)}
          className="rounded px-4 py-2 bg-kaviaDark/70 border border-glass text-white focus:ring-1 focus:ring-kaviaAccent"
        />
        <button
          type="submit"
          className="neon-btn w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && (
        <div className="text-red-400 mt-3 text-sm neon-glow">{error}</div>
      )}
      <div className="mt-8 text-center text-xs text-white/40">
        Don&apos;t have an account? <span className="text-kaviaAccent">Sign in with Google to start your quest!</span>
      </div>
    </div>
  );
}
