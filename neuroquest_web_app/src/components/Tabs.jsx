import React, { useState } from "react";
import PropTypes from "prop-types";
/**
 * Tabs – animated neon-glow RPG/fantasy tabs, mobile-optimized and immersive.
 * @param {string[]} tabs - Array of tab names.
 * @param {number} defaultIndex
 * @param {function} onChange
 * @param {React.ReactNode[]} children - One child per tab.
 * @param {string} size - sm, md, lg
 */
// PUBLIC_INTERFACE
export default function Tabs({
  tabs,
  defaultIndex = 0,
  onChange,
  children,
  size = "md",
}) {
  const [current, setCurrent] = useState(defaultIndex);
  const tabSize =
    size === "sm"
      ? "py-1 px-2 text-sm"
      : size === "lg"
      ? "py-3 px-5 text-lg"
      : "py-2 px-4";

  return (
    <div>
      <nav className="flex gap-2 mb-3" role="tablist">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`rpg-tab font-semibold transition-neon-colors text-accent border-b-2 ${
              idx === current
                ? "active bg-black/90 neon-accent border-accent rpg-glow-anim"
                : "bg-neutral-900 text-textFaded border-transparent"
            } ${tabSize}`}
            style={{
              fontFamily: "'Poppins','Inter','Cinzel Decorative',serif",
              letterSpacing: "0.02em"
            }}
            tabIndex={0}
            onClick={() => {
              setCurrent(idx);
              onChange && onChange(idx);
            }}
            type="button"
            role="tab"
            aria-selected={idx === current}
            aria-controls={`tabpanel-${idx}`}
            id={`tab-${idx}`}
          >
            <span className="relative z-10">{tab}</span>
            {/* Fantastical neon flicker on active tab */}
            <span
              aria-hidden
              className={
                "absolute left-0 top-0 w-full h-full pointer-events-none " +
                (idx === current
                  ? "animate-pulse rounded-xl bg-accent/10 blur-sm"
                  : "")
              }
            ></span>
          </button>
        ))}
      </nav>
      <div
        id={`tabpanel-${current}`}
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`tab-${current}`}
      >
        {Array.isArray(children) ? children[current] : children}
      </div>
    </div>
  );
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultIndex: PropTypes.number,
  onChange: PropTypes.func,
  children: PropTypes.node,
  size: PropTypes.string
};
