import React from "react";

// PUBLIC_INTERFACE
function QuestLogPage() {
  /**
   * Shell for Quest Log.
   * Shows main quests, side quests, and microtasks. Can complete/add/rewrite quests.
   */
  return (
    <div className="questlog-page container flex flex-col gap-8 py-8">
      <h2 className="questlog-page__title text-3xl font-bold mb-4">Quest Log</h2>
      {/* TODO: Add lists for main/side quests, QuestCard grid, filters, etc. */}
      <span className="questlog-page__placeholder">[Active quests/tasks will appear here]</span>
    </div>
  );
}

export default QuestLogPage;
