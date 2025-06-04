import { useRef } from "react";

// PUBLIC_INTERFACE
/**
 * useAnim: Quickly trigger CSS animation classes or style updates for immersive UI effects.
 * Usage: const [trigger, ref] = useAnim("my-css-class", durationMs)
 */
export function useAnim(animClass, duration = 900) {
  const ref = useRef();

  function trigger() {
    if (ref.current) {
      ref.current.classList.add(animClass);
      setTimeout(() => {
        ref.current.classList.remove(animClass);
      }, duration);
    }
  }

  return [trigger, ref];
}

