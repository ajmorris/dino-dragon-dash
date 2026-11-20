"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChoicePad } from "@/components/game/choice-pad";
import { Keypad } from "@/components/game/keypad";
import { MascotScene } from "@/components/game/mascot-scene";
import { MuteButton } from "@/components/game/mute-button";
import { Button } from "@/components/ui/button";
import { choiceAnswers } from "@/lib/choices";
import { nextProblem, type Problem } from "@/lib/problems";
import { nudge, playCorrect, playNewBest, playWrong } from "@/lib/sound";
import type { AnswerMode, MaxFactor, RoundSeconds } from "@/lib/settings";
import { themes, type ThemeId } from "@/lib/theme";

type PlayScreenProps = {
  theme: ThemeId;
  maxFactor: MaxFactor;
  seconds: RoundSeconds;
  answerMode: AnswerMode;
  best: number | null;
  muted: boolean;
  onToggleMute: () => void;
  onFinish: (result: { correct: number; tries: number }) => void;
};

function dealProblem(maxFactor: number, previous: Problem | null, answerMode: AnswerMode) {
  const problem = nextProblem(maxFactor, previous);
  return {
    problem,
    options: answerMode === "choices" ? choiceAnswers(problem) : [],
  };
}

export function PlayScreen({
  theme,
  maxFactor,
  seconds,
  answerMode,
  best,
  muted,
  onToggleMute,
  onFinish,
}: PlayScreenProps) {
  const [remainingMs, setRemainingMs] = useState(seconds * 1000);
  const [deal, setDeal] = useState(() => dealProblem(maxFactor, null, answerMode));
  const [wrong, setWrong] = useState<number[]>([]);
  const [entry, setEntry] = useState("");
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [popKey, setPopKey] = useState(0);
  const [feedback, setFeedback] = useState(
    answerMode === "choices" ? "Tap the right answer." : "Type the answer, then tap Go.",
  );
  const problem = deal.problem;
  const options = deal.options;
  const [newBestOn, setNewBestOn] = useState(false);
  const endRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const correctRef = useRef(0);
  const triesRef = useRef(0);
  const bestRef = useRef(best);
  const entryRef = useRef("");
  const problemRef = useRef(problem);
  const optionsRef = useRef(options);
  const wrongRef = useRef<number[]>([]);

  useEffect(() => {
    bestRef.current = best;
  }, [best]);

  useEffect(() => {
    entryRef.current = entry;
  }, [entry]);

  useEffect(() => {
    problemRef.current = problem;
    optionsRef.current = options;
  }, [options, problem]);

  const advance = useCallback(
    (previous: Problem) => {
      wrongRef.current = [];
      setWrong([]);
      setEntry("");
      setDeal(dealProblem(maxFactor, previous, answerMode));
    },
    [answerMode, maxFactor],
  );

  const markCorrect = useCallback(
    (currentProblem: Problem) => {
      const previousScore = correctRef.current;
      const next = previousScore + 1;
      correctRef.current = next;
      setCorrect(next);
      setStreak((count) => count + 1);
      const target = bestRef.current;
      if (target !== null && previousScore <= target && next > target) {
        setNewBestOn(true);
        playNewBest(theme);
      } else {
        playCorrect(theme);
      }
      nudge();
      setFeedback(`${themes[theme].cheer} That's right.`);
      setPopKey((key) => key + 1);
      setShaking(false);
      advance(currentProblem);
    },
    [advance, theme],
  );

  const finish = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    onFinish({ correct: correctRef.current, tries: triesRef.current });
  }, [onFinish]);

  useEffect(() => {
    if (endRef.current === null) {
      endRef.current = Date.now() + seconds * 1000;
    }
    let frame = 0;
    const tick = () => {
      const left = Math.max(0, (endRef.current ?? Date.now()) - Date.now());
      setRemainingMs(left);
      if (left <= 0) {
        finish();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [finish, seconds]);

  useEffect(() => {
    if (!newBestOn) {
      return;
    }
    const timeout = window.setTimeout(() => setNewBestOn(false), 1200);
    return () => window.clearTimeout(timeout);
  }, [newBestOn]);

  const pushDigit = useCallback((digit: string) => {
    if (finishedRef.current) {
      return;
    }
    setEntry((current) => {
      if (current === "0") {
        return digit;
      }
      if (current.length >= 3) {
        return current;
      }
      return current + digit;
    });
  }, []);

  const clearEntry = useCallback(() => {
    setEntry("");
  }, []);

  const submit = useCallback(() => {
    if (finishedRef.current || (endRef.current ?? 0) <= Date.now()) {
      return;
    }
    const currentEntry = entryRef.current;
    if (currentEntry === "") {
      return;
    }
    const value = Number(currentEntry);
    triesRef.current += 1;
    const currentProblem = problemRef.current;

    if (value === currentProblem.answer) {
      markCorrect(currentProblem);
      return;
    }

    setStreak(0);
    setShaking(true);
    setShakeKey((key) => key + 1);
    setFeedback("Not quite — try again.");
    playWrong();
  }, [markCorrect]);

  const choose = useCallback(
    (value: number) => {
      if (finishedRef.current || (endRef.current ?? 0) <= Date.now()) {
        return;
      }
      if (wrongRef.current.includes(value)) {
        return;
      }
      const currentProblem = problemRef.current;
      triesRef.current += 1;
      if (value === currentProblem.answer) {
        markCorrect(currentProblem);
        return;
      }
      wrongRef.current = [...wrongRef.current, value];
      setWrong(wrongRef.current);
      setStreak(0);
      setShaking(true);
      setShakeKey((key) => key + 1);
      setFeedback("Not quite — try another.");
      playWrong();
    },
    [markCorrect],
  );

  const skip = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    triesRef.current += 1;
    setStreak(0);
    setFeedback("Skipped.");
    setShaking(false);
    advance(problemRef.current);
  }, [advance]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      if (answerMode === "choices") {
        if (/^[1-5]$/.test(event.key)) {
          event.preventDefault();
          const picked = optionsRef.current[Number(event.key) - 1];
          if (picked !== undefined) {
            choose(picked);
          }
        }
        return;
      }
      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        pushDigit(event.key);
        return;
      }
      if (event.key === "Backspace") {
        event.preventDefault();
        setEntry((current) => current.slice(0, -1));
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        submit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answerMode, choose, pushDigit, submit]);

  const secondsLeft = Math.ceil(remainingMs / 1000);
  const totalMs = seconds * 1000;
  const timeRatio = Math.max(0, Math.min(1, remainingMs / totalMs));
  const bestRatio =
    best === null ? 0 : best <= 0 ? (correct > 0 ? 1 : 0) : Math.min(1, correct / best);
  const scoreLabel = best === null ? `${correct} this round` : `${correct} / best ${best}`;
  const lowTime = secondsLeft <= 10;

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-3 py-3">
      <header className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <p className="dash-title text-3xl tabular-nums" role="timer" aria-label={`${secondsLeft} seconds left`}>
            {secondsLeft}s
          </p>
          <p className="text-center text-lg font-bold">
            {newBestOn ? "New best!" : scoreLabel}
          </p>
          <MuteButton muted={muted} onToggle={onToggleMute} compact />
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/70" aria-hidden="true">
          <div
            className="h-full rounded-full"
            style={{
              width: `${timeRatio * 100}%`,
              background: lowTime ? "var(--best)" : "var(--primary)",
            }}
          />
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/70" aria-hidden="true">
          <div
            className="h-full rounded-full"
            style={{ width: `${bestRatio * 100}%`, background: "var(--best)" }}
          />
        </div>
      </header>

      <div className="play-layout flex min-h-0 flex-1 flex-col gap-3">
        <section className="play-stage flex flex-col items-center justify-center gap-2">
          <MascotScene
            theme={theme}
            pals={correct}
            celebrate={newBestOn}
            className="play-mascot mx-auto w-28 sm:w-36"
          />
          <div
            key={shaking ? shakeKey : popKey}
            className={`dash-card w-full max-w-xl px-4 py-3 text-center ${shaking ? "dash-shake" : ""} ${popKey > 0 && !shaking ? "dash-pop" : ""}`}
          >
            <p className="play-problem dash-title text-5xl whitespace-nowrap sm:text-7xl">
              {problem.a} × {problem.b}
            </p>
            {answerMode === "pad" ? (
              <p className="mt-2 min-h-10 text-3xl font-bold tabular-nums" aria-label="Your answer">
                {entry === "" ? "—" : entry}
              </p>
            ) : null}
            <p className="min-h-6 text-base font-bold text-[var(--ink-soft)]">
              {streak >= 2 ? `${streak} in a row` : ""}
            </p>
          </div>
        </section>

        <section className="play-keys flex w-full flex-col gap-2">
          {answerMode === "choices" ? (
            <ChoicePad options={options} wrong={wrong} onChoose={choose} />
          ) : (
            <Keypad onDigit={pushDigit} onClear={clearEntry} onGo={submit} canGo={entry !== ""} />
          )}
          <Button type="button" variant="outline" size="touch" onClick={skip}>
            Skip
          </Button>
        </section>
      </div>

      <p className="sr-only" aria-live="polite">
        {feedback}
      </p>
    </div>
  );
}
