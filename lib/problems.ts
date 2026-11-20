export type Problem = {
  a: number;
  b: number;
  answer: number;
};

function pair(a: number, b: number): Problem {
  return { a, b, answer: a * b };
}

export function nextProblem(max: number, previous: Pick<Problem, "a" | "b"> | null): Problem {
  const span = Math.max(1, Math.floor(max));

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const a = 1 + Math.floor(Math.random() * span);
    const b = 1 + Math.floor(Math.random() * span);
    if (!previous || a !== previous.a || b !== previous.b || span === 1) {
      return pair(a, b);
    }
  }

  if (!previous) {
    return pair(1, 1);
  }

  const a = previous.a === span ? 1 : previous.a + 1;
  return pair(a, previous.b);
}
