import React from "react";

// PUBLIC_INTERFACE
function CalendarSyncPage() {
  /**
   * Shell for Google Calendar Sync integration.
   * Allows user to connect calendar, display/battle events, etc.
   */
  return (
    <div className="calendar-page container flex flex-col items-center gap-8 py-16">
      <h2 className="calendar-page__title text-3xl font-bold">Calendar Sync</h2>
      {/* TODO: Google Calendar connect, event list, boss mapping, etc. */}
      <span className="calendar-page__placeholder">[Connect and sync your Google Calendar]</span>
    </div>
  );
}

export default CalendarSyncPage;
