import React from "react";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
/**
 * Avatar: Shows user image in RPG ring, fallback to emoji.
 */
export default function Avatar() {
  const { user } = useAuth();
  const url = user?.photoURL;
  const name = user?.displayName || "Hero";
  return (
    <div className="mx-auto flex flex-col items-center">
      <div className="rounded-full border-4 border-kaviaAccent shadow-neon overflow-hidden w-24 h-24 mb-2 glass-bg flex items-center justify-center">
        {url
          ? <img src={url} alt={name} className="w-full h-full object-cover" />
          : <span className="text-5xl">🧙‍♂️</span>
        }
      </div>
      <div className="text-base neon-glow font-semibold mt-1 text-center">{name}</div>
      <div className="text-xs text-white/60 italic">Adventurer</div>
    </div>
  );
}
