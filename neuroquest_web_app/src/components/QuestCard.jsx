import React from "react";
import PropTypes from "prop-types";

/**
 * PUBLIC_INTERFACE
 * QuestCard – RPG/fantasy quest/task card with glowing effects,
 * animation hooks, and modular handlers for actions.
 * Accepts title, description, XP, and handlers for complete/edit/reorder/AI rewrite.
 */
export default function QuestCard({
  title,
  description = "",
  completed = false,
  xp = 0,
  order,
  onComplete,
  onAIRewrite,
  onMoveUp,
  onMoveDown,
  onEdit,
  className = "",
  style = {},
  ...props
}) {
  return (
    <div
      className={`relative neon-accent bg-[#1B1432de] shadow-xl border-2 border-accent/30 rpg-rounded px-4 py-3 mb-1 flex flex-col transition ${className} ${
        completed ? "opacity-50 grayscale" : ""
      }`}
      style={{
        boxShadow: "0 0 13px 2px #7c3aed55,0 0 7px 3px #a78bfa99",
        ...style,
      }}
      tabIndex={0}
      aria-label="Quest Card"
      {...props}
    >
      <div className="flex flex-row gap-3 items-center justify-between mb-0">
        <div className="flex flex-col gap-0">
          <div className="text-accent font-bold text-lg font-poppins">
            {title}
          </div>
          {!!description && (
            <div className="text-xs text-textFaded mt-0.5 max-w-[90vw] truncate">
              {description}
            </div>
          )}
        </div>
        <div className="flex flex-row gap-1 items-center">
          {typeof xp === "number" && xp > 0 && (
            <span className="bg-gradient-to-br from-accent to-brand-orange text-xs font-bold text-white px-3 py-1 rounded-full shadow-neon-gold neon-accent border border-accent/50 ml-2">
              +{xp} XP
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-3 mb-0 items-center">
        {/* Complete button */}
        {onComplete && !completed && (
          <button
            className="py-0.5 px-3 font-bold text-sm bg-accent/90 text-white neon-accent rounded shadow transition hover:scale-110"
            onClick={onComplete}
            type="button"
          >
            Complete
          </button>
        )}
        {/* Edit */}
        {onEdit && (
          <button
            className="py-0.5 px-2 font-bold text-sm bg-black/60 text-accent border-accent neon-accent rounded shadow transition"
            onClick={onEdit}
            type="button"
            aria-label="Edit"
          >
            ✏️
          </button>
        )}
        {/* Move up/down */}
        {onMoveUp && (
          <button
            className="p-1 px-2 text-xs text-accent bg-black/30 neon-accent rounded"
            onClick={onMoveUp}
            type="button"
            aria-label="Move Up"
          >
            ▲
          </button>
        )}
        {onMoveDown && (
          <button
            className="p-1 px-2 text-xs text-accent bg-black/30 neon-accent rounded"
            onClick={onMoveDown}
            type="button"
            aria-label="Move Down"
          >
            ▼
          </button>
        )}
        {/* AI-rewrite */}
        {onAIRewrite && (
          <button
            className="py-0.5 px-2 font-bold text-xs bg-gradient-to-l from-brand-orange to-fuchsia-400 text-white neon-accent border border-accent/40 rounded shadow ml-2 transition"
            onClick={onAIRewrite}
            type="button"
            aria-label="Rewrite with AI"
            title="Rewrite in RPG style"
          >
            💡 AI
          </button>
        )}
        {completed && (
          <span className="ml-auto text-green-400 font-bold text-xs animate-pulse">
            DONE
          </span>
        )}
      </div>
    </div>
  );
}

QuestCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  completed: PropTypes.bool,
  xp: PropTypes.number,
  order: PropTypes.number,
  onComplete: PropTypes.func,
  onAIRewrite: PropTypes.func,
  onMoveUp: PropTypes.func,
  onMoveDown: PropTypes.func,
  onEdit: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};
