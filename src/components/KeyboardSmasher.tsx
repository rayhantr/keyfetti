"use client";

import { useRef, useState } from "react";
import { useKeyboardInput, type InputMode } from "@/hooks/useKeyboardInput";
import { useSpeech } from "@/hooks/useSpeech";
import { useTouchDevice } from "@/hooks/useTouchDevice";
import { FloatingLetter, type DisplayMode } from "./FloatingLetter";
import { OnScreenKeyboard } from "./OnScreenKeyboard";
import { ControlsBar } from "./ControlsBar";
import { charToX } from "@/lib/keyboardLayout";
import { randomColor } from "@/lib/colors";

type ActiveLetter = {
  id: number;
  char: string;
  x: number;
  color: string;
  rotate: number;
};

// Cap concurrent letters so furious smashing can't bloat the DOM or stutter.
const MAX_LETTERS = 60;

const BACKGROUND = "radial-gradient(circle at 50% 30%, #1b2a4a, #0a0f1f 70%)";

export function KeyboardSmasher() {
  const [letters, setLetters] = useState<ActiveLetter[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("both");
  const [mode, setMode] = useState<InputMode>("both");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [announce, setAnnounce] = useState("");

  const idRef = useRef(0);
  const isTouch = useTouchDevice();
  const { speak, muted, toggleMuted, supported } = useSpeech();

  function addLetter(char: string) {
    // Small horizontal jitter so repeated presses of the same key don't stack.
    const jitter = (Math.random() - 0.5) * 0.06;
    const x = Math.min(0.96, Math.max(0.04, charToX(char) + jitter));
    const next: ActiveLetter = {
      id: idRef.current++,
      char,
      x,
      color: randomColor(),
      rotate: (Math.random() - 0.5) * 24,
    };

    setLetters((prev) => {
      const trimmed =
        prev.length >= MAX_LETTERS ? prev.slice(prev.length - MAX_LETTERS + 1) : prev;
      return [...trimmed, next];
    });
    // Toggle a trailing space so repeating the same key still re-fires the live
    // region for screen readers (a trailing space isn't spoken).
    setAnnounce(next.id % 2 === 0 ? char : `${char} `);
    speak(char);
  }

  function removeLetter(id: number) {
    setLetters((prev) => prev.filter((l) => l.id !== id));
  }

  useKeyboardInput({ onChar: addLetter, mode });

  const keyboardVisible = isTouch || showKeyboard;

  return (
    <main
      className="relative h-dvh w-full overflow-hidden select-none"
      style={{ background: BACKGROUND }}
      onContextMenu={(e) => e.preventDefault()}
    >
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
          char={l.char}
          x={l.x}
          color={l.color}
          rotate={l.rotate}
          displayMode={displayMode}
          onDone={() => removeLetter(l.id)}
        />
      ))}

      <ControlsBar
        muted={muted}
        soundSupported={supported}
        onToggleMute={toggleMuted}
        displayMode={displayMode}
        onDisplayMode={setDisplayMode}
        mode={mode}
        onMode={setMode}
        showKeyboard={showKeyboard}
        onToggleKeyboard={() => setShowKeyboard((s) => !s)}
        isTouch={isTouch}
      />

      {keyboardVisible && <OnScreenKeyboard onChar={addLetter} mode={mode} />}

      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </main>
  );
}
