import type { Problem } from "@/lib/problems";

export function choiceAnswers(problem: Problem, random: () => number = Math.random): number[] {
  const { a, b, answer } = problem;
  const pool = [
    a * (b + 1),
    (a + 1) * b,
    b > 1 ? a * (b - 1) : 0,
    a > 1 ? (a - 1) * b : 0,
    a + b,
    answer + a,
    answer + b,
    answer - a,
    answer - b,
    answer + 1,
    answer - 1,
    answer + 2,
    answer + 10,
    answer + a + b,
  ];

  const wrong: number[] = [];
  for (const value of pool) {
    if (!Number.isInteger(value) || value <= 0 || value === answer || wrong.includes(value)) {
      continue;
    }
    wrong.push(value);
    if (wrong.length === 4) {
      break;
    }
  }

  let extra = 1;
  while (wrong.length < 4 && extra < 30) {
    const value = answer + extra;
    extra += 1;
    if (!wrong.includes(value)) {
      wrong.push(value);
    }
  }

  const options = [answer, ...wrong];
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    const current = options[index];
    options[index] = options[swap] ?? current;
    options[swap] = current;
  }
  return options;
}
