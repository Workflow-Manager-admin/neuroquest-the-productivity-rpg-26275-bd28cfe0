import React from "react";

// PUBLIC_INTERFACE
function FloatingOrb({ children }) {
  /**
   * Modular floating orb UI, central RPG floating button/indicator.
   * Can host quest actions, quick stats, or notifications.
   * Props: children (orb content), can extend to accept style/animation props.
   */
  return (
    <div className="floating-orb w-24 h-24 rounded-full bg-neon-cyan/80 flex items-center justify-center shadow-neon-cyan animate-pulse relative">
      {children}
    </div>
  );
}

export default FloatingOrb;
