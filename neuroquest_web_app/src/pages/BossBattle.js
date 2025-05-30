import React, { useState } from "react";
import LottieAnim from "../components/LottieAnim";
import LoaderAnim from "../assets/lottie/loader.json";

// Use an open-source Lottie monster/dragon for demo
const bossAnimUrl = "https://lottie.host/72742b20-99dc-472f-bfe9-7b3b7e70d7ff/I1A6w9q6qf.json"; // Example URL, ensure CORS
const timerDuration = 15 * 60; // 15 mins

// PUBLIC_INTERFACE
/**
 * Boss Battle page: timed productivity challenge.
 */
export default function BossBattle() {
  const [timer, setTimer] = useState(timerDuration);
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [victory, setVictory] = useState(null);

  React.useEffect(() => {
    let t;
    if (active && timer > 0 && !finished) {
      t = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (active && !finished && timer === 0) {
      setFinished(true);
      setVictory(false);
    }
    return () => clearTimeout(t);
  }, [timer, active, finished]);

  const startBattle = () => {
    setActive(true); setTimer(timerDuration); setFinished(false);
    setVictory(null);
  };
  const defeatBoss = () => {
    setVictory(true); setFinished(true);
  };

  const mins = Math.floor(timer / 60);
  const secs = timer % 60;

  return (
    <div className="max-w-xl mx-auto glass-bg px-6 py-10 mt-6 shadow-xl rounded-3xl flex flex-col gap-4 items-center justify-center">
      <div className="w-full flex flex-col items-center mb-5">
        <h1 className="text-2xl font-bold neon-glow mb-3">Boss Battle</h1>
        <div className="w-[180px] h-[180px] flex items-center justify-center mb-2">
          <LottieAnim anim={LoaderAnim} height={120} />
        </div>
      </div>
      <div className="w-full text-lg neon-glow text-center mb-2">
        Defeat the Boss -- finish your deadline task before time runs out!
      </div>
      <div className="relative w-full flex flex-col items-center mb-4">
        <div className="bg-kaviaDark/90 rounded-full p-4 shadow-neon border-2 border-kaviaAccent flex flex-col items-center">
          <span className="text-xl block mb-2">👹</span>
          <span className={`text-2xl font-extrabold ${timer < 60 ? "text-red-500" : ""}`}>{mins}:{secs.toString().padStart(2, "0")}</span>
        </div>
        <div className="w-full h-3 rounded-xl bg-kaviaDark/70 mt-4">
          <div
            className="h-3 rounded-xl bg-gradient-to-r from-kaviaAccent to-red-400"
            style={{ width: `${Math.max(0, (timer / timerDuration) * 100)}%`, transition: "width 1s" }}
          />
        </div>
      </div>
      {!active && (
        <button className="neon-btn w-full py-3 mt-2" onClick={startBattle}>
          {victory === false ? "Try Boss Again" : "Start Battle"}
        </button>
      )}
      {active && !finished && (
        <button className="neon-btn bg-kaviaDanger w-full py-3 mt-2" onClick={defeatBoss}>Mark Task Complete (Defeat Boss)</button>
      )}
      {finished && victory && (
        <div className="text-green-400 neon-glow text-center font-bold mt-3">
          Victory! Boss Defeated <span role="img" aria-label="trophy">🏆</span>
        </div>
      )}
      {finished && victory === false && (
        <div className="text-red-400 neon-glow text-center font-bold mt-3">
          The Boss defeated you this time...<br />Try again!
        </div>
      )}
    </div>
  );
}
