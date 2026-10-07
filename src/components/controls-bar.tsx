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

          {/* Attribution lives in the menu so it never covers the on-screen keyboard.
              Only the gif links to sindbug.com; the icon links to the source repo. */}
          <div className="mt-3 flex items-center justify-center gap-2 border-t border-white/10 pt-3 text-xs text-white/40">
            <span>Bugged by</span>
            <a
              href="https://sindbug.com"
              target="_blank"
              rel="noreferrer"
              className="flex transition-opacity hover:opacity-70"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- animated GIF; next/image would freeze it to one frame */}
              <img src="https://sindbug.com/sindbug.gif" alt="SINDBUG" className="h-3 w-auto" />
            </a>
            <a
              href="https://github.com/rayhantr/keyfetti"
              target="_blank"
              rel="noreferrer"
              aria-label="View source on GitHub"
              title="View source on GitHub"
              className="flex transition-opacity hover:opacity-70"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
