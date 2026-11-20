import { MascotScene } from "@/components/game/mascot-scene";
import { MuteButton } from "@/components/game/mute-button";
import { Button } from "@/components/ui/button";
import { goalLine, startLabel } from "@/lib/copy";
import {
  maxFactors,
  roundLengths,
  type AnswerMode,
  type MaxFactor,
  type RoundSeconds,
} from "@/lib/settings";
import { themes, type ThemeId } from "@/lib/theme";

type DenScreenProps = {
  theme: ThemeId;
  maxFactor: MaxFactor;
  seconds: RoundSeconds;
  answerMode: AnswerMode;
  best: number | null;
  storageBlocked: boolean;
  muted: boolean;
  onTheme: (theme: ThemeId) => void;
  onMaxFactor: (maxFactor: MaxFactor) => void;
  onSeconds: (seconds: RoundSeconds) => void;
  onAnswerMode: (answerMode: AnswerMode) => void;
  onToggleMute: () => void;
  onStart: () => void;
};

export function DenScreen({
  theme,
  maxFactor,
  seconds,
  answerMode,
  best,
  storageBlocked,
  muted,
  onTheme,
  onMaxFactor,
  onSeconds,
  onAnswerMode,
  onToggleMute,
  onStart,
}: DenScreenProps) {
  const details = themes[theme];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 py-2 sm:gap-5 sm:py-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold tracking-wide text-[var(--ink-soft)] uppercase">
            Dino Dragon Dash
          </p>
          <h1 className="dash-title text-4xl sm:text-5xl">{details.denHeadline}</h1>
          <p className="mt-1 text-lg text-[var(--ink-soft)]">
            You are {details.player}. Scores stay on this tablet.
          </p>
        </div>
        <MuteButton muted={muted} onToggle={onToggleMute} compact />
      </div>

      <MascotScene theme={theme} className="mx-auto hidden w-40 sm:block" />

      <section className="grid gap-2">
        <h2 className="text-lg font-bold">Who are you?</h2>
        <div className="grid grid-cols-2 gap-2">
          {(["dinosaur", "dragon"] as const).map((choice) => (
            <Button
              key={choice}
              type="button"
              size="touch"
              variant={choice === theme ? "default" : "outline"}
              aria-pressed={choice === theme}
              onClick={() => onTheme(choice)}
            >
              {themes[choice].name}
            </Button>
          ))}
        </div>
      </section>

      <section className="grid gap-2">
        <h2 className="text-lg font-bold">How high?</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {maxFactors.map((factor) => (
            <Button
              key={factor}
              type="button"
              size="touch"
              variant={factor === maxFactor ? "default" : "outline"}
              aria-pressed={factor === maxFactor}
              onClick={() => onMaxFactor(factor)}
            >
              Up to {factor}
            </Button>
          ))}
        </div>
      </section>

      <section className="grid gap-2">
        <h2 className="text-lg font-bold">How long?</h2>
        <div className="grid grid-cols-3 gap-2">
          {roundLengths.map((length) => (
            <Button
              key={length}
              type="button"
              size="touch"
              variant={length === seconds ? "default" : "outline"}
              aria-pressed={length === seconds}
              onClick={() => onSeconds(length)}
            >
              {length} sec
            </Button>
          ))}
        </div>
      </section>

      <section className="grid gap-2">
        <h2 className="text-lg font-bold">How do you answer?</h2>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            size="touch"
            variant={answerMode === "pad" ? "default" : "outline"}
            aria-pressed={answerMode === "pad"}
            onClick={() => onAnswerMode("pad")}
          >
            Number pad
          </Button>
          <Button
            type="button"
            size="touch"
            variant={answerMode === "choices" ? "default" : "outline"}
            aria-pressed={answerMode === "choices"}
            onClick={() => onAnswerMode("choices")}
          >
            5 choices
          </Button>
        </div>
      </section>

      <p className="dash-card px-4 py-3 text-center text-xl font-bold text-[var(--best)]">
        {goalLine(best, seconds, storageBlocked, answerMode)}
      </p>

      <Button type="button" size="touch" className="h-20 min-h-20 text-2xl" onClick={onStart}>
        {startLabel(best)}
      </Button>
    </div>
  );
}
