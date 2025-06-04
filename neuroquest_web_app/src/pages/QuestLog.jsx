import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import QuestCard from "../components/QuestCard";
import NeonButton from "../components/NeonButton";
import Tabs from "../components/Tabs";
import Modal from "../components/Modal";
import FloatingOrb from "../components/FloatingOrb";
import LottieAnim from "../components/LottieAnim";
import { useApiKey } from "../context/ApiKeyContext";

/*
  QuestLog – RPG modular quest/task manager page.
  - Three sections ("Main Questline", "Side Quests", "Microtasks") via tabs
  - Each uses modular QuestCard, styled with RPG/neon fantasy
  - Supports reorder (drag or up/down), AI Rewrite (OpenAI), complete/edit/XP actions
  - Fully responsive, mobile optimized, immersive
*/

// AI rewrite - demo implementation for OpenAI GPT call
async function aiRewriteTask(prompt, getKey) {
  const apiKey = getKey();
  // fallback: return transformed prompt if no key
  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 1000));
    return `${prompt} (rewritten RPG style!)`;
  }
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content:
              `Rewrite this productivity task in an immersive RPG style for a player quest log. Make it fun, adventurous, motivating.\n\nOriginal: "${prompt}"\n\nRPG themed version:`,
          },
        ],
        max_tokens: 80,
        temperature: 0.85,
      }),
    });
    if (!res.ok) throw new Error("API error");
    const payload = await res.json();
    const text =
      payload.choices?.[0]?.message?.content ||
      `${prompt} (rewritten RPG style!)`;
    return text.replace(/"$/, "").replace(/^"|"$/g, "").trim();
  } catch {
    return `${prompt} (AI failed - demo output)`;
  }
}

// PUBLIC_INTERFACE
/**
 * QuestLog page: displays, edits, and manages all quest tasks.
 * Responsive, immersive, and supports AI/tap controls and RPG aesthetic.
 */
export default function QuestLog() {
  const { game, updateGame } = useGame();
  const { getKey } = useApiKey();

  // Demo initial structure/fallback (use Firestore if available)
  const [mainQuests, setMainQuests] = useState(
    game.mainQuests ||
      (game?.onboarding?.roadmap?.map((step, idx) => ({
        title: step,
        description: "",
        completed: false,
        xp: 50 + idx * 10,
        type: "main",
        order: idx,
      })) ?? [
        {
          title: "Step 1: Enter the Forest of Uncertainty",
          description: "Clarify your ultimate purpose.",
          completed: false,
          xp: 50,
          type: "main",
          order: 0,
        },
      ])
  );
  const [sideQuests, setSideQuests] = useState(
    game.sideQuests || [
      {
        title: "Organize your study scrolls",
        description: "Tidy your supplies for an intellect boost.",
        completed: false,
        xp: 25,
        type: "side",
        order: 0,
      },
    ]
  );
  const [microTasks, setMicroTasks] = useState(
    game.microTasks || [
      {
        title: "Drink Potion of Focus",
        description: "Hydrate for +1 stamina!",
        completed: false,
        xp: 5,
        type: "micro",
        order: 0,
      },
    ]
  );

  const [tab, setTab] = useState(0);
  const [modal, setModal] = useState({ open: false, task: null, list: "", idx: null });
  const [newQuest, setNewQuest] = useState({ title: "", description: "", type: "side" });
  const [showAdd, setShowAdd] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Section data reference and setters by tab
  const sections = [
    {
      name: "Main Questline",
      data: mainQuests,
      setData: setMainQuests,
      type: "main",
      accent: "accent",
      addAllowed: false,
      emptyMsg: "No main quests found.",
    },
    {
      name: "Side Quests",
      data: sideQuests,
      setData: setSideQuests,
      type: "side",
      accent: "brand-orange",
      addAllowed: true,
      emptyMsg: "No side quests available.",
    },
    {
      name: "Microtasks",
      data: microTasks,
      setData: setMicroTasks,
      type: "micro",
      accent: "cyan-300",
      addAllowed: true,
      emptyMsg: "No microtasks yet. Add one!",
    },
  ];

  // Renders QuestCard list with reordering/AI controls
  function renderQuestSection({ data, setData, type, accent, addAllowed, emptyMsg }) {
    // Move quest in list
    const moveTask = (i, delta) => {
      if (i + delta < 0 || i + delta >= data.length) return;
      const newArr = [...data];
      [newArr[i], newArr[i + delta]] = [newArr[i + delta], newArr[i]];
      setData(
        newArr.map((t, idx2) => ({ ...t, order: idx2 }))
      );
    };
    // Complete quest
    const completeTask = (i) => {
      const newArr = data.map((t, idx2) =>
        idx2 === i ? { ...t, completed: true } : t
      );
      setData(newArr);
      updateGame({
        [`${type}Quests`]: newArr,
        xp: (game.xp || 0) + (data[i]?.xp || 0),
      });
    };
    // AI Rewrite quest title/desc
    const handleAIRewrite = async (i) => {
      setAiLoading(true);
      const t = data[i];
      const newTitle = await aiRewriteTask(t.title, getKey);
      const newArr = data.map((tt, idx2) =>
        idx2 === i ? { ...tt, title: newTitle } : tt
      );
      setData(newArr);
      setAiLoading(false);
      updateGame({ [`${type}Quests`]: newArr });
    };
    // Edit opens modal
    const handleEdit = (i) => setModal({ open: true, task: data[i], list: type, idx: i });
    // Save edit from modal
    const saveEdit = (task, idx) => {
      const setList = { main: setMainQuests, side: setSideQuests, micro: setMicroTasks }[type];
      const arr = [...data];
      arr[idx] = { ...arr[idx], ...task };
      setList(arr);
      updateGame({ [`${type}Quests`]: arr });
      setModal({ open: false, task: null, list: "", idx: null });
    };
    // Section rendering logic
    return (
      <div className="w-full flex flex-col gap-2 mt-3 max-w-xl mx-auto">
        {(!data || data.length === 0) && (
          <div className="text-textFaded text-center italic my-7">{emptyMsg}</div>
        )}
        {data.map((q, i) => (
          <QuestCard
            key={q.title + i}
            {...q}
            order={i}
            onComplete={() => completeTask(i)}
            onAIRewrite={() => handleAIRewrite(i)}
            onMoveUp={() => moveTask(i, -1)}
            onMoveDown={() => moveTask(i, +1)}
            onEdit={() => handleEdit(i)}
          />
        ))}
        {modal.open && modal.list === type && (
          <Modal open title="Edit Quest" onClose={() => setModal({ open: false, task: null, list: "", idx: null })}>
            <EditQuestForm
              task={modal.task}
              onSave={t => saveEdit(t, modal.idx)}
              onCancel={() => setModal({ open: false, task: null, list: "", idx: null })}
            />
          </Modal>
        )}
        {addAllowed && (
          <div className="w-full mt-4 flex flex-col items-end">
            {!showAdd ? (
              <NeonButton onClick={() => setShowAdd(true)} className="py-2 px-6 font-bold" variant={accent}>
                + Add {type === "side" ? "Side Quest" : "Microtask"}
              </NeonButton>
            ) : (
              <AddQuestForm
                type={type}
                onCancel={() => {
                  setShowAdd(false);
                  setNewQuest({ title: "", description: "", type });
                }}
                onAdd={(q) => {
                  const arr = [...data, { ...q, order: data.length, completed: false, type }];
                  setData(arr);
                  updateGame({ [`${type}Quests`]: arr });
                  setShowAdd(false);
                  setNewQuest({ title: "", description: "", type });
                }}
                initial={newQuest}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // --- Renders ---
  return (
    <div className="flex flex-col w-full min-h-[74vh] items-center px-1 pt-2 pb-14 animate-fadeIn">
      <div className="w-full flex flex-col items-center">
        <FloatingOrb size={82} color="#a78bfa">
          <LottieAnim src="/src/assets/starfield.json" size={66} autoplay loop />
        </FloatingOrb>
        <h1 className="text-3xl md:text-4xl font-poppins neon-accent text-accent font-extrabold text-center drop-shadow-lg mt-2 mb-1"
          style={{
            textShadow: "0 0 16px #8f39fb77, 0 0 21px #b948f966",
          }}
        >
          Quest Log
        </h1>
        <div className="text-base text-brand-orange font-bold mb-2">
          Track, edit, and conquer your personal quests.
        </div>
        <Tabs
          tabs={sections.map(s => s.name)}
          defaultIndex={0}
          size="md"
          onChange={setTab}
        >
          {/* Main Questline */}
          {sections.map((section, idx) =>
            <div key={section.name}>
              {aiLoading && (
                <div className="my-4 flex gap-3 items-center text-accent animate-pulse font-bold text-lg">
                  <span>Rewriting with AI magic&hellip;</span>
                  <LottieAnim src="/src/assets/magic-fantasy-particles.json" size={34} autoplay loop />
                </div>
              )}
              {renderQuestSection(section)}
            </div>
          )}
        </Tabs>
      </div>
      {/* RPG Ambient/Glow and Responsive accents */}
      <style>{`
        .rpg-rounded { border-radius: 16px; }
        .neon-accent { box-shadow: 0 0 17px 2px #7c3aed99, 0 0 4px 2px #7c3aed66; }
        .animate-fadeIn { animation: fadeInRPG .61s cubic-bezier(.62,0,.39,1) both;}
        @keyframes fadeInRPG {
          0%{opacity:0;transform:translateY(25px) scale(.97);}
          100%{opacity:1;transform:translateY(0) scale(1);}
        }
      `}</style>
    </div>
  );
}

// Quest Add form
function AddQuestForm({ type, onCancel, onAdd, initial = {} }) {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  return (
    <form className="w-full flex flex-col items-start gap-3 mt-2 bg-[#1a132eaa] glass-morph p-4 rounded"
      onSubmit={e => {
        e.preventDefault();
        if (title.trim()) onAdd({ title, description, xp: type === "side" ? 20 : 5, completed: false, type });
      }}
    >
      <label className="font-bold text-accent">Title</label>
      <input
        type="text"
        value={title}
        required maxLength={96}
        onChange={e => setTitle(e.target.value)}
        className="w-full px-3 py-2 rpg-rounded border border-accent/30 bg-black/60 text-white"
        placeholder={`New ${type === "side" ? "Side Quest" : "Microtask"}`}
        autoFocus
      />
      <label className="font-bold text-accent">Description</label>
      <textarea
        value={description}
        maxLength={140}
        onChange={e => setDescription(e.target.value)}
        className="w-full px-3 py-2 rpg-rounded border border-accent/30 bg-black/60 text-white resize-y min-h-[44px]"
        placeholder="What must be done? (optional)"
      />
      <div className="flex gap-2 mt-2 self-end">
        <NeonButton type="submit" variant="accent" size="sm" className="px-4 py-1">Add</NeonButton>
        <NeonButton type="button" onClick={onCancel} variant="orange" size="sm" className="px-3 py-1">Cancel</NeonButton>
      </div>
    </form>
  );
}

// Quest Edit form (for modal)
function EditQuestForm({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  return (
    <form className="w-full flex flex-col items-start gap-3 mt-1" onSubmit={e => {
      e.preventDefault();
      if (title.trim()) onSave({ ...task, title, description });
    }}>
      <label className="font-bold text-accent">Title</label>
      <input
        type="text"
        value={title}
        required maxLength={96}
        onChange={e => setTitle(e.target.value)}
        className="w-full px-3 py-2 rpg-rounded border border-accent/30 bg-black/60 text-white"
        autoFocus
      />
      <label className="font-bold text-accent">Description</label>
      <textarea
        value={description}
        maxLength={140}
        onChange={e => setDescription(e.target.value)}
        className="w-full px-3 py-2 rpg-rounded border border-accent/30 bg-black/60 text-white resize-y min-h-[44px]"
      />
      <div className="flex gap-3 mt-2 self-end">
        <NeonButton type="submit" variant="accent" size="sm" className="px-5 py-1">Save</NeonButton>
        <NeonButton type="button" onClick={onCancel} variant="orange" size="sm" className="px-4 py-1">Cancel</NeonButton>
      </div>
    </form>
  );
}
EditQuestForm.defaultProps = { onCancel: () => {} };
