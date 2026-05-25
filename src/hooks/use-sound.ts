import { useEffect, useRef, useSyncExternalStore } from "react";
import { spokenText } from "@/lib/speech";

const MUTE_KEY = "ks:muted";

// C-major pentatonic — any combination sounds pleasant, even when smashing.
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0];

// Voice preferences: warm, friendly (usually female) voices kids respond well
// to, and the deeper male system voices to avoid when a friendlier one exists.
const PREFER_VOICE =
  /child|kid|zira|hazel|susan|samantha|karen|moira|tessa|fiona|catherine|victoria|aria|jenny|eva|female/i;
const AVOID_VOICE = /david|mark|george|james|fred|alex|daniel|guy|male/i;

// Higher pitch makes the spoken letters sound cuter and more child-friendly.
const SPEECH_PITCH = 1.5;

// Slower rate stretches each letter out ("aaay" instead of a clipped "ay") for
// a playful, drawn-out sound. Range is 0.1–10; 1 is normal speed.
const SPEECH_RATE = 0.6;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

function charToFreq(char: string): number {
  const code = char.charCodeAt(0);
  const note = SCALE[code % SCALE.length];
  const octave = (code >> 2) % 2 === 0 ? 1 : 2; // a little variety between keys
  return note * octave;
}

// --- "supported" store: the sound APIs either exist or they don't (static). --
function subscribeNoop(): () => void {
  return () => {};
}
function getSupported(): boolean {
  return (
    "speechSynthesis" in window ||
    "AudioContext" in window ||
    "webkitAudioContext" in window
  );
}
function getSupportedServer(): boolean {
  return false;
}

// --- "muted" store: backed by localStorage so the choice survives reloads. ---
const mutedListeners = new Set<() => void>();
function subscribeMuted(callback: () => void): () => void {
  mutedListeners.add(callback);
  return () => {
    mutedListeners.delete(callback);
  };
}
function getMuted(): boolean {
  return window.localStorage.getItem(MUTE_KEY) === "1";
}
function getMutedServer(): boolean {
  return false;
}
function writeMuted(value: boolean): void {
  window.localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  mutedListeners.forEach((listener) => listener());
}

/**
 * Plays sound for each pressed character with two layers:
 *  1. An instant Web Audio "pop" (a short synthesized blip) for zero-latency
 *     feedback the moment a key is pressed.
 *  2. The spoken letter/number via the Web Speech API, which follows shortly
 *     after (TTS has inherent start-up latency; the pop covers that gap).
 * A single mute toggle silences both. Degrades gracefully if either API is
 * unavailable.
 */
export function useSound() {
  const supported = useSyncExternalStore(subscribeNoop, getSupported, getSupportedServer);
  const muted = useSyncExternalStore(subscribeMuted, getMuted, getMutedServer);

  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  // Create/resume the AudioContext. Must happen during a user gesture, so this
  // is called from the first interaction and from every play().
  function ensureAudio() {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
      if (Ctor) ctxRef.current = new Ctor();
    }
    const ctx = ctxRef.current;
    if (ctx && ctx.state === "suspended") void ctx.resume();
    return ctx;
  }

  useEffect(() => {
    if (!supported) return;
    const synth = "speechSynthesis" in window ? window.speechSynthesis : null;

    function pickVoice() {
      if (!synth) return;
      const voices = synth.getVoices();
      if (!voices.length) return;
      const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
      const pool = english.length ? english : voices;
      // On-device voices start almost immediately; cloud voices wait on a
      // network round-trip, which is the main source of speech latency.
      const local = pool.filter((v) => v.localService);
      const candidates = local.length ? local : pool;

      // Prefer a warm, friendly (typically female) voice for young children,
      // and steer away from the deeper male system voices when possible.
      const friendly = candidates.filter((v) => !AVOID_VOICE.test(v.name));
      const fpool = friendly.length ? friendly : candidates;
      voiceRef.current =
        fpool.find((v) => PREFER_VOICE.test(v.name)) ??
        fpool.find((v) => v.default) ??
        fpool[0];
    }

    pickVoice();
    synth?.addEventListener("voiceschanged", pickVoice);

    // On the first interaction, unlock audio and warm up the TTS engine so the
    // first real key press isn't slowed by cold-start.
    function warmUp() {
      ensureAudio();
      if (synth) {
        const primer = new SpeechSynthesisUtterance(" ");
        primer.volume = 0;
        synth.speak(primer);
      }
      window.removeEventListener("pointerdown", warmUp);
      window.removeEventListener("keydown", warmUp);
    }
    window.addEventListener("pointerdown", warmUp, { once: true });
    window.addEventListener("keydown", warmUp, { once: true });

    return () => {
      synth?.removeEventListener("voiceschanged", pickVoice);
      window.removeEventListener("pointerdown", warmUp);
      window.removeEventListener("keydown", warmUp);
    };
  }, [supported]);

  function playPop(char: string) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle"; // soft and round, kid-friendly
    osc.frequency.setValueAtTime(charToFreq(char), now);
    // Percussive envelope: instant attack, quick decay.
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  function speakLetter(char: string) {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    // Only interrupt when something is actually speaking (rapid smashing);
    // skipping cancel when idle avoids the cancel-then-speak latency quirk.
    if (synth.speaking || synth.pending) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText(char));
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.rate = SPEECH_RATE;
    utterance.pitch = SPEECH_PITCH;
    utterance.volume = 1;
    synth.speak(utterance);
  }

  function play(char: string) {
    if (!supported || muted) return;
    playPop(char); // instant
    speakLetter(char); // follows
  }

  function toggleMuted() {
    const next = !muted;
    writeMuted(next);
    if (next && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  return { play, muted, toggleMuted, supported };
}
