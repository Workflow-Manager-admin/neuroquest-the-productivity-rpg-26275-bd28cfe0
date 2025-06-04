import React, { useState } from "react";
import PropTypes from "prop-types";
import { useGame } from "../context/GameContext";
import { useUser } from "../context/UserContext";
import NeonButton from "../components/NeonButton";
import FloatingOrb from "../components/FloatingOrb";
import LottieAnim from "../components/LottieAnim";
import Modal from "../components/Modal";
import Avatar from "../components/Avatar";
import Tabs from "../components/Tabs";

// Demo assets (swap for real images/lotties in /src/assets/)
const DEMO_ASSETS = [
  // Each item: { name, slot, image, rarity, unlocked, equipped, description }
  {
    name: "Arcane Hat",
    slot: "hat",
    image: "/src/assets/hat_arcane.png",
    rarity: "rare",
    unlocked: true,
    equipped: false,
    description: "A wizard's sigil hat infused with arcane runes.",
  },
  {
    name: "Starlight Cloak",
    slot: "cloak",
    image: "/src/assets/cloak_starlight.png",
    rarity: "legendary",
    unlocked: true,
    equipped: false,
    description: "A shimmering cloak dropped from a meteor shower.",
  },
  {
    name: "Soul Token",
    slot: "token",
    image: "/src/assets/token_soul.png",
    rarity: "special",
    unlocked: true,
    equipped: false,
    description:
      "A Soul Token: Earned from epic boss victories. Spend for legendary unlocks.",
  },
  {
    name: "Adventurer Boots",
    slot: "boots",
    image: "/src/assets/boots_adventurer.png",
    rarity: "common",
    unlocked: true,
    equipped: false,
    description: "Sturdy boots for the wandering explorer.",
  },
  {
    name: "Mystic Staff",
    slot: "staff",
    image: "/src/assets/staff_mystic.png",
    rarity: "epic",
    unlocked: false,
    equipped: false,
    unlockReq: "Defeat the Deadline Dragon boss to claim!",
    description: "Mystic staff charged with legendary focus.",
  },
];

// Rarity styling map
const RARITIES = {
  common: { color: "#94a3b8", label: "Common" },
  rare: { color: "#60a5fa", label: "Rare" },
  epic: { color: "#c084fc", label: "Epic" },
  legendary: { color: "#facc15", label: "Legendary" },
  special: { color: "#e87a41", label: "Special" },
};

// Simple Lottie assets for fancy unlock
const LOTTIE_RARE_UNLOCK = "/src/assets/unlock-rare.json";
const LOTTIE_LEGENDARY = "/src/assets/unlock-legendary.json";
const LOTTIE_SOUL = "/src/assets/soul-orb.json";

/**
 * Return the merged inventory (cosmetics/tokens/etc), sorted by rarity > slot.
 * Merge from game.inventory, fallback to demo assets.
 */
function getMergedInventory(gameInv) {
  // Demo: ensure all demo assets appear unless firestored
  let merged = DEMO_ASSETS.map((d) => {
    const found = (gameInv || []).find((i) => i.slot === d.slot);
    return found ? { ...d, ...found } : { ...d };
  });
  // Add Firestore custom items that are not present in defaults
  if (Array.isArray(gameInv)) {
    gameInv.forEach((i) => {
      if (!merged.find((d) => d.slot === i.slot)) merged.push(i);
    });
  }
  return merged.sort(
    (a, b) =>
      rarityOrder(a.rarity) - rarityOrder(b.rarity) ||
      a.slot.localeCompare(b.slot)
  );
}

function rarityOrder(r) {
  switch (r) {
    case "legendary":
      return 0;
    case "epic":
      return 1;
    case "rare":
      return 2;
    case "special":
      return 3;
    case "common":
    default:
      return 4;
  }
}

// PUBLIC_INTERFACE
/**
 * Inventory.jsx – RPG grid for cosmetics, Soul tokens, item equip, rarity filter,
 * interactive tooltips, Lottie FX for rare/unlock, and Firestore sync.
 */
export default function Inventory() {
  const { game, updateGame } = useGame();
  // const { user } = useUser(); // Unused variable
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeRarity, setActiveRarity] = useState("all");
  const [tab, setTab] = useState(0);
  const [unlockAnim, setUnlockAnim] = useState(null); // {lottie, onDone}
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "accent" });

  // Final inventory array: merge context.game.inventory and DEMO_ASSETS
  const mergedInventory = getMergedInventory(game?.inventory);

  // Tabs: Cosmetics, Tokens, All
  const TABS = ["Cosmetics", "Tokens", "All"];

  // Equip/unequip logic
  const handleEquip = (item) => {
    if (!item.unlocked) {
      setUnlockAnim({
        lottie: [item.rarity === "legendary" ? LOTTIE_LEGENDARY : LOTTIE_RARE_UNLOCK, LOTTIE_SOUL][
          item.rarity === "special" ? 1 : 0
        ],
        onDone: () => null,
        item,
      });
      setToast({
        show: true,
        msg: "You must unlock this item by completing its quest!",
        type: "accent",
      });
      return;
    }
    setSaving(true);
    // Only one per slot equipped (except tokens)
    let newInv = mergedInventory.map((x) =>
      x.slot === item.slot && x.slot !== "token"
        ? { ...x, equipped: x.name === item.name }
        : x
    );
    if (item.slot === "token") {
      // Toggle equip for tokens
      newInv = newInv.map((x) =>
        x.slot === "token" && x.name === item.name
          ? { ...x, equipped: !x.equipped }
          : x
      );
    }
    // Save to Firestore via GameContext
    updateGame({ inventory: newInv })
      .then(() => {
        setSaving(false);
        setToast({
          show: true,
          msg: item.equipped
            ? `Removed ${item.name}`
            : `Equipped ${item.name}!`,
          type: "success",
        });
      })
      .catch(() => {
        setSaving(false);
        setToast({
          show: true,
          msg: "Unable to save changes.",
          type: "error",
        });
      });
  };

  // Filter by rarity and tab
  function filterItems() {
    let items = mergedInventory;
    if (TABS[tab] === "Cosmetics") {
      items = items.filter((i) => i.slot !== "token");
    } else if (TABS[tab] === "Tokens") {
      items = items.filter((i) => i.slot === "token");
    }
    if (activeRarity !== "all") {
      items = items.filter((i) => i.rarity === activeRarity);
    }
    return items;
  }

  // Tooltip/modal for cosmetic info
  function ItemModal({ open, item, onClose }) {
    if (!open || !item) return null;
    return (
      <Modal open={open} onClose={onClose} title={item.name}>
        <div className="flex flex-col items-center gap-3 mb-2">
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 rpg-rounded border-4"
            style={{
              borderColor: RARITIES[item.rarity]?.color || "#7c3aed",
              boxShadow: `0 0 18px 2px ${
                RARITIES[item.rarity]?.color || "#7c3aed"
              },0 2px 8px #1a181a80`,
              background: "#160e33",
            }}
          />
          <div className="text-white text-base font-semibold">{item.description}</div>
          {item.unlockReq && !item.unlocked && (
            <div className="text-accent bg-black/40 rpg-rounded px-2 py-1 mt-1 font-bold text-center">
              {item.unlockReq}
            </div>
          )}
          <div
            className="text-base my-1 px-2 font-bold"
            style={{ color: RARITIES[item.rarity]?.color || "#7c3aed" }}
          >
            {RARITIES[item.rarity]?.label || item.rarity}
          </div>
          <NeonButton
            onClick={() => handleEquip(item)}
            disabled={saving || !item.unlocked}
            variant={item.equipped ? "orange" : "accent"}
            className="w-full font-bold text-lg py-2 mt-2"
          >
            {item.slot === "token"
              ? item.equipped
                ? "Stash Token"
                : "Spend Soul Token"
              : item.equipped
              ? "Unequip"
              : "Equip"}
          </NeonButton>
        </div>
      </Modal>
    );
  }

  UnlockModal.propTypes = {
    open: PropTypes.bool.isRequired,
    lottie: PropTypes.string,
    item: PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.string,
      rarity: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
  };

  ItemModal.propTypes = {
    open: PropTypes.bool.isRequired,
    item: PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.string,
      rarity: PropTypes.string,
      description: PropTypes.string,
      unlockReq: PropTypes.string,
      unlocked: PropTypes.bool,
      equipped: PropTypes.bool,
      slot: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
  };

  // Unlock/FX animation modal (Lottie)
  function UnlockModal({ open, lottie, item, onClose }) {
    if (!open || !lottie) return null;
    return (
      <Modal open={open} onClose={onClose} title="Unlock!">
        <div className="flex flex-col items-center gap-3">
          <LottieAnim src={lottie} size={106} autoplay loop={false} />
          <div className="font-bold text-accent text-lg">New unlock!</div>
          {item && (
            <>
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rpg-rounded border-4"
                style={{
                  borderColor: RARITIES[item.rarity]?.color || "#7c3aed",
                  boxShadow: `0 0 18px 2px ${
                    RARITIES[item.rarity]?.color || "#7c3aed"
                  },0 3px 10px #170d3880`,
                  background: "#1a1628",
                }}
              />
              <div className="text-white text-lg font-semibold">{item.name}</div>
              <div
                className="px-2 py-1 rpg-rounded shadow text-accent font-bold my-2"
                style={{
                  background: "#120741",
                  color: RARITIES[item.rarity]?.color || "#7c3aed",
                }}
              >
                {RARITIES[item.rarity]?.label || item.rarity}
              </div>
            </>
          )}
        </div>
      </Modal>
    );
  }

  UnlockModal.propTypes = {
    open: PropTypes.bool.isRequired,
    lottie: PropTypes.string,
    item: PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.string,
      rarity: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
  };

  ItemModal.propTypes = {
    open: PropTypes.bool.isRequired,
    item: PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.string,
      rarity: PropTypes.string,
      description: PropTypes.string,
      unlockReq: PropTypes.string,
      unlocked: PropTypes.bool,
      equipped: PropTypes.bool,
      slot: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
  };

  // Rarity selector
  function RarityFilters() {
    return (
      <div className="mb-2 flex flex-wrap gap-2 items-center">
        <div className="font-bold text-accent mr-2">Filter:</div>
        <button
          onClick={() => setActiveRarity("all")}
          className={`font-bold px-3 py-1 text-sm rpg-rounded border ${
            activeRarity === "all"
              ? "bg-accent text-white"
              : "bg-black/50 text-textFaded border-accent"
          }`}
        >
          All
        </button>
        {Object.keys(RARITIES).map((key) => (
          <button
            key={key}
            onClick={() => setActiveRarity(key)}
            className={`font-bold px-3 py-1 text-sm rpg-rounded border`}
            style={{
              background:
                activeRarity === key ? RARITIES[key].color : "rgba(44,24,94,0.9)",
              borderColor: RARITIES[key].color,
              color:
                activeRarity === key
                  ? "#1a132d"
                  : RARITIES[key].color,
              opacity: activeRarity === key ? 1 : 0.68,
            }}
          >
            {RARITIES[key].label}
          </button>
        ))}
      </div>
    );
  }

  // Inventory grid (cosmetic/tokens)
  function InventoryGrid({ items }) {
    if (!items || items.length === 0)
      return (
        <div className="text-center text-textFaded italic my-7 font-bold opacity-80">
          Nothing found. Try a different filter!
        </div>
      );
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 w-full mt-3 auto-rows-auto">
        {items.map((item, idx) => (
          <div
            key={item.name + idx}
            className={`relative flex flex-col items-center rpg-rounded bg-black/75 neon-accent py-4 px-2 shadow-lg border-2 border-accent/30 hover:scale-105 transition-all duration-150 cursor-pointer ${
              item.equipped ? "ring-4 ring-accent" : ""
            }`}
            title={item.name}
            style={{
              userSelect: "none",
              minHeight: 160,
              boxShadow: item.equipped
                ? `0 0 20px 2px #facc15cc, 0 0 8px 2px #c084fc`
                : "0 1px 13px 1px #a78bfa32",
              background:
                item.rarity === "legendary"
                  ? "linear-gradient(120deg,#c084fc55 10%,#facc1577 98%)"
                  : item.rarity === "epic"
                  ? "linear-gradient(120deg,#dbc0fa22 5%,#c084fc33 96%)"
                  : "rgba(16,10,32,.94)",
            }}
            onClick={() => {
              setSelected(item);
              setModalOpen(true);
            }}
            tabIndex={0}
            aria-label={"View " + item.name}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rpg-rounded object-cover border-2"
              style={{
                borderColor: RARITIES[item.rarity]?.color || "#7c3aed",
                opacity: item.unlocked ? 1 : 0.53,
                filter: item.unlocked
                  ? ""
                  : "blur(1.5px) grayscale(0.88) brightness(0.85)",
                background: "#271755ee",
              }}
              draggable={false}
            />
            <div className="text-accent font-bold text-base mt-2 text-center">
              {item.name}
            </div>
            <div
              className="absolute top-2 right-2 px-2 py-1 rpg-rounded"
              style={{
                background: "#2a193aee",
                color: RARITIES[item.rarity]?.color || "#7c3aed",
                fontWeight: 700,
                fontSize: ".85em",
                borderColor: RARITIES[item.rarity]?.color,
                borderWidth: 2,
                borderStyle: "solid",
              }}
            >
              {RARITIES[item.rarity]?.label}
            </div>
            {item.equipped && (
              <div
                className="absolute left-2 bottom-1 text-lg animate-pulse"
                style={{ color: "#facc15", fontWeight: 800 }}
                title="Equipped"
              >
                ⭐
              </div>
            )}
            {!item.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <FloatingOrb size={34} color="#7c3aed">
                  <span className="text-xl" role="img" aria-label="locked">
                    🔒
                  </span>
                </FloatingOrb>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  InventoryGrid.propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        image: PropTypes.string,
        rarity: PropTypes.string,
        unlocked: PropTypes.bool,
        equipped: PropTypes.bool,
        slot: PropTypes.string,
      })
    ),
  };

  // Token panel (Soul tokens, etc)
  function TokenPanel() {
    const tokens = mergedInventory.filter((i) => i.slot === "token");
    return (
      <div className="flex flex-row flex-wrap gap-6 items-center mb-6">
        {tokens.map((t, idx) => (
          <FloatingOrb
            key={t.name + idx}
            size={70}
            color={t.equipped ? "#facc15" : "#7c3aed"}
          >
            <img
              src={t.image}
              alt={t.name}
              className="w-12 h-12 rpg-rounded object-cover"
              style={{ filter: "drop-shadow(0 0 11px #e87a41)", background: "#3f222b" }}
              draggable={false}
            />
            <div className="text-xs mt-1 font-bold text-white">{t.name}</div>
          </FloatingOrb>
        ))}
      </div>
    );
  }

  // Current-appearance panel: shows equipped equipment/preview
  function AvatarPreview() {
    const equipped = mergedInventory.filter((i) => i.equipped && i.slot !== "token");
    let avatarIdx = 0;
    // Optionally augment with equipped items overlays, etc.
    return (
      <div className="flex flex-col items-center my-4">
        <div className="relative">
          <Avatar
            size={82}
            demoIndex={avatarIdx}
            ringColor="#a78bfa"
            alt="Adventurer Avatar"
          />
          {/* Overlays can be created via position: absolute with equipped items, for live preview */}
          {equipped.map((item, idx) => (
            <img
              key={item.slot + idx}
              src={item.image}
              alt={item.name}
              className="absolute"
              style={{
                left: 0 + idx * 18,
                top: 0 + idx * 9,
                width: 24,
                height: 24,
                zIndex: 12 + idx,
                filter: `drop-shadow(0 0 6px ${RARITIES[item.rarity]?.color || "#7c3aed"})`,
              }}
            />
          ))}
        </div>
        <div className="text-sm font-bold mt-1 text-accent">Your Adventurer</div>
      </div>
    );
  }

  // Render
  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto pt-1 pb-7 min-h-[72vh]">
      <div className="text-3xl font-bold neon-accent mb-0 mt-2">Inventory</div>
      {/* 
        RPG/Fantasy inventory hero image. Public domain/Unsplash, swap this src to use your own art! 
        https://unsplash.com/photos/close-up-photography-of-wooden-chest-boxes-3TLl_97HNJo
      */}
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80"
        alt="Inventory chest and fantasy loot"
        className="w-full max-w-xs sm:max-w-sm mx-auto mb-2 rounded-xl border-2 border-accent shadow-lg object-cover"
        onError={(e)=>{e.target.style.display='none'}}
        style={{background: "#18132B"}} 
      />
      {/* Fallback: fantasy chest icon for failed image loads */}
      <span className="block text-5xl text-accent my-2" aria-label="Treasure Chest" style={{display:'none'}}>
         🗝️
      </span>
      {/* End hero image art, devs can swap image in <img> above */}
      <div className="text-base font-bold text-brand-orange mt-2 mb-1">
        Cosmetics, Tokens & Unlocks
      </div>
      <AvatarPreview />
      <Tabs tabs={TABS} defaultIndex={0} size="md" onChange={setTab}>
        {/* Cosmetics Tab */}
        <div>
          <RarityFilters />
          <InventoryGrid items={filterItems()} />
        </div>
        {/* Tokens Tab */}
        <div>
          <TokenPanel />
          <InventoryGrid items={filterItems()} />
        </div>
        {/* All Tab */}
        <div>
          <RarityFilters />
          <InventoryGrid items={filterItems()} />
        </div>
      </Tabs>
      <div className="mt-5 w-full flex flex-col items-center gap-2">
        <div className="text-textFaded text-xs opacity-70 w-full max-w-2xl text-center">
          <span>
            Earn new cosmetics by leveling up, defeating bosses, or using Soul tokens!
            Only one item per slot can be equipped at a time.
          </span>
        </div>
      </div>
      {/* Item Tooltip/Info Modal */}
      <ItemModal open={modalOpen} item={selected} onClose={() => setModalOpen(false)} />
      {/* Anim unlock modal */}
      <UnlockModal
        open={!!unlockAnim}
        lottie={unlockAnim?.lottie}
        item={unlockAnim?.item}
        onClose={() => setUnlockAnim(null)}
      />
      {/* Toast/notify */}
      {toast.show && (
        <div className="fixed bottom-[10dvh] left-1/2 -translate-x-1/2 z-[99] px-8 py-3 rpg-rounded shadow-xl border-2 border-accent/30 bg-[#180c2d] font-bold text-brand-orange neon-accent text-lg animate-fadeIn">
          {toast.msg}
          <button
            className="ml-4 text-accent hover:text-white text-2xl font-bold"
            onClick={() => setToast({ ...toast, show: false })}
            aria-label="Close toast"
          >
            ×
          </button>
        </div>
      )}

      {/* RPG Neon/CSS */}
      <style>
        {`
          .rpg-rounded { border-radius: 16px; }
          .neon-accent { box-shadow: 0 0 16px 2px #7c3aed88, 0 0 4px 2px #7c3aed; }
          .animate-fadeIn { animation: fadeInRPG .72s cubic-bezier(.62,0,.39,1) both;}
          @keyframes fadeInRPG {
            0%{opacity:0;transform:translateY(25px) scale(.97);}
            100%{opacity:1;transform:translateY(0) scale(1);}
          }
        `}
      </style>
    </div>
  );
}
