export const maxFactors = [5, 10, 12, 20] as const;
export const roundLengths = [30, 60, 90] as const;
export const answerModes = ["pad", "choices"] as const;

export type MaxFactor = (typeof maxFactors)[number];
export type RoundSeconds = (typeof roundLengths)[number];
export type AnswerMode = (typeof answerModes)[number];

export function isMaxFactor(value: unknown): value is MaxFactor {
  return typeof value === "number" && maxFactors.some((factor) => factor === value);
}

export function isRoundSeconds(value: unknown): value is RoundSeconds {
  return typeof value === "number" && roundLengths.some((length) => length === value);
}

export function isAnswerMode(value: unknown): value is AnswerMode {
  return value === "pad" || value === "choices";
}
