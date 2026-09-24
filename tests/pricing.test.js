import { test } from "node:test";
import assert from "node:assert/strict";
import { discountBreakEven } from "../js/lib/pricing.js";

const round = (n) => Math.round(n * 100) / 100;

test("Power Pricing example: 60% variable costs, 20% discount needs 100% more units", () => {
  const r = discountBreakEven(60, 20);
  assert.equal(r.marginBefore, 40);
  assert.equal(r.marginAfter, 20);
  assert.equal(round(r.volumeIncrease), 100);
  assert.equal(round(r.revenueChange), 60);
});

test("no discount needs no extra sales", () => {
  const r = discountBreakEven(60, 0);
  assert.equal(r.volumeIncrease, 0);
  assert.equal(r.revenueChange, 0);
});

test("low variable costs make discounts cheaper", () => {
  assert.equal(round(discountBreakEven(20, 10).volumeIncrease), 14.29);
});

test("discount equal to or above the margin is impossible", () => {
  assert.throws(() => discountBreakEven(60, 40), RangeError);
  assert.throws(() => discountBreakEven(60, 50), RangeError);
});

test("rejects out-of-range input", () => {
  assert.throws(() => discountBreakEven(100, 10), RangeError);
  assert.throws(() => discountBreakEven(-1, 10), RangeError);
  assert.throws(() => discountBreakEven(50, -5), RangeError);
  assert.throws(() => discountBreakEven(NaN, 10), RangeError);
});
