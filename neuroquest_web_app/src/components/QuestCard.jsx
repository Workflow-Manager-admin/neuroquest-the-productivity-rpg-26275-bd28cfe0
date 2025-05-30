import React from "react";
import Avatar from "./Avatar";
/**
 * QuestCard - show quest title, XP, summary, optional art/zone/fantasy accent.
 * @param {string} title - Quest title.
 * @param {string} description - Quest summary/goal.
 * @param {number} xp - XP value.
 * @param {string} icon - Fantasy image/icon (optional).
 * @param {function} onClick - Handler for click/tap.
 * @param {boolean} completed - Status.
 */
 // PUBLIC_INTERFACE
export default function QuestCard({
  title,
  description,
  xp,
  icon,
  onClick,
  completed = false,
}) {
  return (
    <div
      className={`relative bg-black/80 neon-accent border border-accent/40 rpg-rounded shadow-lg p-4 mb-2 transition-transform duration-150 hover:scale-105 cursor-pointer flex gap-3`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-pressed={completed}
    >
      <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
        {icon ? (
          <img src={icon} alt="Zone" className="w-14 h-14 object-cover rpg-rounded" />
        ) : (
          <Avatar size={48} demoIndex={Math.floor(Math.random() * 3)} />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-accent text-lg">{title}</h2>
          {completed && (
            <span className="bg-green-400/80 px-2 py-0.5 rounded text-xs text-black ml-2 shadow inline-block">
              Complete
            </span>
          )}
        </div>
        <p className="text-textFaded text-sm">{description}</p>
        <div className="font-bold text-brand-orange mt-1">+{xp} XP</div>
      </div>
    </div>
  );
}
