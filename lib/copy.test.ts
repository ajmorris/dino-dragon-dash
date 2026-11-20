import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { accuracyLine, goalLine, nextBest, resultCopy, startLabel } from "./copy.ts";
import { nextProblem } from "./problems.ts";

describe("nextBest", () => {
  it("stores the first score, including zero", () => {
    assert.deepEqual(nextBest(null, 0), { best: 0, improved: true });
  });

  it("replaces a best only when the new count is higher", () => {
    assert.deepEqual(nextBest(14, 16), { best: 16, improved: true });
    assert.deepEqual(nextBest(16, 16), { best: 16, improved: false });
    assert.deepEqual(nextBest(18, 12), { best: 18, improved: false });
  });
});

describe("goal and start copy", () => {
  it("names the timed best the child is chasing", () => {
    assert.equal(goalLine(null, 60, false), "No score yet — set one to beat.");
    assert.equal(goalLine(14, 60, false), "Best: 14 correct in 60 seconds.");
    assert.equal(goalLine(null, 60, false, "choices"), "No score yet for 5 choices — set one to beat.");
    assert.equal(goalLine(9, 30, false, "choices"), "Best with 5 choices: 9 correct in 30 seconds.");
    assert.equal(startLabel(null), "Set a score");
    assert.equal(startLabel(14), "Beat 14");
  });

  it("explains when the device will not remember a score", () => {
    assert.match(goalLine(14, 60, true), /not be remembered/);
  });
});

describe("resultCopy", () => {
  it("states the correct count in the time they played", () => {
    const first = resultCopy(16, 60, null);
    assert.equal(first.headline, "You got 16 correct in 60 seconds.");
    assert.equal(first.kind, "first");
    assert.equal(first.button, "Try to beat 16");

    const beat = resultCopy(16, 60, 14);
    assert.equal(beat.detail, "New best — you beat 14.");
    assert.equal(beat.button, "Try to beat 16");

    const tied = resultCopy(16, 60, 16);
    assert.equal(tied.detail, "Tied your best of 16.");
    assert.equal(tied.button, "Try to beat 16");

    const short = resultCopy(16, 60, 18);
    assert.equal(short.detail, "Best is still 18. Two more next time.");
    assert.equal(short.button, "Try to beat 18");
    assert.equal(resultCopy(17, 60, 18).detail, "Best is still 18. One more next time.");
  });
});

describe("accuracyLine", () => {
  it("hides a percent when nothing was answered", () => {
    assert.match(accuracyLine(0, 0), /before an answer/);
    assert.equal(accuracyLine(8, 10), "10 tries · 80% right");
  });
});

describe("nextProblem", () => {
  it("stays inside the chosen max and does not repeat the last pair", () => {
    const previous = { a: 2, b: 3 };
    for (let index = 0; index < 40; index += 1) {
      const problem = nextProblem(20, previous);
      assert.ok(problem.a >= 1 && problem.a <= 20);
      assert.ok(problem.b >= 1 && problem.b <= 20);
      assert.equal(problem.answer, problem.a * problem.b);
      assert.ok(problem.a !== previous.a || problem.b !== previous.b);
    }
  });
});
