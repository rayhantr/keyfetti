import { useEffect, useRef } from "react";
import { isLetterOrDigit } from "@/lib/keyboard-layout";

export type InputMode = "both" | "letters" | "numbers";

type Params = {
  onChar: (char: string) => void;
  mode?: InputMode;
  enabled?: boolean;
};

function passesMode(char: string, mode: InputMode): boolean {
  if (mode === "letters") return /^[a-z]$/i.test(char);
  if (mode === "numbers") return /^[0-9]$/.test(char);
  return true;
}

/**
 * Global keyboard listener for the app. Only plain letters and digits are
 * accepted; every other key is swallowed (preventDefault) to keep the page
 * kid-proof against scrolling, find, tab-navigation, etc. Auto-repeat from a
 * held key is ignored so one physical press produces exactly one letter.
 *
 * Note: OS/browser-reserved shortcuts (Ctrl/Cmd+W, Cmd+Q, F11, Alt+Tab) cannot
 * be blocked by a web page — fullscreen mode mitigates accidental exits.
 */
export function useKeyboardInput({ onChar, mode = "both", enabled = true }: Params) {
  const onCharRef = useRef(onChar);
  const modeRef = useRef(mode);

  // Keep the latest callback/mode in refs — updated after render (not during),
  // so the window listener below can stay attached without re-binding.
  useEffect(() => {
    onCharRef.current = onChar;
    modeRef.current = mode;
  });

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Let the app's own controls (buttons) keep native keyboard behaviour.
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, input, [role='button']")) return;

      // Resolve the character: top-row keys via `key`, numpad digits via `code`.
      let char: string | null = null;
      if (e.key.length === 1 && isLetterOrDigit(e.key)) {
        char = e.key;
      } else if (/^Numpad[0-9]$/.test(e.code)) {
        char = e.code.slice(6);
      }

      const hasModifier = e.ctrlKey || e.metaKey || e.altKey;

      // Anything that isn't a plain in-scope letter/number is disabled.
      if (!char || hasModifier || !passesMode(char, modeRef.current)) {
        e.preventDefault();
        return;
      }

      // Ignore auto-repeat so a held key doesn't flood the screen and audio.
      if (e.repeat) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      onCharRef.current(char.toUpperCase());
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);
}
