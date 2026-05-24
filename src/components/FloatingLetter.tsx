"use client";

import { motion, useReducedMotion } from "motion/react";
import { isLetter } from "@/lib/keyboardLayout";

export type DisplayMode = "both" | "upper" | "lower";

type Props = {
  char: string; // canonical uppercase letter or a digit
  x: number; // 0..1 horizontal position to rise from
  color: string;
  rotate: number;
  displayMode: DisplayMode;
  onDone: () => void;
};

/**
 * A single letter/number that rises up from the bottom of the screen (as if it
 * floated up out of the physical keyboard), fades in, drifts upward, and fades
 * out — then removes itself via `onDone`. Honours reduced-motion preferences.
 */
export function FloatingLetter({ char, x, color, rotate, displayMode, onDone }: Props) {
  const reduce = useReducedMotion();
  const letter = isLetter(char);

  return (
    <motion.div
      className="pointer-events-none absolute bottom-[8%] -translate-x-1/2 select-none font-bold leading-none"
      style={{ left: `${x * 100}%`, color, textShadow: "0 4px 28px rgba(0,0,0,0.5)" }}
      initial={{ opacity: 0, y: reduce ? 0 : "8vh", scale: reduce ? 1 : 0.5 }}
      animate={
        reduce
          ? { opacity: [0, 1, 1, 0] }
          : {
              opacity: [0, 1, 1, 0],
              y: ["8vh", "-2vh", "-45vh", "-62vh"],
              scale: [0.5, 1, 1, 0.95],
              rotate: [0, rotate, rotate, rotate],
            }
      }
      transition={{ duration: reduce ? 1.6 : 2.6, times: [0, 0.15, 0.75, 1], ease: "easeOut" }}
      onAnimationComplete={onDone}
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
    </motion.div>
  );
}
