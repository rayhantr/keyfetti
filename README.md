# Keyfetti 🎉

**Keyfetti** is a playful, full-screen keyboard toy for **children** (and fun for adults too). Press
any letter or number and it floats up from the bottom of the screen — as if it popped out of the
physical keyboard — fades in, and is spoken aloud. Every other key is disabled, so little ones can
mash away safely.

## Features

- **Letters & numbers only.** All other keys (arrows, space, Tab, function keys, Ctrl/Alt/Cmd
  combos…) are ignored and their browser actions are suppressed where possible.
- **Rises from its keyboard spot.** Each character floats up from a horizontal position that matches
  its place on a QWERTY keyboard (`Q` from the left, `P` from the right).
- **Instant sound.** An immediate Web Audio "pop" (synthesized in code, zero latency) fires the
  moment a key is pressed, and the browser's Web Speech API then says the letter/number aloud — no
  audio files needed. A single mute toggle silences both. A local (on-device) voice is preferred to
  keep speech snappy.
- **Both letter cases.** Shows the uppercase letter with its lowercase partner (`Aa`) by default;
  switchable to uppercase- or lowercase-only.
- **Touch friendly.** On tablets/phones an on-screen keyboard appears so kids without a physical
  keyboard can play (also toggleable on desktop).
- **Smash-proof.** Multiple simultaneous keys each spawn their own letter; held keys don't spam;
  on-screen letters are capped for smooth performance.
- **Kid-proofing & a11y.** Fullscreen toggle, right-click disabled, screen-reader announcements,
  and respects the OS "reduce motion" setting.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Motion](https://motion.dev) (`motion/react`) for the rise + fade animation
- Web Speech API for spoken letters (no dependency)

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start pressing keys.

```bash
npm run build   # production build
npm run start   # serve the production build
```

## Project structure

```
src/app/                  layout, page, global styles
src/components/
  main-app.tsx            main orchestrator (state, input, sound, controls)
  floating-letter.tsx     the animated rising/fading letter
  on-screen-keyboard.tsx  tappable keyboard for touch devices
  controls-bar.tsx        mute, fullscreen, settings popover
src/hooks/                use-keyboard-input, use-sound, use-touch-device
src/lib/                  keyboard-layout (QWERTY → position), colors, speech text
```

## A note on "disabling" keys

A web page can ignore keys and call `preventDefault()` to stop in-page actions (scrolling, find,
tab-navigation, etc.), and this app does so for every non-letter/number key. However, **browsers do
not let a page block OS/browser-reserved shortcuts** such as `Ctrl`/`Cmd`+`W`, `Cmd`+`Q`, `F11`, or
`Alt`+`Tab`. For the most distraction-free experience for young children, use the **Fullscreen**
button and your browser's kiosk/guided-access mode.
