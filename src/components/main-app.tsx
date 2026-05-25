"use client";

import { useRef, useState } from "react";
import { useKeyboardInput, type InputMode } from "@/hooks/use-keyboard-input";
import { useSound } from "@/hooks/use-sound";
import { useTouchDevice } from "@/hooks/use-touch-device";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Confetti, type ConfettiHandle } from "./confetti-layer";
import type { DisplayMode } from "./floating-letter";
import { OnScreenKeyboard } from "./on-screen-keyboard";
import { ControlsBar } from "./controls-bar";

const BACKGROUND = "radial-gradient(circle at 50% 30%, #1b2a4a, #0a0f1f 70%)";

export function MainApp() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("both");
  const [mode, setMode] = useState<InputMode>("both");
  const [showKeyboard, setShowKeyboard] = useState(false);

  const isTouch = useTouchDevice();
  const reducedMotion = useReducedMotion();
  const { play, muted, toggleMuted, supported } = useSound();

  // Letters live in <Confetti/>; pushing one in imperatively keeps keystrokes
  // from re-rendering this shell (and therefore the controls and keyboard below).
  const confettiRef = useRef<ConfettiHandle>(null);
  const emit = (char: string) => confettiRef.current?.add(char);

  useKeyboardInput({ onChar: emit, mode });

  const keyboardVisible = isTouch || showKeyboard;

  return (
    <main
      className="relative h-dvh w-full overflow-hidden select-none"
      style={{ background: BACKGROUND }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Ambient aurora behind everything — slow, dark, low-contrast so letters and
          confetti keep their punch. Skipped under reduce-motion (static gradient only). */}
      {!reducedMotion && (
        <div className="aurora" aria-hidden="true">
          <div className="aurora__blob aurora__blob--1" />
          <div className="aurora__blob aurora__blob--2" />
        </div>
      )}

      <Confetti ref={confettiRef} displayMode={displayMode} play={play} />

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

      {keyboardVisible && <OnScreenKeyboard onChar={emit} mode={mode} />}
    </main>
  );
}
