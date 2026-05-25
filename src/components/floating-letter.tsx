"use client";

import { type CSSProperties, memo } from "react";
import { isLetter } from "@/lib/keyboard-layout";

export type DisplayMode = "both" | "upper" | "lower";

type Props = {
  id: number;
  char: string; // canonical uppercase letter or a digit
  x: number; // 0..1 horizontal position to rise from
  color: string;
  rotate: number;
  displayMode: DisplayMode;
  onDone: (id: number) => void;
};

/**
 * A single letter/number that rises up from the bottom of the screen (as if it
 * floated up out of the physical keyboard), fades in, drifts upward, and fades
 * out — then removes itself when the animation ends.
 *
 * The motion is a pure CSS keyframe animation (see `.floating-letter` in
 * globals.css), so it runs on the compositor off the main thread — dozens can
 * animate at once without jank. Reduced-motion is honoured via a CSS media query.
 *
 * Memoised: its props are fixed for the letter's lifetime (the case is snapshot
 * at creation), so adding a new letter never re-renders the existing ones.
 */
export const FloatingLetter = memo(function FloatingLetter({
  id,
  char,
  x,
  color,
  rotate,
  displayMode,
  onDone,
}: Props) {
  const letter = isLetter(char);

  return (
    <div
      className="floating-letter pointer-events-none absolute bottom-[8%] select-none font-bold leading-none"
      style={
        {
          left: `${x * 100}%`,
          color,
          textShadow: "0 4px 28px rgba(0,0,0,0.5)",
          "--rotate": `${rotate}deg`,
        } as CSSProperties
      }
      onAnimationEnd={() => onDone(id)}
    >
      {letter && displayMode === "both" ? (
        <span className="flex items-baseline gap-[0.04em] text-[22vmin] sm:text-[26vmin]">
          <span>{char}</span>
          <span className="text-[0.62em] opacity-90">{char.toLowerCase()}</span>
        </span>
      ) : (
        <span className="text-[26vmin]">
          {letter && displayMode === "lower" ? char.toLowerCase() : char}
        </span>
      )}
    </div>
  );
});
