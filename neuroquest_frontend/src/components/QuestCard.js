import React from "react";

/**
 * PUBLIC_INTERFACE
 * QuestCard component.
 * Displays a single quest or task, RPG-styled.
 * Props:
 *  - title (string) quest name
 *  - description (string)
 *  - status (string, e.g., 'active', 'completed', 'failed')
 *  - reward (string, optional)
 */
function QuestCard({
  title = "Quest Title",
  description = "[Description here]",
  status = "active",
  reward,
}) {
  return (
    <div className={`questcard questcard--${status} bg-midnight rounded-md py-4 px-5 my-2 shadow-neon-violet border-l-4
        ${status === "completed" ? "border-rpg-gold" : "border-neon-cyan"}
        flex flex-col gap-2
    `}>
      <div className="questcard__header flex items-center gap-2">
        <div className="questcard__dot w-3 h-3 rounded-full"
          style={{
            backgroundColor: status === "completed"
              ? "#ffd700"
              : status === "active"
              ? "#00ffff"
              : "#fb37ff",
          }}
        />
        <h3 className="questcard__title font-bold">{title}</h3>
        {reward && (
          <div className="questcard__reward px-2 py-0.5 ml-3 text-xs rounded bg-violetneon text-white">
            {reward}
          </div>
        )}
      </div>
      <div className="questcard__desc text-sm text-white/80">{description}</div>
    </div>
  );
}

export default QuestCard;
