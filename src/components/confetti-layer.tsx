"use client";

import { type Ref, useCallback, useImperativeHandle, useRef, useState } from "react";
import { FloatingLetter, type DisplayMode } from "./floating-letter";
import { ConfettiBurst } from "./confetti-burst";
import { charToX } from "@/lib/keyboard-layout";
import { randomColor } from "@/lib/colors";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type ActiveLetter = {
  id: number;
  char: string;
  x: number;
  color: string;
  rotate: number;
  drift: string; // snapshot at creation; "5vw"-style horizontal drift for variety
  displayMode: DisplayMode; // snapshot at creation so the case never changes mid-flight
};

type ActiveBurst = {
  id: number;
  x: number; // same launch column as the letter it accompanies
};

// Cap concurrent letters so furious smashing can't bloat the DOM or stutter.
const MAX_LETTERS = 60;
// A separate, smaller cap for bursts: each burst is a dozen pieces, so this keeps
// the on-screen particle count bounded (and the screen uncluttered) when smashing.
const MAX_BURSTS = 14;

export type ConfettiHandle = { add: (char: string) => void };

type Props = {
  displayMode: DisplayMode;
  play: (char: string) => void;
  ref: Ref<ConfettiHandle>;
};

// Random horizontal drift (in vw) the letter accrues as it rises, tapered toward
// 0 near the screen edges so an edge key never sails off-screen or wanders into a
// neighbouring key's column. The launch point itself stays anchored (the CSS
// keyframe holds drift at 0 during the fade-in).
function driftFor(x: number): string {
  const edge = Math.min(x, 1 - x); // 0 at an edge … 0.5 at centre
  const mag = 8 * Math.min(1, edge / 0.25); // taper within 25% of an edge
  const drift = (Math.random() < 0.5 ? -1 : 1) * mag * Math.random();
  return `${drift.toFixed(2)}vw`;
}

/**
 * Owns the only rapidly-changing state in the app — the floating letters, their
 * confetti bursts, and the screen-reader announcement — so a keystroke re-renders
 * just this layer, leaving the controls and on-screen keyboard untouched. New
 * letters/bursts are pushed in imperatively via the `add` handle, which keeps the
 * parent from re-rendering on every key press.
 */
export function Confetti({ displayMode, play, ref }: Props) {
  const [letters, setLetters] = useState<ActiveLetter[]>([]);
  const [bursts, setBursts] = useState<ActiveBurst[]>([]);
  const [announce, setAnnounce] = useState("");
  const idRef = useRef(0);
  const burstIdRef = useRef(0);

  const reducedMotion = useReducedMotion();

  // Stable across renders so memoised children never re-render when a sibling is
  // added — `setLetters`/`setBursts` are stable and the updaters are functional.
  const remove = useCallback((id: number) => {
    setLetters((prev) => prev.filter((l) => l.id !== id));
  }, []);
  const removeBurst = useCallback((id: number) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
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
          drift: driftFor(x),
          displayMode,
        };

        setLetters((prev) => {
          const trimmed =
            prev.length >= MAX_LETTERS ? prev.slice(prev.length - MAX_LETTERS + 1) : prev;
          return [...trimmed, next];
        });

        // Confetti erupts from the same spot the letter rises from. Skipped under
        // "reduce motion" — letters still appear (fade-only), nothing animates out.
        if (!reducedMotion) {
          const burst: ActiveBurst = { id: burstIdRef.current++, x };
          setBursts((prev) => {
            const trimmed =
              prev.length >= MAX_BURSTS ? prev.slice(prev.length - MAX_BURSTS + 1) : prev;
            return [...trimmed, burst];
          });
        }

        // Toggle a trailing space so repeating the same key still re-fires the live
        // region for screen readers (a trailing space isn't spoken).
        setAnnounce(next.id % 2 === 0 ? char : `${char} `);
        play(char);
      },
    }),
    [displayMode, play, reducedMotion],
  );

  return (
    <>
      {/* Bursts render first so they sit behind the letters — the letter stays the star. */}
      {bursts.map((b) => (
        <ConfettiBurst key={b.id} id={b.id} x={b.x} onDone={removeBurst} />
      ))}

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
          drift={l.drift}
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
