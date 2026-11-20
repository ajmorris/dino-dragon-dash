import type { ThemeId } from "@/lib/theme";

const BESTS_KEY = "dino-dragon-dash-bests";

export type BestRecord = {
  correct: number;
  at: string;
};

export function bestKey(theme: ThemeId, maxFactor: number, seconds: number): string {
  return `${theme}-${maxFactor}-${seconds}`;
}

export function storageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const probe = "__dino_dragon_dash_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function readAll(): Record<string, BestRecord> {
  if (!storageAvailable()) {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(BESTS_KEY);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    const bests: Record<string, BestRecord> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!value || typeof value !== "object") {
        continue;
      }
      const correct = (value as { correct?: unknown }).correct;
      const at = (value as { at?: unknown }).at;
      if (typeof correct !== "number" || !Number.isFinite(correct) || correct < 0) {
        continue;
      }
      bests[key] = {
        correct: Math.floor(correct),
        at: typeof at === "string" ? at : "",
      };
    }
    return bests;
  } catch {
    return {};
  }
}

export function readBest(theme: ThemeId, maxFactor: number, seconds: number): number | null {
  const record = readAll()[bestKey(theme, maxFactor, seconds)];
  return record ? record.correct : null;
}

export function writeBest(
  theme: ThemeId,
  maxFactor: number,
  seconds: number,
  correct: number,
): { best: number; improved: boolean; blocked: boolean } {
  if (!storageAvailable()) {
    return { best: correct, improved: false, blocked: true };
  }

  const all = readAll();
  const key = bestKey(theme, maxFactor, seconds);
  const previous = all[key]?.correct;

  if (previous === undefined || correct > previous) {
    all[key] = { correct, at: new Date().toISOString() };
    try {
      window.localStorage.setItem(BESTS_KEY, JSON.stringify(all));
      return { best: correct, improved: true, blocked: false };
    } catch {
      return { best: previous ?? correct, improved: false, blocked: true };
    }
  }

  return { best: previous, improved: false, blocked: false };
}
