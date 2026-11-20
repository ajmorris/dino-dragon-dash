import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { choiceAnswers } from "./choices.ts";
import { bestKey } from "./scores.ts";

describe("choiceAnswers", () => {
  it("offers the product once among four nearby wrong answers", () => {
    const options = choiceAnswers({ a: 6, b: 7, answer: 42 }, () => 0);
    assert.equal(options.length, 5);
    assert.equal(new Set(options).size, 5);
    assert.ok(options.includes(42));
    assert.deepEqual(new Set(options), new Set([42, 48, 49, 36, 35]));
    for (const value of options) {
      assert.ok(Number.isInteger(value) && value > 0);
    }
  });

  it("still fills five choices when the fact is 1 × 1", () => {
    const options = choiceAnswers({ a: 1, b: 1, answer: 1 }, () => 0.5);
    assert.equal(options.length, 5);
    assert.equal(options.filter((value) => value === 1).length, 1);
    assert.ok(options.every((value) => value > 0));
  });

  it("keeps 20 × 20 choices distinct and positive", () => {
    const options = choiceAnswers({ a: 20, b: 20, answer: 400 }, () => 0.2);
    assert.equal(new Set(options).size, 5);
    assert.ok(options.includes(400));
    assert.ok(options.every((value) => value > 0 && value <= 420));
  });
});

describe("bestKey", () => {
  it("keeps typed scores on the original key and separates 5-choice scores", () => {
    assert.equal(bestKey("dinosaur", 10, 60, "pad"), "dinosaur-10-60");
    assert.equal(bestKey("dragon", 12, 30, "choices"), "dragon-12-30-choices");
  });
});
