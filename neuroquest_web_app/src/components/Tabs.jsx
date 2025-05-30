import React, { useState } from "react";
/**
 * Tabs – classic RPG/fantasy segment-tabs.
 * @param {string[]} tabs - Array of tab names.
 * @param {number} defaultIndex
 * @param {function} onChange
 * @param {React.ReactNode[]} children - One child per tab.
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
    size === "sm" ? "py-1 px-2 text-sm" : size === "lg" ? "py-3 px-5 text-lg" : "py-2 px-4";
  return (
    <div>
      <nav className="flex gap-2 mb-3">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`rpg-rounded font-semibold transition text-accent border-b-2 ${
              idx === current
                ? "bg-black/70 neon-accent shadow border-accent"
                : "bg-neutral-900 text-textFaded border-transparent"
            } ${tabSize}`}
            onClick={() => {
              setCurrent(idx);
              onChange && onChange(idx);
            }}
            type="button"
          >
            {tab}
          </button>
        ))}
      </nav>
      <div>{Array.isArray(children) ? children[current] : children}</div>
    </div>
  );
}
