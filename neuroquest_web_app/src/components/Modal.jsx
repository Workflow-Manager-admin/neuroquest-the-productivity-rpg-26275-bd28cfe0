import React from "react";
import PropTypes from "prop-types";
/**
 * Modal - Neon fantasy modal.
 * @param {boolean} open - Show/hide.
 * @param {function} onClose - handler.
 * @param {React.ReactNode} children
 * @param {string} title - Modal header title.
 */
 // PUBLIC_INTERFACE
export default function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-2">
      <div className="bg-[#191332] neon-accent border-2 border-accent/60 rpg-rounded shadow-2xl w-full max-w-md p-6 animate-fadeIn relative">
        <button
          className="absolute top-2 right-2 text-accent font-bold text-xl focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {title && (
          <h2 className="text-accent font-bold text-lg mb-3 neon-accent">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  title: PropTypes.string
};
