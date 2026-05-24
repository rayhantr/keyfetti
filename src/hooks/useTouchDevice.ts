import { useEffect, useState } from "react";

/**
 * True when the primary pointer is coarse (touchscreen). Used to show the
 * on-screen keyboard on tablets/phones that have no physical keyboard. Starts
 * `false` so the server and first client render agree, then updates on mount.
 */
export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsTouch(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isTouch;
}
