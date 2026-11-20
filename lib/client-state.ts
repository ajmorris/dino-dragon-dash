import { readPrefs, writePrefs } from "@/lib/prefs";
import { storageAvailable } from "@/lib/scores";
import { setSoundMuted } from "@/lib/sound";
import type { MaxFactor, RoundSeconds } from "@/lib/settings";
import type { ThemeId } from "@/lib/theme";

export type ClientState = {
  theme: ThemeId | null;
  maxFactor: MaxFactor;
  seconds: RoundSeconds;
  muted: boolean;
  blocked: boolean;
};

let cache: ClientState | null = null;

export function readClientState(): ClientState {
  if (cache) {
    return cache;
  }
  const blocked = !storageAvailable();
  const prefs = blocked ? null : readPrefs();
  cache = {
    theme: prefs?.theme ?? null,
    maxFactor: prefs?.maxFactor ?? 10,
    seconds: prefs?.seconds ?? 60,
    muted: prefs?.muted ?? false,
    blocked,
  };
  setSoundMuted(cache.muted);
  return cache;
}

export function patchClientState(patch: Partial<ClientState>): ClientState {
  const next = { ...readClientState(), ...patch };
  cache = next;
  setSoundMuted(next.muted);
  if (next.theme && !next.blocked) {
    writePrefs({
      theme: next.theme,
      maxFactor: next.maxFactor,
      seconds: next.seconds,
      muted: next.muted,
    });
  }
  return next;
}
