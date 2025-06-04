import React from "react";
import Avatar from "./Avatar";
import PropTypes from "prop-types";
/**
 * QuestCard - show quest title, XP, summary, optional art/zone/fantasy accent.
 * @param {string} title - Quest title.
 * @param {string} description - Quest summary/goal.
 * @param {number} xp - XP value.
 * @param {string} icon - Fantasy image/icon (optional).
 * 
 * If icon is missing, fallback to a public domain fantasy scroll icon.
 * TODO: For highest polish, add your PNG/SVG to /src/assets and pass its import as the icon prop!
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
          <img
            src={icon}
            alt="Zone"
            className="w-14 h-14 object-cover rpg-rounded"
            onError={e => {
              // Provide scroll icon as backup if quest image fails
              e.target.onerror = null;
              e.target.src =
                "https://opengameart.org/sites/default/files/styles/medium/public/scroll_17.png";
              // On double-fail, fallback to emoji/text
              window.setTimeout(() => {
                if (e.target.offsetParent && e.target.style.display !== "none") {
                  e.target.style.display = "none";
                  e.target.offsetParent.innerHTML +=
                    `<span style="position:absolute;top:50%;left:17px;font-size:1.1em;color:#ffdbb0;text-shadow:0 0 8px #e7c278">📜</span>`;
                }
              }, 400);
            }}
            // TODO: Drop a custom PNG quest icon in /src/assets and supply as 'icon' prop for max RPG style!
          />
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

QuestCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  xp: PropTypes.number.isRequired,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  completed: PropTypes.bool
};
