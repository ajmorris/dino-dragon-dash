export type ResultKind = "first" | "new" | "tie" | "short";

export type ResultCopy = {
  headline: string;
  detail: string;
  button: string;
  nextTarget: number;
  kind: ResultKind;
};

export function nextBest(
  previous: number | null,
  correct: number,
): { best: number; improved: boolean } {
  if (previous === null || correct > previous) {
    return { best: correct, improved: true };
  }
  return { best: previous, improved: false };
}

export function startLabel(best: number | null): string {
  return best === null ? "Set a score" : `Beat ${best}`;
}

export function goalLine(
  best: number | null,
  seconds: number,
  storageBlocked: boolean,
): string {
  if (storageBlocked) {
    return "Scores will not be remembered on this device.";
  }
  if (best === null) {
    return "No score yet — set one to beat.";
  }
  return `Best: ${best} correct in ${seconds} seconds.`;
}

function moreNextTime(gap: number): string {
  if (gap === 1) {
    return "One more next time.";
  }
  if (gap === 2) {
    return "Two more next time.";
  }
  return `${gap} more next time.`;
}

export function resultCopy(
  correct: number,
  seconds: number,
  previousBest: number | null,
): ResultCopy {
  const headline = `You got ${correct} correct in ${seconds} seconds.`;

  if (previousBest === null) {
    return {
      headline,
      detail:
        correct > 0
          ? "New best — that's the score to beat."
          : "New best — zero is the score to beat.",
      button: `Try to beat ${correct}`,
      nextTarget: correct,
      kind: "first",
    };
  }

  if (correct > previousBest) {
    return {
      headline,
      detail: `New best — you beat ${previousBest}.`,
      button: `Try to beat ${correct}`,
      nextTarget: correct,
      kind: "new",
    };
  }

  if (correct === previousBest) {
    return {
      headline,
      detail: `Tied your best of ${previousBest}.`,
      button: `Try to beat ${previousBest}`,
      nextTarget: previousBest,
      kind: "tie",
    };
  }

  return {
    headline,
    detail: `Best is still ${previousBest}. ${moreNextTime(previousBest - correct)}`,
    button: `Try to beat ${previousBest}`,
    nextTarget: previousBest,
    kind: "short",
  };
}

export function accuracyLine(correct: number, tries: number): string {
  if (tries === 0) {
    return "Time ran out before an answer.";
  }
  const percent = Math.round((correct / tries) * 100);
  const tryWord = tries === 1 ? "try" : "tries";
  return `${tries} ${tryWord} · ${percent}% right`;
}
