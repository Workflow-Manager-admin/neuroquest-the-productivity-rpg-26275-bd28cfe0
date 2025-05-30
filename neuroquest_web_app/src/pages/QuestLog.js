import React, { useState } from "react";
import QuestCard from "../components/QuestCard";

// PUBLIC_INTERFACE
/**
 * QuestLog page – All quests: main, side, microtasks. Editable.
 */
const sampleMainQuest = {
  id: 1,
  title: "Launch My Startup",
  desc: "Complete MVP, onboard first 10 users.",
  due: "2024-07-30",
  progress: 0.6,
  tasks: [
    { id: "mt1", label: "Finish UI Prototype", done: true },
    { id: "mt2", label: "Code API", done: false },
    { id: "mt3", label: "Write pitch deck", done: false }
  ]
};
const sampleSideQuests = [
  {
    id: 2,
    title: "Read 5 Business Books",
    desc: "Expand your wisdom.",
    due: "2024-08-01",
    progress: 0.2,
    tasks: [{ id: "sq1", label: "Read 'The Lean Startup'", done: true }]
  }
];

export default function QuestLog() {
  const [mainQuest, setMainQuest] = useState(sampleMainQuest);
  const [sideQuests, setSideQuests] = useState(sampleSideQuests);
  const [editOpen, setEditOpen] = useState(false);

  // Handler sketches for quest actions.
  const handleTaskToggle = (quest, setQuest, tid) => {
    setQuest({
      ...quest,
      tasks: quest.tasks.map(t =>
        t.id === tid ? { ...t, done: !t.done } : t
      )
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold neon-glow py-2 mb-1 mt-3 text-center">Quest Log</h1>
      <section>
        <h2 className="text-lg neon-glow mb-3">Main Quest</h2>
        <QuestCard
          quest={mainQuest}
          onTaskToggle={tid => handleTaskToggle(mainQuest, setMainQuest, tid)}
        />
      </section>
      <section>
        <h2 className="text-lg neon-glow mb-3">Side Quests</h2>
        <div className="flex flex-col gap-5">
          {sideQuests.map(q => (
            <QuestCard
              key={q.id}
              quest={q}
              onTaskToggle={tid =>
                setSideQuests(sideQuests.map(sq =>
                  sq.id === q.id
                    ? { ...sq, tasks: sq.tasks.map(t => t.id === tid ? { ...t, done: !t.done } : t) }
                    : sq
                ))
              }
            />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-lg neon-glow my-3">Microtasks</h2>
        <div className="text-sm text-white/50 text-center">You have <span className="neon-glow">3</span> microtasks due today.</div>
        {/* In real app, map + manage microtasks */}
      </section>
    </div>
  );
}
