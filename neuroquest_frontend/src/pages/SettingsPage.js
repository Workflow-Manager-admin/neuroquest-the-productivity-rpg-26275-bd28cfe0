import React from "react";

// PUBLIC_INTERFACE
function SettingsPage() {
  /**
   * Shell for Settings/Preferences.
   * Allows toggling dark/light mode, animations, new quest, logout, etc.
   */
  return (
    <div className="settings-page container flex flex-col gap-8 py-8">
      <h2 className="settings-page__title text-3xl font-bold">Settings & Preferences</h2>
      {/* TODO: Dark mode toggle, preference sliders, logout button, etc. */}
      <span className="settings-page__placeholder">[Preferences, theme toggles, and account actions]</span>
    </div>
  );
}

export default SettingsPage;
