import type { ThemeId } from "@/lib/theme";

let muted = false;
let context: AudioContext | null = null;

export function setSoundMuted(next: boolean): void {
  muted = next;
}

export function unlockSound(): void {
  audioContext();
}

export function isSoundMuted(): boolean {
  return muted;
}

function audioContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }
  const AudioCtx = window.AudioContext;
  if (!AudioCtx) {
    return null;
  }
  if (!context) {
    context = new AudioCtx();
  }
  if (context.state === "suspended") {
    void context.resume();
  }
  return context;
}

function tone(
  audio: AudioContext,
  options: {
    type: OscillatorType;
    from: number;
    to: number;
    duration: number;
    gain?: number;
    delay?: number;
  },
): void {
  const now = audio.currentTime + (options.delay ?? 0);
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = options.type;
  oscillator.frequency.setValueAtTime(options.from, now);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, options.to), now + options.duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(options.gain ?? 0.12, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + options.duration);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(now);
  oscillator.stop(now + options.duration + 0.02);
}

export function playCorrect(theme: ThemeId): void {
  if (muted) {
    return;
  }
  const audio = audioContext();
  if (!audio) {
    return;
  }
  if (theme === "dinosaur") {
    tone(audio, { type: "triangle", from: 150, to: 70, duration: 0.18, gain: 0.16 });
    return;
  }
  tone(audio, { type: "sine", from: 620, to: 980, duration: 0.16, gain: 0.1 });
  tone(audio, { type: "sine", from: 880, to: 1240, duration: 0.14, gain: 0.06, delay: 0.08 });
}

export function playWrong(): void {
  if (muted) {
    return;
  }
  const audio = audioContext();
  if (!audio) {
    return;
  }
  tone(audio, { type: "square", from: 180, to: 120, duration: 0.12, gain: 0.04 });
}

export function playNewBest(theme: ThemeId): void {
  if (muted) {
    return;
  }
  const audio = audioContext();
  if (!audio) {
    return;
  }
  if (theme === "dinosaur") {
    tone(audio, { type: "triangle", from: 180, to: 240, duration: 0.12, gain: 0.12 });
    tone(audio, { type: "triangle", from: 240, to: 140, duration: 0.18, gain: 0.12, delay: 0.1 });
    return;
  }
  tone(audio, { type: "sine", from: 740, to: 990, duration: 0.12, gain: 0.08 });
  tone(audio, { type: "sine", from: 990, to: 1320, duration: 0.16, gain: 0.08, delay: 0.1 });
}

export function nudge(): void {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
    return;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  navigator.vibrate(12);
}
