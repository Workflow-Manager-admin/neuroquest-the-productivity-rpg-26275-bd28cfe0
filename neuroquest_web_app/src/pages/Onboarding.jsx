import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useUser } from "../context/UserContext";
import NeonButton from "../components/NeonButton";
import Avatar from "../components/Avatar";
import FloatingOrb from "../components/FloatingOrb";
import Toast from "../components/Toast";
import LottieAnim from "../components/LottieAnim";
import { useApiKey } from "../context/ApiKeyContext";

// Demo Lottie asset (replace with actual in /src/assets/)
const WIZARD_LOTTIE = "/src/assets/epic-wizard-intro.json";

// Avatar demo list (should match available images in /src/assets/)
const AVATAR_DEMOS = [
  { src: "/src/assets/wizard_hero_01.png", name: "Wizard" },
  { src: "/src/assets/witch_hero_01.png", name: "Witch" },
  { src: "/src/assets/knight_hero_01.png", name: "Knight" },
];

const STEP = {
  INTRO: 0,
  GOAL: 1,
  AVATAR: 2,
};

function rpgDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// PUBLIC_INTERFACE
export default function Onboarding() {
  // State
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [roadmap, setRoadmap] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [roadmapErr, setRoadmapErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "accent" });
  const [transitioning, setTransitioning] = useState(false);

  const { user, profile, updateProfile, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const db = getFirestore();
  const { getKey } = useApiKey();

  // Auto-redirect if onboarding done
  useEffect(() => {
    if (!userLoading && user && profile && profile.onboarding && profile.onboarding.complete) {
      navigate("/dashboard");
    }
  }, [user, profile, userLoading, navigate]);

  // Prefill onboarding state if revisiting
  useEffect(() => {
    if (profile && profile.onboarding) {
      const o = profile.onboarding;
      if (o.goal) setGoal(o.goal);
      if (o.deadline) setDeadline(o.deadline);
      if (typeof o.avatarIdx === "number") setAvatarIdx(o.avatarIdx);
      if (o.roadmap) setRoadmap(o.roadmap);
    }
  }, [profile]);

  // Animate between steps (adds nice RPG fade for stepper)
  const goStep = async (nextIdx) => {
    setTransitioning(true);
    await rpgDelay(340);
    setStep(nextIdx);
    setTransitioning(false);
  };

  // Sync onboarding to Firestore/profile for every key change
  useEffect(() => {
    if (!user) return;
    const sync = async () => {
      const onboarding = {
        goal,
        deadline,
        avatarIdx,
        roadmap,
        complete: roadmap && avatarIdx !== null && goal && deadline,
      };
      await updateProfile({ onboarding });
      // Also put in /users/{uid}/onboarding if desired:
      if (db && user) {
        await setDoc(
          doc(db, "users", user.uid),
          { onboarding },
          { merge: true }
        );
      }
    };
    // Debounce sync for input changes
    const t = setTimeout(sync, 650);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [goal, deadline, avatarIdx, roadmap, user, db]);

  // Build prompt and trigger OpenAI when user has set goal and deadline
  useEffect(() => {
    if (goal && deadline) {
      setLoadingRoadmap(true);
      setRoadmapErr("");
      generateRoadmap(goal, deadline)
        .then((data) => {
          setRoadmap(data);
          setLoadingRoadmap(false);
        })
        .catch((err) => {
          setRoadmapErr(err.message || "Failed to summon your quest. Try again.");
          setRoadmap(null);
          setLoadingRoadmap(false);
        });
    }
    // eslint-disable-next-line
  }, [goal, deadline]);

  // Call to OpenAI (browser-safe; assumes user/runtime key with .env fallback, via ApiKeyContext)
  async function generateRoadmap(goal, deadline) {
    // Use browser fetch, call OpenAI API directly
    // (Client-side exposure: best to use test key or a proxy if needed!)
    const prompt = `
You are NeuroQuest, a legendary RPG questmaster. Given this major goal and deadline, turn it into a magical RPG quest roadmap with 5-7 fun, fantasy-themed major steps. Make each step sound like an RPG quest. Focus on motivation, danger, and epicness.

Major Goal: "${goal}"
Deadline: "${deadline}"

Respond in this format only:
Step 1: ...
Step 2: ...
Step 3: ...
Step 4: ...
Step 5: ...
(Optionally 6-7 steps)
Final Quest: ... (the last challenge before victory!)
`;

    // Securely get the key using the required pattern: from runtime context (user-supplied if present), with fallback to .env, via getKey().
    const apiKey = getKey();

    // fallback for dev (if missing all keys, this block only used in dev; don't remove)
    if (!apiKey) {
      // Demo fallback for local or no-key dev: Return fake roadmap
      await rpgDelay(1400);
      return [
        "Step 1: Enter the Forest of Uncertainty – clarify your ultimate purpose.",
        "Step 2: Gather Ancient Knowledge – research tools, techniques, and allies to assist you.",
        "Step 3: Face the Minions of Distraction – set up barriers and battle interruptions.",
        "Step 4: Unlock the Gate of Time – sketch your timeline to the final showdown.",
        "Step 5: Forge the Master Plan – break goal into powerful sub-quests.",
        "Final Quest: Confront the Shadow of Doubt before your deadline!",
      ];
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 512,
        temperature: 0.85,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
    const payload = await res.json();
    const text =
      payload.choices?.[0]?.message?.content ||
      "Step 1: The questmaster grows tired and refuses to answer.";
    // Parse into array of quest steps
    return text
      // Split by newlines for safety; fix any unterminated regex by being explicit:
      .split(/\n+/g)
      .map((s) =>
        s
          .replace(/^(\d+)\.\s*/, "")
          .replace(/^Step\s*\d+:?\s*/, "")
          .replace(/^Final Quest:?\s*/, "")
          .trim()
      )
      .filter(Boolean);
  }

  // Final step - once avatar picked and roadmap ready, allow to finish onboarding
  const handleFinish = async () => {
    setSaving(true);
    try {
      await updateProfile({
        onboarding: {
          goal,
          deadline,
          avatarIdx,
          roadmap,
          complete: true,
        },
      });
      setTimeout(() => {
        setToast({
          show: true,
          msg: "Heroic onboarding complete! Let the adventure begin!",
          type: "success",
        });
        setTimeout(() => navigate("/dashboard"), 900);
      }, 350);
    } catch (e) {
      setToast({ show: true, msg: "Failed to finish onboarding.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // RPG stepper – returns stepper button bar, classic RPG fantasy style
  function Stepper({ current }) {
    const steps = [
      { icon: "🦄", label: "Intro" },
      { icon: "🎯", label: "Main Quest" },
      { icon: "🧙", label: "Avatar" },
    ];
    return (
      <div className="flex gap-4 items-center justify-center mb-7 select-none">
        {steps.map((s, idx) => (
          <div
            key={s.label}
            className={[
              "flex flex-col items-center px-2 py-1 min-w-[54px]",
              idx === current
                ? "text-accent font-extrabold scale-110 neon-accent"
                : idx < current
                ? "text-brand-orange"
                : "text-textFaded opacity-70",
            ].join(" ")}
          >
            <div className="text-3xl">{s.icon}</div>
            <div className="text-base mt-0.5 tracking-tight font-poppins">{s.label}</div>
            <div
              className={[
                "h-1 rpg-rounded w-[30px] mt-1",
                idx === current
                  ? "bg-accent shadow-neon-accent"
                  : "bg-gray-700 opacity-40",
              ].join(" ")}
            ></div>
          </div>
        ))}
      </div>
    );
  }

  Stepper.propTypes = {
    current: PropTypes.number.isRequired,
  };

  // Step 1: Animated RPG Intro
  function StepIntro() {
    return (
      <div className="flex flex-col items-center gap-6 animate-fadeIn">
        <FloatingOrb size={125} color="#7c3aed">
          <LottieAnim src={WIZARD_LOTTIE} size={118} autoplay loop />
        </FloatingOrb>
        <h1 className="text-3xl font-poppins text-accent neon-accent font-extrabold drop-shadow-lg text-center mb-1">
          Welcome, <br />Seeker of Destiny
        </h1>
        <div className="max-w-md text-center text-textFaded text-lg leading-normal mb-5">
          Begin your <span className="text-brand-orange font-semibold">epic quest</span> to greatness.<br />
          In NeuroQuest, your dreams become RPG adventures.{" "}
          <span className="text-accent">
            Magic, danger, and legendary XP await.
          </span>
        </div>
        <NeonButton
          onClick={() => goStep(STEP.GOAL)}
          className="text-lg px-8 py-3 font-bold uppercase"
        >
          Begin my Quest
        </NeonButton>
      </div>
    );
  }

  Stepper.propTypes = {
    current: PropTypes.number.isRequired,
  };

  // Step 2: Goal & Deadline UI
  function StepGoal() {
    return (
      <div className="flex flex-col items-center gap-6 animate-fadeIn">
        <h2 className="text-2xl font-bold neon-accent font-poppins -mb-2">Set Your Main Quest!</h2>
        <div className="w-full max-w-md flex flex-col gap-5">
          <div>
            <label className="block text-accent text-lg mb-1 font-bold" htmlFor="goal">
              What legendary goal do you wish to achieve?
            </label>
            <input
              type="text"
              id="goal"
              required
              value={goal}
              onChange={e => setGoal(e.target.value.slice(0, 128))}
              className="w-full px-5 py-3 rpg-rounded border-2 border-accent/50 bg-black/60 text-white focus:border-accent focus:outline-none font-medium text-lg placeholder:text-textFaded transition"
              placeholder="e.g. Become a published author, run a marathon, launch an app..."
              autoFocus
              maxLength={128}
            />
          </div>
          <div>
            <label className="block text-accent text-lg mb-1 font-bold" htmlFor="deadline">
              By what enchanted date must you triumph?
            </label>
            <input
              type="date"
              id="deadline"
              required
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 rpg-rounded border-2 border-accent/50 bg-black/60 text-white focus:border-accent focus:outline-none font-medium text-lg shadow placeholder:text-textFaded"
            />
          </div>
        </div>
        <div className="flex justify-between w-full max-w-md mt-5">
          <NeonButton
            variant="orange"
            onClick={() => goStep(STEP.INTRO)}
            className="py-2 px-6"
          >
            ← Back
          </NeonButton>
          <NeonButton
            variant="accent"
            onClick={() => goStep(STEP.AVATAR)}
            disabled={!goal.trim() || !deadline}
            className="py-2 px-7"
          >
            Next →
          </NeonButton>
        </div>
      </div>
    );
  }

  Stepper.propTypes = {
    current: PropTypes.number.isRequired,
  };

  // Step 3: AvatarPicker + Roadmap Preview + Complete
  function StepAvatar() {
    return (
      <div className="flex flex-col items-center gap-4 animate-fadeIn">
        <div className="text-accent font-extrabold font-poppins text-2xl mb-2 neon-accent">
          Choose Your RPG Avatar
        </div>
        <div className="flex gap-5 mt-2 mb-2">
          {AVATAR_DEMOS.map((a, idx) => (
            <button
              key={a.src}
              onClick={() => setAvatarIdx(idx)}
              className={[
                "flex flex-col items-center select-none transition-all duration-100 rpg-rounded",
                idx === avatarIdx
                  ? "scale-110 shadow-neon-accent ring-4 ring-accent/80"
                  : "opacity-70 hover:scale-105 hover:shadow-neon-accent",
              ].join(" ")}
              style={{ outline: "none" }}
              tabIndex={0}
              aria-pressed={avatarIdx === idx}
            >
              <Avatar size={68} demoIndex={idx} alt={a.name} />
              <div className="text-xs mt-1 text-white">{a.name}</div>
            </button>
          ))}
        </div>
        <div className="mb-4" />
        <div className="w-full max-w-lg bg-black/70 neon-accent rpg-rounded p-5 border-2 border-accent/60 mb-2">
          <div className="text-xl text-brand-orange font-bold mb-2">
            Your Epic Quest Roadmap
          </div>
          {loadingRoadmap && (
            <div className="flex items-center gap-2 text-accent animate-pulse">
              <span className="text-lg">Summoning your quest...</span>
              <FloatingOrb size={35} color="#7c3aed">
                <span className="text-2xl">✨</span>
              </FloatingOrb>
            </div>
          )}
          {roadmapErr && (
            <div className="text-red-400 bg-black/40 rpg-rounded p-2 mb-2">
              <b>OpenAI error:</b> {roadmapErr}
              <NeonButton
                onClick={() => generateRoadmap(goal, deadline)
                  .then((data) => setRoadmap(data))
                  .catch((err) => setRoadmapErr("Still failed."))}
                className="mt-2"
                variant="orange"
              >
                Retry Summon
              </NeonButton>
            </div>
          )}
          {!loadingRoadmap && roadmap && (
            <ol className="rpg-rounded text-white/90 text-lg font-poppins px-2 list-decimal space-y-2 transition-all animate-fadeIn">
              {roadmap.map((step, idx) => (
                <li key={idx} className={
                    idx === roadmap.length - 1
                      ? "text-accent font-bold"
                      : "text-brand-orange"
                  }>
                  {step}
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="flex justify-between w-full max-w-md mt-4">
          <NeonButton
            variant="orange"
            onClick={() => goStep(STEP.GOAL)}
            className="py-2 px-6"
          >
            ← Back
          </NeonButton>
          <NeonButton
            variant="accent"
            onClick={handleFinish}
            className="py-2 px-7"
            disabled={
              !goal.trim() ||
              !deadline ||
              avatarIdx === null ||
              !roadmap ||
              saving
            }
          >
            {saving ? "Completing..." : "Finish onboarding →"}
          </NeonButton>
        </div>
      </div>
    );
  }

  Stepper.propTypes = {
    current: PropTypes.number.isRequired,
  };

  return (
    <div className="min-h-[83vh] flex flex-col items-center justify-center bg-gradient-to-b from-[#251947] via-[#120743] to-background pt-2 pb-4 py-7">
      <div
        className="relative z-10 w-full max-w-xl p-8 glass-morph neon-accent border-2 border-accent/80 shadow-2xl rpg-rounded flex flex-col gap-5 items-center animate-fadeIn"
        style={{
          background: "rgba(29,19,54,0.93)",
          borderRadius: "26px",
          border: "2.2px solid #9f88ea77",
          backdropFilter: "blur(9px)",
        }}
      >
        <Stepper current={step} />
        <div className={`w-full py-5 transition ${transitioning ? "opacity-0" : "opacity-100"}`}>
          {step === STEP.INTRO && <StepIntro />}
          {step === STEP.GOAL && <StepGoal />}
          {step === STEP.AVATAR && <StepAvatar />}
        </div>
      </div>
      <Toast
        show={toast.show}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
        message={toast.msg}
        type={toast.type}
      />
      <style>
        {`
      .glass-morph {
        background: rgba(29,19,54,0.94);
        backdrop-filter: blur(10.5px);
      }
      .animate-fadeIn {
        animation: fadeInRPG .7s cubic-bezier(.65,0,.35,1) both;
      }
      @keyframes fadeInRPG {
        0%{opacity:0;transform:translateY(35px) scale(.98);}
        100%{opacity:1;transform:translateY(0) scale(1);}
      }
      `}
      </style>
    </div>
  );
}
