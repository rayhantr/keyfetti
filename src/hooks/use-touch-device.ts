import { useSyncExternalStore } from "react";

const QUERY = "(pointer: coarse)";

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
 * True when the primary pointer is coarse (touchscreen). Used to show the
 * on-screen keyboard on tablets/phones with no physical keyboard. Backed by
 * useSyncExternalStore so it reads correctly on the client (and updates if the
 * pointer type changes) with no SSR/hydration mismatch.
 */
export function useTouchDevice(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
