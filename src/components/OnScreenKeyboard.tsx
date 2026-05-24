"use client";

import { KEY_ROWS } from "@/lib/keyboardLayout";
import type { InputMode } from "@/hooks/useKeyboardInput";

type Props = {
  onChar: (char: string) => void;
  mode: InputMode;
};

/**
 * Tappable QWERTY + number keyboard for touch devices (and an optional toggle
 * on desktop). Each key routes through the same `onChar` handler as physical
 * keys, so it produces an identical floating letter and spoken sound.
 */
export function OnScreenKeyboard({ onChar, mode }: Props) {
  const rows = KEY_ROWS.filter((row) => {
    const isNumberRow = /[0-9]/.test(row.keys);
    if (mode === "letters") return !isNumberRow;
    if (mode === "numbers") return isNumberRow;
    return true;
  });

  return (
    <div className="absolute inset-x-0 bottom-0 z-10 select-none bg-black/30 p-2 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-1.5">
        {rows.map((row) => (
          <div key={row.keys} className="flex w-full justify-center gap-1.5">
            {row.keys.split("").map((char) => (
              <button
                key={char}
                type="button"
                aria-label={char}
                onPointerDown={(e) => {
                  e.preventDefault();
                  onChar(char);
                  e.currentTarget.blur();
                }}
                className="flex h-11 max-w-14 min-w-9 flex-1 items-center justify-center rounded-lg bg-white/15 text-lg font-semibold text-white transition active:scale-95 active:bg-white/30 sm:h-14 sm:text-xl"
              >
                {char}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
