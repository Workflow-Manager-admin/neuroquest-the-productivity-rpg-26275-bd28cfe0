import React, { useState, useRef, useEffect } from "react";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { useGame } from "../context/GameContext";
import { useUser } from "../context/UserContext";
import QuestCard from "../components/QuestCard";
import Modal from "../components/Modal";
import NeonButton from "../components/NeonButton";
import FloatingOrb from "../components/FloatingOrb";
import Toast from "../components/Toast";
import LottieAnim from "../components/LottieAnim";

// Fantasy icons (Ensure these assets exist or fallback)
const questIcons = [
  "/src/assets/quest_scroll.png",
  "/src/assets/side_quest.png",
  "/src/assets/microtask.png",
];

// Quest section definitions
const QUEST_SECTIONS = [
  {
    key: "main",
    label: "Main Questline",
    accent: "from-brand-orange via-accent to-[#c084fc]",
    icon: "🧭",
  },
  {
    key: "side",
    label: "Side Quests",
    accent: "from-accent via-brand-orange to-[#4ade80]",
    icon: "🧙‍♂️",
  },
  {
    key: "micro",
    label: "Microtasks",
    accent: "from-[#4ade80] via-brand-orange to-accent",
    icon: "📝",
  },
];

// Build animated section styles
function sectionGradient(accent) {
  return `bg-gradient-to-r ${accent} bg-opacity-90 shadow-neon-accent`;
}

// Helper — default quest struct
function createQuest(options = {}) {
  return {
    id: options.id || `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: options.title || "",
    description: options.description || "",
    section: options.section || "main",
    xp: options.xp || 50,
    completed: options.completed || false,
    order: options.order || 0,
    createdAt: Date.now(),
    icon: options.icon || null,
    gpt: !!options.gpt,
  };
}

// Grab next available order for a section
function getNextOrder(quests, section) {
  const arr = quests.filter(q => q.section === section);
  return arr.length > 0 ? Math.max(...arr.map(q => q.order)) + 1 : 0;
}

// Sort quests by (section, order)
function sortQuests(quests) {
  return [...quests].sort((a, b) => (a.section === b.section
    ? a.order - b.order
    : QUEST_SECTIONS.findIndex(s => s.key === a.section) - QUEST_SECTIONS.findIndex(s => s.key === b.section)
  ));
}

// === Drag-n-drop logic for lists by section ===
function useSectionDragDrop({ quests, setQuests }) {
  const dragItem = useRef();
  const dragSection = useRef();

  // Drag start
  function onDragStart(e, quest, sectionKey) {
    dragItem.current = quest;
    dragSection.current = sectionKey;
    e.dataTransfer.effectAllowed = "move";
  }

  // Allow drop
  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  // Drop handler
  function onDrop(e, targetSection) {
    e.preventDefault();
    const dragged = dragItem.current;
    if (!dragged || dragSection.current == null) return;
    // Move quest to new section, reassign order to end
    setQuests(prev => {
      const other = prev.filter(q => q.id !== dragged.id);
      const maxOrder = getNextOrder(prev, targetSection);
      return sortQuests([
        ...other,
        { ...dragged, section: targetSection, order: maxOrder }
      ]);
    });
    dragItem.current = null;
    dragSection.current = null;
  }

  // Drag within section (reorder)
  function onDropReorder(e, overQuest) {
    e.preventDefault();
    const dragged = dragItem.current;
    if (!dragged || !overQuest) return;
    if (dragged.section !== overQuest.section) return;
    setQuests(prev => {
      const filtered = prev.filter(q => q.id !== dragged.id);
      // insert at position of overQuest's order, then adjust orders
      const sectionQs = filtered.filter(q => q.section === overQuest.section);
      const idx = sectionQs.findIndex(q => q.id === overQuest.id);
      sectionQs.splice(idx, 0, { ...dragged, section: overQuest.section });
      // set correct .order
      const updated = sectionQs.map((q, i) => ({ ...q, order: i }));
      const notSection = filtered.filter(q => q.section !== overQuest.section);
      return sortQuests([...notSection, ...updated]);
    });
    dragItem.current = null;
  }

  // Reset drag
  function clearDrag() {
    dragItem.current = null;
    dragSection.current = null;
  }

  return {
    onDragStart,
    onDragOver,
    onDrop,
    onDropReorder,
    clearDrag,
  };
}

// =======================
// PUBLIC_INTERFACE
/**
 * QuestLog - Immersive RPG quest journal. Drag/drop sections, Firestore CRUD, AI quest rewrite, animations.
 */
export default function QuestLog() {
  const { user } = useUser();
  const { game, updateGame } = useGame();
  const db = getFirestore();

  // State
  const [quests, setQuests] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editQuest, setEditQuest] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "accent" });
  const [aiLoading, setAiLoading] = useState(false);
  const [sectionOpen, setSectionOpen] = useState({ main: true, side: true, micro: false });

  // Initial load from context/game/Firestore
  useEffect(() => {
    if (game?.quests && Array.isArray(game.quests)) setQuests(sortQuests(game.quests));
  }, [game.quests]);

  // Persist quests to Firestore on changes
  async function syncQuests(newQuests) {
    if (!user) return;
    setSaving(true);
    try {
      await updateGame({ quests: newQuests });
      setToast({ show: true, msg: "Quest log updated!", type: "success" });
    } catch (e) {
      setToast({ show: true, msg: "Failed to save quests.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  // Drag-and-drop
  const dragDrop = useSectionDragDrop({ quests, setQuests });

  // ========== Quest CRUD ==========

  // Add quest modal open
  function handleAddQuest(sectionKey = "side") {
    setEditQuest({ section: sectionKey });
    setModalOpen(true);
  }

  // Edit quest (from card click)
  function handleEditQuest(quest) {
    setEditQuest({ ...quest });
    setModalOpen(true);
  }

  // Modal Save (add/edit)
  function handleSaveQuest(q) {
    let newList = [...quests];
    if (q.id) {
      // Edit existing
      newList = newList.map(quest => quest.id === q.id ? { ...quest, ...q } : quest);
    } else {
      // Add new
      const id = `q-${Date.now()}`;
      const quest = createQuest({
        id,
        ...q,
        order: getNextOrder(quests, q.section),
        completed: false,
        icon: q.icon || questIcons[QUEST_SECTIONS.findIndex(s => s.key===q.section)] || null,
        gpt: false,
      });
      newList = sortQuests([...newList, quest]);
    }
    setQuests(newList);
    syncQuests(newList);
    setModalOpen(false);
    setEditQuest(null);
  }

  // Delete quest
  function handleDeleteQuest(qid) {
    const newList = quests.filter(q => q.id !== qid);
    setQuests(newList);
    syncQuests(newList);
    setModalOpen(false);
    setEditQuest(null);
  }

  // Toggle completed
  function handleToggleComplete(qid) {
    setQuests(prev => {
      const updated = prev.map(
        q => q.id === qid ? { ...q, completed: !q.completed } : q
      );
      syncQuests(updated);
      return updated;
    });
  }

  // AI-powered rewrite (OpenAI)
  async function handleRewriteQuest(quest) {
    setAiLoading(true);
    const prompt = `Rewrite this productivity quest as an epic fantasy RPG objective. Keep it motivating, concise, and full of magic:
"${quest.title}: ${quest.description}"`;
    let apiKey = process.env.REACT_APP_OPENAI_API_KEY || window.OPENAI_API_KEY || "";
    if (!apiKey) {
      // Dev fallback—just add "The Legendary" to title
      setTimeout(() => {
        const rewritten = {
          ...quest,
          title: "The Legendary " + quest.title,
          description: quest.description + "(Fantasy flavor added!)",
          gpt: true,
        };
        const newList = quests.map(q => q.id === quest.id ? rewritten : q);
        setQuests(newList);
        syncQuests(newList);
        setAiLoading(false);
        setToast({ show: true, msg: "Fantasy rewrite applied (demo).", type: "success" });
      }, 1200);
      return;
    }
    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 86,
          temperature: 0.91,
        })
      });
      if (!resp.ok) throw new Error("OpenAI API error");
      const data = await resp.json();
      const text = data?.choices?.[0]?.message?.content || "";
      // Split into lines for title/desc
      const [title, ...rest] = text.split(/[:\-–]\s*/);
      const rewritten = {
        ...quest,
        title: (title || quest.title).trim(),
        description: (rest.join(":").trim() || text.trim() || quest.description),
        gpt: true,
      };
      const newList = quests.map(q => q.id === quest.id ? rewritten : q);
      setQuests(newList);
      syncQuests(newList);
      setToast({ show: true, msg: "Quest rewritten with fantasy flair!", type: "success" });
    } catch (err) {
      setToast({ show: true, msg: "AI rewrite failed.", type: "error" });
    } finally {
      setAiLoading(false);
    }
  }

  // Toggle/collapse sections (animated)
  function handleToggleSection(key) {
    setSectionOpen(prev => ({ ...prev, [key]: !prev[key] }));
  }

  // === Modal content for adding/editing quests ===
  function QuestModal({ open, onClose, quest, onSave, onDelete }) {
    const [form, setForm] = useState(
      quest ? { ...quest } : { section: "side", title: "", description: "", xp: 30 }
    );

    function handleChange(e) {
      const { name, value } = e.target;
      setForm(f => ({ ...f, [name]: value }));
    }

    function handleSubmit(e) {
      e.preventDefault();
      if (!form.title.trim() || !form.description.trim()) return;
      onSave(form);
    }

    return (
      <Modal open={open} onClose={onClose} title={quest?.id ? "Edit Quest" : "Add Quest"}>
        <form className="flex flex-col gap-3 mt-3" onSubmit={handleSubmit}>
          <label className="text-accent font-semibold">
            Title
            <input
              name="title"
              type="text"
              maxLength={60}
              value={form.title}
              onChange={handleChange}
              className="w-full rpg-rounded px-3 py-2 border-2 border-accent/30 bg-black/40 text-white font-bold mt-1 mb-2"
              autoFocus
              required
              placeholder="Retrieve the Crystal of Focus"
            />
          </label>
          <label className="text-accent font-semibold">
            Description
            <textarea
              name="description"
              rows={2}
              maxLength={200}
              value={form.description}
              onChange={handleChange}
              className="w-full rpg-rounded px-3 py-2 border-2 border-accent/30 bg-black/40 text-white mt-1"
              required
              placeholder="Describe the objective, e.g., Finish the draft by Thursday."
            />
          </label>
          <label className="text-accent font-semibold">
            Section
            <select
              name="section"
              value={form.section}
              onChange={handleChange}
              className="w-full rpg-rounded px-3 py-2 border border-accent/40 bg-neutral-900 text-white mt-1"
            >
              {QUEST_SECTIONS.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </label>
          <label className="text-accent font-semibold">
            XP
            <input
              name="xp"
              type="number"
              value={form.xp}
              onChange={e => setForm(f => ({ ...f, xp: Number(e.target.value) }))}
              className="w-32 rpg-rounded px-3 py-1 border border-accent/40 bg-black/40 text-brand-orange mt-1"
              min={5}
              max={500}
              step={5}
            />
          </label>
          <div className="flex justify-between gap-2 mt-3">
            <NeonButton
              type="button"
              variant="orange"
              className="flex-1"
              onClick={onClose}
            >Cancel</NeonButton>
            {quest?.id && (
              <NeonButton
                type="button"
                variant="orange"
                className="flex-1"
                onClick={() => onDelete(quest.id)}
              >Delete</NeonButton>
            )}
            <NeonButton type="submit" className="flex-1" variant="accent" disabled={saving}>
              {quest?.id ? "Save" : "Add"}
            </NeonButton>
          </div>
        </form>
      </Modal>
    );
  }

  // ========== Render ==========

  return (
    <div className="w-full max-w-3xl mx-auto pt-0 pb-8">
      {/* 
        Fantasy quest log/book Unsplash/PD image for RPG flavor.
        Devs: swap src as desired for your custom quest journal visual.
        https://unsplash.com/photos/person-writing-on-white-paper-AX2THeP9prw 
      */}
      <img
        src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=550&q=80"
        alt="Fantasy quest journal"
        className="w-full max-w-md mx-auto rounded-xl border-2 border-accent shadow-lg object-cover mt-2 mb-4"
        onError={e => {e.target.style.display='none'}}
        style={{background: "#181332"}}
      />
      <span className="block text-5xl text-accent my-2" aria-label="Book" style={{display:'none'}}>📖</span>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-accent neon-accent mb-2 drop-shadow-sm flex-1">
          <span className="mr-2" role="img" aria-label="Quest Journal">📜</span>
          Quest Journal
        </h1>
        <NeonButton onClick={() => handleAddQuest("side")} className="px-6 py-2 text-lg font-bold"><span className="mr-2">＋</span> Add Quest</NeonButton>
      </div>
      <div className="mb-7 text-textFaded text-base max-w-xl">
        <span className="font-bold text-brand-orange">Drag and drop</span> quests between sections or to reorder! Mark them complete, or supercharge with AI. All quests sync across devices.
      </div>

      {/* Draggable Quest Sections */}
      <div className="flex flex-col gap-8">
        {QUEST_SECTIONS.map(section => {
          const sectionQuests = sortQuests(quests.filter(q => q.section === section.key));
          return (
            <div key={section.key} className="rpg-rounded shadow-xl neon-accent border-2 overflow-hidden bg-black/70 relative">
              {/* Section Header */}
              <div
                className={
                  "flex items-center gap-3 cursor-pointer px-5 py-2 select-none " +
                  sectionGradient(section.accent) + " transition-all"
                }
                style={{ backdropFilter: "blur(5px)" }}
                onClick={() => handleToggleSection(section.key)}
                tabIndex={0}
                aria-expanded={sectionOpen[section.key]}
              >
                <span className="text-3xl mr-1">{section.icon}</span>
                <div className="text-xl font-bold text-white flex-1">{section.label}</div>
                <span className={"ml-4 text-accent text-xl transition-all " + (sectionOpen[section.key] ? "rotate-0" : "-rotate-90")}>
                  ▼
                </span>
                <NeonButton
                  variant="orange"
                  onClick={e => { e.stopPropagation(); handleAddQuest(section.key); }}
                  className="ml-2 px-3 py-1 text-md"
                >＋</NeonButton>
              </div>
              {/* Section Body - animated */}
              <div
                className={"transition-all duration-500 overflow-hidden bg-black/70 px-3 py-2 " +
                  (sectionOpen[section.key]
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-60 pointer-events-none border-0")
                }
                style={{
                  borderTop: "1px solid #7c3aed33",
                  borderBottomLeftRadius: "16px",
                  borderBottomRightRadius: "16px",
                }}
                onDragOver={e => dragDrop.onDragOver(e)}
                onDrop={e => dragDrop.onDrop(e, section.key)}
              >
                {sectionQuests.length === 0 && (
                  <div className="my-4 text-white/40 italic text-center">No quests here yet! Add a quest to begin your journey.</div>
                )}
                {/* Quest Cards (draggable) */}
                {sectionOpen[section.key] && sectionQuests.map((q, idx) => (
                  <div
                    key={q.id}
                    draggable
                    onDragStart={e => dragDrop.onDragStart(e, q, section.key)}
                    onDrop={e => dragDrop.onDropReorder(e, q)}
                    onDragOver={e => dragDrop.onDragOver(e)}
                    className="transition-transform"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={q.completed}
                        onChange={() => handleToggleComplete(q.id)}
                        className="w-5 h-5 mr-2 accent-accent cursor-pointer mt-1"
                        style={{ transform: "scale(1.1)" }}
                        title={q.completed?"Mark incomplete":"Mark complete"}
                      />
                      <div className="flex-1"
                        style={{ opacity: q.completed ? 0.55 : 1, filter: q.completed ? "grayscale(0.65)" : "none" }}>
                        <QuestCard
                          title={q.title}
                          description={q.description}
                          xp={q.xp}
                          icon={q.icon || questIcons[QUEST_SECTIONS.findIndex(s=>s.key===q.section)]}
                          onClick={() => handleEditQuest(q)}
                          completed={q.completed}
                        />
                      </div>
                      <button
                        className="bg-accent/60 border-rpg border px-2 py-1 text-white rounded shadow hover:bg-accent transition mr-1"
                        style={{ fontSize: "1.3rem", marginRight: 3 }}
                        onClick={() => handleRewriteQuest(q)}
                        disabled={aiLoading}
                        title="Rewrite (AI)"
                        type="button"
                      >🪄</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Quest Modal */}
      <QuestModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditQuest(null); }}
        quest={editQuest}
        onSave={handleSaveQuest}
        onDelete={handleDeleteQuest}
      />
      {/* Toast & AI Anim */}
      <Toast
        show={toast.show}
        onClose={() => setToast(t => ({ ...t, show: false }))}
        message={toast.msg}
        type={toast.type}
      />
      {aiLoading && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60">
          <FloatingOrb size={90}>
            <LottieAnim src="/src/assets/magic-flare.json" size={85} loop autoplay />
            <div className="text-brand-orange font-bold text-lg mt-2">Enchanting quest...</div>
          </FloatingOrb>
        </div>
      )}
      {/* Some RPG animated styling */}
      <style>{`
        .rpg-rounded { border-radius: 16px; }
        .neon-accent { box-shadow: 0 0 15px 2px #7c3aed44, 0 0 4px 2px #7c3aed; }
        .border-rpg { border: 2px solid #7c3aed60; }
        .shadow-xl { box-shadow: 0 4px 36px 2px #7c3aed22, 0 1px 12px #1a181a88; }
        .transition-transform { transition: transform 0.18s cubic-bezier(.71,0,.27,1); }
      `}
      </style>
    </div>
  );
}
