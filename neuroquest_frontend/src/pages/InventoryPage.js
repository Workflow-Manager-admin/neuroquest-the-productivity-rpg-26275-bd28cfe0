import React from "react";

// PUBLIC_INTERFACE
function InventoryPage() {
  /**
   * Shell for Inventory & Cosmetics view.
   * Shows user items, tokens, equipped cosmetics, inventory grid.
   */
  return (
    <div className="inventory-page container flex flex-col gap-8 py-8">
      <h2 className="inventory-page__title text-3xl font-bold">Inventory</h2>
      {/* TODO: Add inventory grid, cosmetic unlocks, equip system */}
      <span className="inventory-page__placeholder">[Your earned cosmetics, tokens, and items]</span>
    </div>
  );
}

export default InventoryPage;
