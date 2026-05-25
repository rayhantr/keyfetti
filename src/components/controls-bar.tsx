"use client";

import { useState } from "react";
import type { DisplayMode } from "./floating-letter";
import type { InputMode } from "@/hooks/use-keyboard-input";

type Props = {
  muted: boolean;
  soundSupported: boolean;
  onToggleMute: () => void;
  displayMode: DisplayMode;
  onDisplayMode: (mode: DisplayMode) => void;
  mode: InputMode;
  onMode: (mode: InputMode) => void;
  showKeyboard: boolean;
  onToggleKeyboard: () => void;
  isTouch: boolean;
};

function toggleFullscreen() {
  if (typeof document === "undefined") return;
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.().catch(() => {});
  }
}

const ICON_BTN =
  "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-white backdrop-blur transition hover:bg-white/20 active:scale-95";

const MODES: InputMode[] = ["both", "letters", "numbers"];
const CASES: [DisplayMode, string][] = [
  ["both", "Aa"],
  ["upper", "A"],
  ["lower", "a"],
];

/** Subtle, parent-reachable controls: mute, fullscreen, and a settings popover. */
export function ControlsBar(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2">
      <div className="flex gap-2">
        {props.soundSupported && (
          <button
            type="button"
            aria-label={props.muted ? "Unmute" : "Mute"}
            className={ICON_BTN}
            onClick={(e) => {
              props.onToggleMute();
              e.currentTarget.blur();
            }}
          >
            {props.muted ? "🔇" : "🔊"}
          </button>
        )}
        <button
          type="button"
          aria-label="Toggle fullscreen"
          className={ICON_BTN}
          onClick={(e) => {
            toggleFullscreen();
            e.currentTarget.blur();
          }}
        >
          ⛶
        </button>
        <button
          type="button"
          aria-label="Settings"
          aria-expanded={open}
          className={ICON_BTN}
          onClick={(e) => {
            setOpen((o) => !o);
            e.currentTarget.blur();
          }}
        >
          ⚙️
        </button>
      </div>

      {open && (
        <div className="w-56 rounded-2xl bg-slate-900/90 p-4 text-white shadow-xl backdrop-blur">
          <fieldset className="mb-3">
            <legend className="mb-1 text-sm font-semibold opacity-80">Show</legend>
            <div className="flex gap-1">
              {MODES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={(e) => {
                    props.onMode(m);
                    e.currentTarget.blur();
                  }}
                  className={`flex-1 rounded-lg px-2 py-1 text-sm capitalize ${
                    props.mode === m ? "bg-sky-500" : "bg-white/10"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1 text-sm font-semibold opacity-80">Letter case</legend>
            <div className="flex gap-1">
              {CASES.map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={(e) => {
                    props.onDisplayMode(m);
                    e.currentTarget.blur();
                  }}
                  className={`flex-1 rounded-lg px-2 py-1 text-sm ${
                    props.displayMode === m ? "bg-sky-500" : "bg-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          {!props.isTouch && (
            <button
              type="button"
              onClick={(e) => {
                props.onToggleKeyboard();
                e.currentTarget.blur();
              }}
              className="mt-3 w-full rounded-lg bg-white/10 px-2 py-1 text-sm"
            >
              {props.showKeyboard ? "Hide on-screen keyboard" : "Show on-screen keyboard"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
