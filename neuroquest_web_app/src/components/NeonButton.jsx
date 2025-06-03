import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
/**
 * NeonButton – glowing, animated, responsive, disabled/variant support; fantasy pop with neon aura and ripple.
 * @param {function} onClick - Click handler.
 * @param {string} children - Button content
 * @param {boolean} disabled - Disable state
 * @param {string} variant - accent/brand-orange/etc.
 */
 // PUBLIC_INTERFACE
export default function NeonButton({
  onClick,
  children,
  disabled = false,
  variant = "accent",
  className = "",
  ...rest
}) {
  const palette = {
    accent: "bg-accent text-white shadow-neon-accent",
    orange: "bg-brand-orange text-black shadow-neon-gold",
    gold: "bg-glowGold text-black shadow-neon-gold"
  };
  return (
    <button
      type="button"
      className={classNames(
        "px-6 py-2 rpg-rounded font-bold neon-glow transition-all duration-200 focus:outline-none border-2 border-accent/60 hover:bg-accent/80 hover:shadow-2xl hover:ring-2 hover:ring-accent/70 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none",
        palette[variant] || palette.accent,
        "relative overflow-hidden",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
      {/* Neon ripple effect */}
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 pointer-events-none z-0 block w-0 h-0 bg-accent opacity-70 rounded-full neon-accent"
        style={{
          transform: "translate(-50%,-50%)",
          transition: "all 0.33s cubic-bezier(.68,-0.25,.68,1.25)",
        }}
      />
    </button>
  );
}

NeonButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  variant: PropTypes.string,
  className: PropTypes.string,
};
