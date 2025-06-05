import React from "react";

// PUBLIC_INTERFACE
function OnboardingPage() {
  /**
   * Shell for the Onboarding page.
   * Handles goal setting and first-time experience.
   */
  return (
    <div className="onboarding-page container flex flex-col items-center gap-8 py-20">
      <h2 className="onboarding-page__title text-3xl font-bold">Onboarding</h2>
      {/* TODO: Add onboarding steps, goal input, etc. */}
      <span className="onboarding-page__placeholder">[Begin your adventure! Goal setup, character intro, etc.]</span>
    </div>
  );
}

export default OnboardingPage;
