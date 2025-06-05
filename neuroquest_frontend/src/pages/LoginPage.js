import React from "react";

// PUBLIC_INTERFACE
function LoginPage() {
  /** 
   * Shell for the Login page.
   * Handles authentication and sign-in UI.
   * Add login UI and logic here.
   */
  return (
    <div className="login-page container flex flex-col items-center gap-8 py-20">
      <h2 className="login-page__title text-3xl font-bold text-violetneon">Login</h2>
      {/* TODO: Add Login Form, Google SSO, etc. */}
      <span className="login-page__placeholder">[Login form will appear here]</span>
    </div>
  );
}

export default LoginPage;
