import React from "react";
import classNames from "classnames";
/**
 * NeonButton – glowing, responsive, disabled/variant support.
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
  ...rest
}) {
  const palette = {
    accent: "bg-accent text-white shadow-neon-accent",
    orange: "bg-brand-orange text-black shadow-md",
  };
  return (
    <button
      type="button"
      className={classNames(
        "px-6 py-2 rpg-rounded font-bold transition-all duration-100 focus:outline-none border-2 border-accent/60 hover:bg-accent/80 hover:shadow-2xl disabled:opacity-60 disabled:pointer-events-none",
        palette[variant] || palette.accent
      )}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
