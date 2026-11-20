"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { DenScreen } from "@/components/game/den-screen";
import { PlayScreen } from "@/components/game/play-screen";
import { ResultsScreen } from "@/components/game/results-screen";
import { ThemePicker } from "@/components/game/theme-picker";
import { patchClientState, readClientState } from "@/lib/client-state";
import { readBest, writeBest } from "@/lib/scores";
import { unlockSound } from "@/lib/sound";
import type { AnswerMode, MaxFactor, RoundSeconds } from "@/lib/settings";
import type { ThemeId } from "@/lib/theme";

type Screen = "pick" | "den" | "play" | "results";

type RoundResult = {
  correct: number;
  tries: number;
  previousBest: number | null;
};

function subscribeHydration(): () => void {
  return () => {};
}

function useHydrated(): boolean {
  return useSyncExternalStore(subscribeHydration, () => true, () => false);
}

export function GameApp() {
  const hydrated = useHydrated();
  const [revision, setRevision] = useState(0);
  const [screen, setScreen] = useState<Screen | null>(null);
  const [round, setRound] = useState<RoundResult | null>(null);
  const [playId, setPlayId] = useState(0);

  const client = hydrated ? readClientState() : null;
  const activeScreen: Screen = screen ?? (client?.theme ? "den" : "pick");
  const theme = client?.theme ?? null;
  const best =
    client?.theme && !client.blocked
      ? readBest(client.theme, client.maxFactor, client.seconds, client.answerMode)
      : null;

  function refresh() {
    setRevision((value) => value + 1);
  }

  const finishRound = useCallback((result: { correct: number; tries: number }) => {
    const current = readClientState();
    const previousBest =
      current?.theme && !current.blocked
        ? readBest(current.theme, current.maxFactor, current.seconds, current.answerMode)
        : null;
    if (current?.theme && !current.blocked) {
      const saved = writeBest(
        current.theme,
        current.maxFactor,
        current.seconds,
        current.answerMode,
        result.correct,
      );
      if (saved.blocked) {
        patchClientState({ blocked: true });
      }
    }
    setRound({ ...result, previousBest });
    setScreen("results");
  }, []);

  function startRound() {
    setPlayId((id) => id + 1);
    setScreen("play");
  }

  function chooseTheme(nextTheme: ThemeId) {
    patchClientState({ theme: nextTheme });
    refresh();
    setScreen("den");
  }

  function changeMax(maxFactor: MaxFactor) {
    patchClientState({ maxFactor });
    refresh();
  }

  function changeSeconds(seconds: RoundSeconds) {
    patchClientState({ seconds });
    refresh();
  }

  function changeAnswerMode(answerMode: AnswerMode) {
    patchClientState({ answerMode });
    refresh();
  }

  function toggleMuted() {
    const muted = !readClientState().muted;
    patchClientState({ muted });
    refresh();
    if (!muted) {
      unlockSound();
    }
  }

  const shellTheme = theme ?? "trail";

  return (
    <main className="dash-shell" data-theme={shellTheme} data-revision={revision}>
      {!client ? (
        <div className="flex flex-1 items-center justify-center">
          <h1 className="dash-title text-5xl">Dino Dragon Dash</h1>
        </div>
      ) : (
        <div
          className={
            activeScreen === "play" ? "flex min-h-0 flex-1 flex-col overflow-y-auto" : "flex-1 overflow-y-auto"
          }
        >
          {activeScreen === "pick" ? <ThemePicker onChoose={chooseTheme} /> : null}
          {activeScreen === "den" && theme ? (
            <DenScreen
              theme={theme}
              maxFactor={client.maxFactor}
              seconds={client.seconds}
              answerMode={client.answerMode}
              best={best}
              storageBlocked={client.blocked}
              muted={client.muted}
              onTheme={chooseTheme}
              onMaxFactor={changeMax}
              onSeconds={changeSeconds}
              onAnswerMode={changeAnswerMode}
              onToggleMute={toggleMuted}
              onStart={startRound}
            />
          ) : null}
          {activeScreen === "play" && theme ? (
            <PlayScreen
              key={playId}
              theme={theme}
              maxFactor={client.maxFactor}
              seconds={client.seconds}
              answerMode={client.answerMode}
              best={best}
              muted={client.muted}
              onToggleMute={toggleMuted}
              onFinish={finishRound}
            />
          ) : null}
          {activeScreen === "results" && theme && round ? (
            <ResultsScreen
              theme={theme}
              seconds={client.seconds}
              correct={round.correct}
              tries={round.tries}
              previousBest={round.previousBest}
              onAgain={startRound}
              onDen={() => setScreen("den")}
            />
          ) : null}
        </div>
      )}
    </main>
  );
}
