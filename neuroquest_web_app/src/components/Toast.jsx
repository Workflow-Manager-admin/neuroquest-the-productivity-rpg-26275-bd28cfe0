import React from "react";
/**
 * Toast - notification, position fixed, neon style.
 * @param {string} message
 * @param {boolean} show
 * @param {function} onClose
 * @param {string} type - accent/success/error.
 */
 // PUBLIC_INTERFACE
export default function Toast({ message, show, onClose, type = "accent" }) {
  if (!show) return null;
  const colors = {
    accent: "bg-accent text-white",
    success: "bg-green-600 text-white",
    error: "bg-red-500 text-white",
  };
  return (
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 z-[99] rpg-rounded shadow-2xl border-2 border-black/40 font-bold ${colors[type]} neon-accent animate-fadeIn`}>
      <span>{message}</span>
      <button className="ml-4 text-white/70 hover:text-white text-xl font-bold focus:outline-none" onClick={onClose} aria-label="Close toast">×</button>
    </div>
  );
}
