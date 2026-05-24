import { useEffect, useRef, useState } from "react";
import { spokenText } from "@/lib/speech";

const MUTE_KEY = "ks:muted";

/**
 * Wraps the Web Speech API to say each pressed character aloud. Picks a clear
 * English voice once voices have loaded (they arrive asynchronously), cancels
 * any in-flight utterance before speaking so rapid presses stay snappy instead
 * of queuing, and degrades silently when speech synthesis is unavailable.
 */
export function useSpeech() {
  // Resolved on the client only, to avoid an SSR/hydration mismatch.
  const [supported, setSupported] = useState(false);
  const [muted, setMuted] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const mutedRef = useRef(false);
  mutedRef.current = muted;

  useEffect(() => {
    setSupported("speechSynthesis" in window);
    if (window.localStorage.getItem(MUTE_KEY) === "1") setMuted(true);
  }, []);

  useEffect(() => {
    if (!supported) return;

    function pickVoice() {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
      const pool = english.length ? english : voices;
      voiceRef.current =
        pool.find((v) => /google|natural|samantha|zira|aria/i.test(v.name)) ??
        pool.find((v) => v.default) ??
        pool[0];
    }

    pickVoice();
    window.speechSynthesis.addEventListener("voiceschanged", pickVoice);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", pickVoice);
  }, [supported]);

  function toggleMuted() {
    setMuted((prev) => {
      const next = !prev;
      window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
      if (next && "speechSynthesis" in window) window.speechSynthesis.cancel();
      return next;
    });
  }

  function speak(char: string) {
    if (!supported || mutedRef.current) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText(char));
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.rate = 0.95;
    utterance.pitch = 1.15;
    utterance.volume = 1;
    synth.speak(utterance);
  }

  return { speak, muted, toggleMuted, supported };
}
