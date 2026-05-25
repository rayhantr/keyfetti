import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * True when the OS "reduce motion" setting is on. Used to skip spawning confetti
 * bursts entirely (the floating letters already degrade to a fade-only animation
 * via a CSS media query). Backed by useSyncExternalStore so it reads correctly on
 * the client — and updates if the setting changes — with no SSR/hydration mismatch.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
