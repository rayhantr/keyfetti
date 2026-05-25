"use client";

import { type Ref, useCallback, useImperativeHandle, useRef, useState } from "react";
import { FloatingLetter, type DisplayMode } from "./floating-letter";
import { charToX } from "@/lib/keyboard-layout";
import { randomColor } from "@/lib/colors";

type ActiveLetter = {
  id: number;
  char: string;
  x: number;
  color: string;
  rotate: number;
  displayMode: DisplayMode; // snapshot at creation so the case never changes mid-flight
};

// Cap concurrent letters so furious smashing can't bloat the DOM or stutter.
const MAX_LETTERS = 60;

export type ConfettiHandle = { add: (char: string) => void };

type Props = {
  displayMode: DisplayMode;
  play: (char: string) => void;
  ref: Ref<ConfettiHandle>;
};

/**
 * Owns the only rapidly-changing state in the app — the floating letters and the
 * screen-reader announcement — so a keystroke re-renders just this layer, leaving
 * the controls and on-screen keyboard untouched. New letters are pushed in
 * imperatively via the `add` handle, which keeps the parent from re-rendering on
 * every key press.
 */
export function Confetti({ displayMode, play, ref }: Props) {
  const [letters, setLetters] = useState<ActiveLetter[]>([]);
  const [announce, setAnnounce] = useState("");
  const idRef = useRef(0);

  // Stable across renders so memoised letters never re-render when a sibling is
  // added — `setLetters` is stable and the updater is functional, so deps are [].
  const remove = useCallback((id: number) => {
    setLetters((prev) => prev.filter((l) => l.id !== id));
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      add(char: string) {
        // Small horizontal jitter so repeated presses of the same key don't stack.
        const jitter = (Math.random() - 0.5) * 0.06;
        const x = Math.min(0.96, Math.max(0.04, charToX(char) + jitter));
        const next: ActiveLetter = {
          id: idRef.current++,
          char,
          x,
          color: randomColor(),
          rotate: (Math.random() - 0.5) * 24,
          displayMode,
        };

        setLetters((prev) => {
          const trimmed =
            prev.length >= MAX_LETTERS ? prev.slice(prev.length - MAX_LETTERS + 1) : prev;
          return [...trimmed, next];
        });
        // Toggle a trailing space so repeating the same key still re-fires the live
        // region for screen readers (a trailing space isn't spoken).
        setAnnounce(next.id % 2 === 0 ? char : `${char} `);
        play(char);
      },
    }),
    [displayMode, play],
  );

  return (
    <>
      {letters.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
          <p className="text-2xl font-bold text-white/70 sm:text-4xl">
            Press any letter or number! 🎉
          </p>
        </div>
      )}

      {letters.map((l) => (
        <FloatingLetter
          key={l.id}
          id={l.id}
          char={l.char}
          x={l.x}
          color={l.color}
          rotate={l.rotate}
          displayMode={l.displayMode}
          onDone={remove}
        />
      ))}

      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </>
  );
}
