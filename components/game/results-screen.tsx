import { MascotScene } from "@/components/game/mascot-scene";
import { Button } from "@/components/ui/button";
import { accuracyLine, resultCopy } from "@/lib/copy";
import { themes, type ThemeId } from "@/lib/theme";

type ResultsScreenProps = {
  theme: ThemeId;
  seconds: number;
  correct: number;
  tries: number;
  previousBest: number | null;
  onAgain: () => void;
  onDen: () => void;
};

export function ResultsScreen({
  theme,
  seconds,
  correct,
  tries,
  previousBest,
  onAgain,
  onDen,
}: ResultsScreenProps) {
  const copy = resultCopy(correct, seconds, previousBest);
  const details = themes[theme];
  const celebrating = copy.kind === "new" || copy.kind === "first";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 py-6 text-center">
      <p className="text-sm font-bold tracking-wide text-[var(--ink-soft)] uppercase">
        {details.name} score
      </p>
      <MascotScene
        theme={theme}
        pals={correct}
        celebrate={celebrating}
        className="mx-auto w-36"
      />
      <div className="dash-card w-full px-5 py-5">
        <h1 className="dash-title text-4xl leading-tight">{copy.headline}</h1>
        <p className="mt-3 text-2xl font-bold text-[var(--best)]">{copy.detail}</p>
        <p className="mt-2 text-lg text-[var(--ink-soft)]">{accuracyLine(correct, tries)}</p>
      </div>
      <Button type="button" size="touch" className="h-20 min-h-20 w-full text-2xl" onClick={onAgain}>
        {copy.button}
      </Button>
      <Button type="button" variant="outline" size="touch" className="w-full" onClick={onDen}>
        Change settings
      </Button>
    </div>
  );
}
