import React from "react";
import PropTypes from "prop-types";
import LottieAnim from "./LottieAnim";
import NeonButton from "./NeonButton";

/**
 * ErrorBoundary – RPG neon-glow error boundary for React components/pages.
 * Catches errors in subtrees, displays immersive RPG error feedback with retry option.
 * Use to wrap all major flows (auth, AI, calendar, inventory, music, quests).
 *
 * Usage:
 *   <ErrorBoundary>
 *     <MyComponent />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  // PUBLIC_INTERFACE
  static getDerivedStateFromError(error) {
    return { error, info: null };
  }

  // PUBLIC_INTERFACE
  componentDidCatch(error, info) {
    this.setState({ error, info });
    // Optionally log error to error reporting service here.
    // e.g., logError(error, info);
  }

  // PUBLIC_INTERFACE
  handleReset = () => {
    // If recoverable, reset error and optionally invoke recovery
    this.setState({ error: null, info: null });
    if (typeof this.props.onReset === "function") {
      this.props.onReset();
    }
  };

  render() {
    const { error } = this.state;
    if (error) {
      // RPG neon styled error screen
      return (
        <div className="flex flex-col items-center justify-center min-h-[64vh] bg-gradient-to-b from-[#3b10798e] to-[#0f172a] px-5 py-10 animate-fadeIn">
          <LottieAnim
            src="/src/assets/magic-fantasy-particles.json"
            size={110}
            autoplay
            loop={false}
          />
          <h1
            className="text-3xl font-extrabold neon-accent text-accent drop-shadow-lg mt-2 mb-1"
            style={{ textShadow: "0 0 18px #b28af9ee" }}
          >
            ⚠️ Spell Failed!
          </h1>
          <div className="text-lg text-brand-orange font-bold mb-2 text-center">
            An error occurred while loading this part of your adventure.
          </div>
          {error?.message &&
            <div className="bg-black/50 text-white rounded-lg p-3 mt-1 mb-4 max-w-md xs:max-w-xs text-center neon-accent">
              {error.message}
            </div>
          }
          <NeonButton onClick={this.handleReset} variant="accent" className="px-7 py-2 mt-2 font-bold">
            🔁 Retry
          </NeonButton>
          <div className="text-xs text-textFaded mt-5 text-center">
            If this persists, please <a href="mailto:support@neuroquest.app" className="underline text-accent">contact support</a>.
          </div>
        </div>
      );
    }
    // All good
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onReset: PropTypes.func,
};
