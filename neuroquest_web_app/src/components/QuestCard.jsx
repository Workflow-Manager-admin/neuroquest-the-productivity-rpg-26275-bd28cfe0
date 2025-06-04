import React from "react";
import PropTypes from "prop-types";
import NeonButton from "./NeonButton";

/**
 * QuestCard – Displays a single quest or task in RPG/fantasy theme.
 * Features:
 *  - Modular for main quest, side quest, or microtask.
 *  - Shows status, XP, order, type, and reordering/AI rewrite actions.
 *  - Neon-glow, immersive fantasy, responsive.
 *  - Interactive: Complete, Edit, AI Rewrite, Move Up/Down.
 */
// PUBLIC_INTERFACE
export default function QuestCard({
  title,
  description,
  xp,
  completed,
  onComplete,
  onAIRewrite,
  onMoveUp,
  onMoveDown,
  type, // "main" | "side" | "micro"
  order,
  onEdit,
  className = "",
}) {
  // Type-based accent color/icons
  const TYPE = {
    main: {
      bg: "bg-gradient-to-br from-accent/10 via-[#2e284c] to-[#271755]",
      border: "border-accent/80",
      icon: "🧭",
      label: "Main Quest",
    },
    side: {
      bg: "bg-gradient-to-br from-brand-orange/20 via-[#7c3aed22] to-[#251947]",
      border: "border-brand-orange",
      icon: "📝",
      label: "Side Quest",
    },
    micro: {
      bg: "bg-gradient-to-tr from-[#95feec22] via-[#6366f177] to-[#7c3aed33]",
      border: "border-cyan-300",
      icon: "💠",
      label: "Microtask",
    },
  }[type] || TYPE["main"];

  return (
    <div
      className={[
        "relative flex flex-col rpg-rounded neon-accent shadow-lg border-2",
        TYPE.bg,
        TYPE.border,
        className,
        completed ? "opacity-55 filter grayscale" : "opacity-100",
      ].join(" ")}
      style={{
        padding: "1.2rem 1.2rem 1rem 1.2rem",
        marginBottom: "0.7rem",
        minHeight: "98px",
        boxShadow:
          "0 0 18px 4px #7c3aed47, 0 0 8px #e87a4130, 0 2px 9px #000b",
        borderLeft: `6px solid var(--tw-color-accent, #7c3aed)`,
        borderBottom: `2.5px solid #7c3aed22`,
        transition: "box-shadow 0.3s",
        userSelect: "none",
      }}
      tabIndex={0}
      aria-label={`${TYPE.label}: ${title}`}
    >
      <div className="flex gap-3 items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">{TYPE.icon}</span>
          <span
            className="font-bold text-accent text-lg sm:text-xl font-poppins drop-shadow"
            style={{ color: "var(--tw-color-accent, #7c3aed)" }}
          >
            {title}
          </span>
          {type !== "main" && (
            <span className="ml-2 text-brand-orange text-md font-bold px-2 py-0.5 rpg-rounded bg-[#251947cc] border border-accent/30 shadow-inner">
              {TYPE.label}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-0 items-end">
          {typeof order === "number" && (
            <span className="text-sm text-textFaded font-mono opacity-60">
              #{order + 1}
            </span>
          )}
          <span
            className="text-xs font-bold text-lime-200 border py-0.5 px-2 rounded select-none bg-neutral-900/60"
            style={{
              borderColor: "#a78bfa",
              color: completed ? "#a1a1aa" : "#c3ffe2",
              opacity: 0.93,
            }}
          >
            {xp ?? 10} XP
          </span>
        </div>
      </div>
      {description && (
        <div
          className="text-textFaded text-[0.98em] mb-2 mt-1 px-2 font-inter"
          style={{ minHeight: "16px" }}
        >
          {description}
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-auto pt-2 justify-end">
        {!completed && (
          <NeonButton
            onClick={onComplete}
            variant="accent"
            size="sm"
            className="font-semibold px-4 py-1"
            aria-label="Mark as complete"
          >
            ✅ Complete
          </NeonButton>
        )}
        <NeonButton
          onClick={onEdit}
          variant="orange"
          size="sm"
          className="font-semibold px-3 py-1"
          aria-label="Edit"
        >
          ✏️ Edit
        </NeonButton>
        <NeonButton
          onClick={onAIRewrite}
          variant="accent"
          size="sm"
          className="font-semibold px-3 py-1"
          aria-label="AI Rewrite"
        >
          🪄 AI Rewrite
        </NeonButton>
        <NeonButton
          onClick={onMoveUp}
          disabled={order === 0}
          variant="accent"
          size="sm"
          className="px-2 py-1"
          aria-label="Move Up"
        >
          ↑
        </NeonButton>
        <NeonButton
          onClick={onMoveDown}
          variant="accent"
          size="sm"
          className="px-2 py-1"
          aria-label="Move Down"
        >
          ↓
        </NeonButton>
      </div>
      {completed && (
        <span className="absolute top-2 right-4 text-green-400 font-bold text-xs animate-glowPulse">
          Completed
        </span>
      )}
    </div>
  );
}

QuestCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  xp: PropTypes.number,
  completed: PropTypes.bool,
  onComplete: PropTypes.func,
  onAIRewrite: PropTypes.func,
  onMoveUp: PropTypes.func,
  onMoveDown: PropTypes.func,
  type: PropTypes.oneOf(["main", "side", "micro"]),
  order: PropTypes.number,
  onEdit: PropTypes.func,
  className: PropTypes.string,
};
