import React from "react";

// PUBLIC_INTERFACE
function InventoryGrid({ items = [] }) {
  /**
   * Displays a grid of the user's earned cosmetics/items.
   * Props: items = [{id, name, iconSrc, owned (bool)}]
   */
  return (
    <div className="inventorygrid grid grid-cols-3 md:grid-cols-6 gap-4 py-4">
      {items.length ? (
        items.map((item) => (
          <div
            className={`inventorygrid__item flex flex-col items-center p-2 rounded-lg border-2
              ${item.owned ? "border-neon-cyan bg-midnight" : "border-gray-700 bg-black/30 opacity-70"}
            `}
            key={item.id}
          >
            <div className="inventorygrid__icon w-12 h-12 flex items-center justify-center">
              {item.iconSrc ? (
                <img src={item.iconSrc} alt={item.name} className="w-10 h-10" loading="lazy" />
              ) : (
                <span className="text-2xl">?</span>
              )}
            </div>
            <div className="inventorygrid__name text-xs text-white/90 mt-2 text-center">{item.name}</div>
            {item.owned && <div className="inventorygrid__owned text-xs text-neon-cyan">Owned</div>}
          </div>
        ))
      ) : (
        <span className="col-span-full block text-white/50 text-center">No items yet.</span>
      )}
    </div>
  );
}

export default InventoryGrid;
