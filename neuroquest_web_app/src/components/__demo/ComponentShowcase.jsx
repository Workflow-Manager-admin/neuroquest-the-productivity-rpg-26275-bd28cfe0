import React, { useState } from "react";
import XPBar from "../XPBar";
import HPBar from "../HPBar";
import Avatar from "../Avatar";
import StatsPanel from "../StatsPanel";
import FocusMeter from "../FocusMeter";
import FloatingOrb from "../FloatingOrb";
import NeonButton from "../NeonButton";
import Modal from "../Modal";
import QuestCard from "../QuestCard";
import Tabs from "../Tabs";
import Toast from "../Toast";
import ZoneCard from "../ZoneCard";
// If you add Lottie assets, use import demoAnim from "../../assets/demo-lottie.json";
import LottieAnim from "../LottieAnim";

// Demo assets
const zoneImg = "/src/assets/zone_forest.png";
const questIcon = "/src/assets/quest_scroll.png";
/**
 * ComponentShowcase – Demo usage for all RPG components.
 */
export default function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(false);

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6 p-2">
      <div>
        <h2 className="text-lg font-bold text-accent mb-1">XP/HP Bars</h2>
        <XPBar xp={540} maxXp={800} />
        <HPBar hp={64} maxHp={100} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-accent mb-1">Avatar</h2>
        <Avatar size={72} demoIndex={0} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-accent mb-1">Stats Panel</h2>
        <StatsPanel stats={{ level: 7, streak: 22, xp: 2480, coins: 90 }} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-accent mb-1">Focus Meter</h2>
        <FocusMeter focus={57} maxFocus={100} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-accent mb-1">Floating Orb</h2>
        <FloatingOrb>
          <span role="img" aria-label="floating">🪄</span>
        </FloatingOrb>
      </div>
      <div>
        <h2 className="text-lg font-bold text-accent mb-1">Neon Button</h2>
        <NeonButton onClick={() => setToast(true)}>Click for Toast</NeonButton>
      </div>
      <div>
        <h2 className="text-lg font-bold text-accent mb-1">Zone Card</h2>
        <ZoneCard name="Focus Forest" description="Gain XP by deep work" image={zoneImg} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-accent mb-1">Quest Card</h2>
        <QuestCard
          title="Defeat the Deadline"
          description="Complete the report before midnight."
          xp={150}
          icon={questIcon}
          completed={false}
        />
      </div>
      <div>
        <h2 className="text-lg font-bold text-accent mb-1">Tabs</h2>
        <Tabs tabs={["Main Quest", "Side", "Done"]}>
          <div>Main questlist example.</div>
          <div>Side questlist example.</div>
          <div>Completed quests example.</div>
        </Tabs>
      </div>
      <div>
        <h2 className="text-lg font-bold text-accent mb-1">Modal</h2>
        <NeonButton onClick={() => setModalOpen(true)}>Open Modal</NeonButton>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Magic Chest">
          <div className="text-lg">You found a <b>Legendary Potion</b>! ✨</div>
        </Modal>
      </div>
      <div>
        <h2 className="text-lg font-bold text-accent mb-1">Toast</h2>
        <NeonButton onClick={() => setToast(true)}>Show Toast</NeonButton>
        <Toast
          message="Level up! +100 XP"
          show={toast}
          onClose={() => setToast(false)}
          type="accent"
        />
      </div>
      <div>
        <h2 className="text-lg font-bold text-accent mb-1">Lottie Anim (demo)</h2>
        <div className="w-20 h-20">
          {/* Provide a real Lottie asset in /src/assets/demo-lottie.json and import for actual demo */}
          {/* <LottieAnim src={demoAnim} size={80} />*/}
          <div className="text-xs text-textFaded">Add a demo Lottie JSON in assets for preview.</div>
        </div>
      </div>
    </div>
  );
}
