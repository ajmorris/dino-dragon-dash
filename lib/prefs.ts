import { isMaxFactor, isRoundSeconds, type MaxFactor, type RoundSeconds } from "@/lib/settings";
import { isThemeId, type ThemeId } from "@/lib/theme";

const PREFS_KEY = "dino-dragon-dash-prefs";

export type Prefs = {
  theme: ThemeId;
  maxFactor: MaxFactor;
  seconds: RoundSeconds;
  muted: boolean;
};

function defaults(): Prefs {
  return { theme: "dinosaur", maxFactor: 10, seconds: 60, muted: false };
}

export function readPrefs(): Partial<Prefs> | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    const record = parsed as Record<string, unknown>;
    const prefs: Partial<Prefs> = {};
    if (isThemeId(record.theme)) {
      prefs.theme = record.theme;
    }
    if (isMaxFactor(record.maxFactor)) {
      prefs.maxFactor = record.maxFactor;
    }
    if (isRoundSeconds(record.seconds)) {
      prefs.seconds = record.seconds;
    }
    if (typeof record.muted === "boolean") {
      prefs.muted = record.muted;
    }
    return prefs;
  } catch {
    return null;
  }
}

export function writePrefs(prefs: Prefs): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // The round still plays when storage is blocked.
  }
}

export function emptyPrefs(): Prefs {
  return defaults();
}
