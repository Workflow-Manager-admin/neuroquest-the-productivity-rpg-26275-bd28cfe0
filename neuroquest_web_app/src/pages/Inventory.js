import React from "react";

// PUBLIC_INTERFACE
/**
 * Inventory page: Display grid of earned cosmetics/tokens (placeholder icons).
 */
const sampleInventory = [
  { name: "Mystic Hat", type: "cosmetic", icon: "🧙‍♂️", equipped: true },
  { name: "Silver Sword", type: "cosmetic", icon: "🗡️" },
  { name: "Daily Token", type: "token", icon: "🔹" },
  { name: "Streak Flame", type: "token", icon: "🔥" },
  { name: "Celestial Cape", type: "cosmetic", icon: "🦸‍♂️" },
  { name: "Boss Medallion", type: "token", icon: "🥇" },
  { name: "Crystal Orb", type: "cosmetic", icon: "🔮" },
  { name: "Focus Badge", type: "token", icon: "🎯" }
];

export default function Inventory() {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-6 pb-8">
      <h1 className="text-2xl font-bold neon-glow mb-6 text-center">Inventory & Cosmetics</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {sampleInventory.map((item, idx) => (
          <div
            key={idx}
            className={`glass-bg flex flex-col items-center border-2 ${
              item.equipped ? "border-kaviaAccent neon-glow" : "border-transparent"
            } rounded-2xl px-4 py-6 shadow-lg relative`}
          >
            <span
              className="text-4xl sm:text-5xl mb-1 select-none"
              role="img"
              aria-label={item.name}
            >
              {item.icon}
            </span>
            <div className="text-base font-semibold text-center text-white/90 mb-1">
              {item.name}
            </div>
            <div className="text-xs text-kaviaAccent/80 italic">{item.type}</div>
            {item.equipped && (
              <span className="absolute top-2 right-3 neon-glow text-xs px-2 py-0.5 rounded bg-kaviaAccent/80 text-kaviaDark font-bold">
                Equipped
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-6 text-xs text-white/50">
        Earn cosmetics and tokens by winning boss battles, staying focused, and climbing questlines!
      </div>
    </div>
  );
}
