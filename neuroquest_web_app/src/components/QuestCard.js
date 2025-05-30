import React from "react";

// PUBLIC_INTERFACE
/**
 * QuestCard: Shows RPG quest, with tasks list, progress, due date, and toggles.
 * onTaskToggle(tid) called when a subtask is toggled (for parent state).
 */
export default function QuestCard({ quest, onTaskToggle }) {
  const percent = Math.round((quest.tasks.filter(t => t.done).length / quest.tasks.length) * 100);

  return (
    <div className="glass-bg rounded-2xl px-5 py-6 shadow-lg neon-glow mb-2">
      <div className="flex flex-row justify-between items-center mb-2">
        <div>
          <div className="font-semibold text-lg">{quest.title}</div>
          <div className="text-xs text-white/60">{quest.desc}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-kaviaAccent font-semibold">{percent}%</span>
          <span className="text-xs text-white/60">Due: {quest.due}</span>
        </div>
      </div>
      <div className="w-full h-2 rounded-xl bg-kaviaDark/40 mb-3 mt-1">
        <div
          className="h-2 rounded-xl bg-gradient-to-r from-kaviaAccent to-yellow-400"
          style={{ width: `${percent}%`, transition: "width 0.8s" }}
        />
      </div>
      <ul className="flex flex-col gap-2 mt-2">
        {quest.tasks.map(t => (
          <li key={t.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!t.done}
              className="accent-kaviaAccent w-4 h-4"
              onChange={() => onTaskToggle && onTaskToggle(t.id)}
            />
            <span className={`${t.done ? "line-through text-white/60" : "text-white/90"}`}>
              {t.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
