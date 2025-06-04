import React, { useEffect, Suspense } from 'react';
import { useAudio } from '../components/AudioPlayer';

// Neon/RPG Focus Engine (production, not placeholder)
const FocusEngine = React.lazy(() => import('../components/FocusEngine'));

// PUBLIC_INTERFACE
/**
 * Focus.jsx – Fully polished RPG Focus Engine page.
 * - Loads polished FocusEngine overlay (removes placeholder)
 * - Provides mobile-friendly, RPG neon layout.
 * - Includes a Suspense fallback: shows Lottie/fantasy fallback loading while FocusEngine loads.
 * - Traceable for refactor by doc comments.
 */
export default function Focus() {
  const { switchTheme } = useAudio();
  useEffect(() => {
    switchTheme("focus");
    // eslint-disable-next-line
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-[66vh] w-full animate-fadeIn px-2 py-2 relative">
      {/* RPG fantasy/Lottie fallback during FocusEngine loading */}
      <Suspense fallback={
        <div className="w-full h-[350px] flex flex-col items-center justify-center">
          {/* Lottie/visual shimmer for loading */}
          <div className="mb-5">
            <img
              src="/src/assets/focus-glow.png"
              alt="Focus RPG Fantasy"
              className="w-24 h-24 mx-auto animate-pulse rpg-rounded"
              onError={e => { e.target.style.display = 'none'; }}
              style={{ boxShadow: "0 0 34px 5px #7c3aed88, 0 0 6px #a78bfa" }}
            />
          </div>
          <div className="text-center text-2xl text-accent font-bold animate-pulse mb-2">
            Loading Focus Engine...
          </div>
          <div className="text-base text-textFaded opacity-75 font-semibold">Summoning your RPG focus powers...</div>
        </div>
      }>
        {/* Production RPG FocusEngine, responsive and mobile-friendly */}
        <FocusEngine className="my-4" style={{ maxWidth: 430, width: '100%' }} overlay={false} />
      </Suspense>
      {/* Glow/particle accent */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle at 60% 8%, #a78bfa18 10%, transparent 90%), linear-gradient(210deg,#190c3e 78%,#7c3aed11 98%)",
        }}
      />
    </div>
  );
}
