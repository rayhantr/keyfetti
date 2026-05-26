<div align="center">

<img src="public/cover.png" alt="Keyfetti" width="440" />

### A playful, full-screen keyboard toy for kids 🎉

Press any letter or number and watch it pop up like confetti — and hear it spoken aloud.
Every other key is disabled, so little ones can mash away safely.

</div>

---

## ✨ Features

- **Letters & numbers only.** Arrows, space, Tab, function keys, and Ctrl/Alt/Cmd combos are ignored,
  and their browser actions are suppressed where possible — so a curious masher can't wander off.
- **Pops out of its keyboard spot.** Each character rises from a horizontal position matching its
  place on a QWERTY keyboard (`Q` from the left, `P` from the right), then drifts on a gently varied
  path so no two presses trace the exact same line.
- **Confetti!** A small burst erupts from the same spot the letter rises from, as if the character
  popped out of its key. Bursts are short-lived and capped, so even furious smashing stays cheerful
  rather than cluttered.
- **Instant sound.** A zero-latency Web Audio "pop" (synthesized in code) fires the moment a key is
  pressed, and the Web Speech API then says the letter/number aloud — no audio files needed. A single
  mute toggle silences both, and a local (on-device) voice is preferred to keep speech snappy.
- **Both letter cases.** Shows the uppercase letter beside its lowercase partner (`Aa`) by default;
  switchable to uppercase- or lowercase-only.
- **Ambient backdrop.** A slow, subtle aurora drifts behind everything for a touch of life, kept dark
  and low-contrast so the letters and confetti always stay the stars.
- **Touch friendly.** On tablets and phones an on-screen keyboard appears so kids without a physical
  keyboard can play (also toggleable on desktop).
- **Smash-proof.** Simultaneous keys each spawn their own letter, held keys don't spam, and on-screen
  letters are capped for smooth performance no matter how hard it's mashed.
- **Kid-proofing & a11y.** Fullscreen toggle, right-click disabled, screen-reader announcements, and
  full respect for the OS "reduce motion" setting (confetti and aurora pause; letters simply fade).

## 🎮 How to play

Just start pressing keys! A small controls cluster sits in the top-right corner:

| Control | What it does |
| --- | --- |
| 🔊 / 🔇 | Mute or unmute all sound |
| ⛶ | Toggle fullscreen (best for distraction-free play) |
| ⚙️ | **Settings:** show letters / numbers / both, choose letter case (`Aa` / `A` / `a`), and toggle the on-screen keyboard |

## 🚀 Getting started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) and start pressing keys.

```bash
yarn build   # production build
yarn start   # serve the production build
```

## 🧱 Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack) + **React 19** + **TypeScript**
- **[Tailwind CSS v4](https://tailwindcss.com)** for styling
- **Pure CSS keyframe animations** — the rise, drift, confetti, and aurora all run on the compositor
  (off the main thread), so smashing stays smooth with no animation library
- **Web Audio API** (synthesized pop) + **Web Speech API** (spoken letters) — no audio files

> Zero runtime dependencies beyond React and Next.js — all the motion and sound is hand-rolled.

## 📁 Project structure

```
src/app/                  layout, page, global styles, favicon
src/components/
  main-app.tsx            shell: wires input, sound, controls, and the aurora backdrop
  confetti-layer.tsx      owns the only fast-changing state (floating letters + bursts)
  floating-letter.tsx     a single rising / fading letter
  confetti-burst.tsx      a self-removing burst of confetti pieces
  on-screen-keyboard.tsx  tappable keyboard for touch devices
  controls-bar.tsx        mute, fullscreen, and the settings popover
src/hooks/                use-keyboard-input, use-sound, use-touch-device, use-reduced-motion
src/lib/                  keyboard-layout (QWERTY → position), colors, speech text
```

Keystrokes are pushed into `confetti-layer.tsx` imperatively, so a press re-renders only that layer —
the controls and on-screen keyboard never re-render on input, keeping rapid mashing fast.

## 🔒 A note on "disabling" keys

A web page can ignore keys and call `preventDefault()` to stop in-page actions (scrolling, find,
tab-navigation, etc.), and Keyfetti does so for every non-letter/number key. However, **browsers do
not let a page block OS/browser-reserved shortcuts** such as `Ctrl`/`Cmd`+`W`, `Cmd`+`Q`, `F11`, or
`Alt`+`Tab`. For the most distraction-free experience with young children, use the **Fullscreen**
button together with your browser's kiosk / guided-access mode.
