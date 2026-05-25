"use client";

import { type CSSProperties, memo, useRef, useState } from "react";
import { randomColor } from "@/lib/colors";

// How many pieces fly out of a single burst. Kept small so a burst reads as a
// cheerful pop, not a screenful of litter — and so furious smashing (capped at
// MAX_BURSTS in the layer above) can't bloat the DOM.
const PIECES_PER_BURST = 12;

type Piece = {
  lx: number; // launch offset x (px); the outward direction of the pop
  ly: number; // launch offset y (px); negative = upward
  g: number; // extra downward fall by the end (gravity, px)
  rotate: number; // spin over the piece's life (deg)
  color: string;
  size: number; // px
};

type Props = {
  id: number;
  x: number; // 0..1 — same launch column as the letter it celebrates
  onDone: (id: number) => void;
};

// Pieces burst mostly upward/outward (never straight down) for a fountain feel.
function makePieces(): Piece[] {
  return Array.from({ length: PIECES_PER_BURST }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5; // up ±135°
    const dist = 40 + Math.random() * 90;
    return {
      lx: Math.cos(angle) * dist,
      ly: Math.sin(angle) * dist,
      g: 60 + Math.random() * 120,
      rotate: (Math.random() - 0.5) * 540,
      color: randomColor(),
      size: 6 + Math.random() * 7,
    };
  });
}

/**
 * A short-lived confetti burst anchored at the same horizontal spot a letter
 * rises from, so it looks like the letter erupted out of its keyboard key. Each
 * piece animates via the `confetti-pop` CSS keyframe (compositor, off the main
 * thread — matching FloatingLetter), then the whole burst removes itself.
 *
 * Self-removal without a timer: `animationend` bubbles up from each piece to the
 * wrapper, so once we've counted one per piece, the burst is finished and calls
 * `onDone`. Memoised — its pieces are generated once and fixed for its lifetime,
 * so a new burst never re-renders existing ones.
 */
export const ConfettiBurst = memo(function ConfettiBurst({ id, x, onDone }: Props) {
  const [pieces] = useState(makePieces);
  const finished = useRef(0);

  return (
    <div
      className="pointer-events-none absolute bottom-[10%]"
      style={{ left: `${x * 100}%`, transform: "translateX(-50%)" }}
      onAnimationEnd={() => {
        finished.current += 1;
        if (finished.current >= pieces.length) onDone(id);
      }}
    >
      {pieces.map((p, i) => (
        <i
          key={i}
          className="confetti-piece"
          style={
            {
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              "--lx": `${p.lx}px`,
              "--ly": `${p.ly}px`,
              "--g": `${p.g}px`,
              "--rotate": `${p.rotate}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
});
