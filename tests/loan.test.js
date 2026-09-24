import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateLoan } from "../js/lib/loan.js";

const cents = (n) => Math.round(n * 100) / 100;

test("30-year loan at 6.5%", () => {
  const { monthlyPayment, totalPaid, totalInterest } = calculateLoan(300000, 6.5, 30);
  assert.equal(cents(monthlyPayment), 1896.2);
  assert.equal(cents(totalPaid - totalInterest), 300000);
});

test("0% interest splits the principal evenly", () => {
  const { monthlyPayment, totalInterest } = calculateLoan(12000, 0, 1);
  assert.equal(monthlyPayment, 1000);
  assert.equal(totalInterest, 0);
});

test("rejects invalid input", () => {
  assert.throws(() => calculateLoan(0, 5, 30), RangeError);
  assert.throws(() => calculateLoan(1000, -1, 30), RangeError);
  assert.throws(() => calculateLoan(1000, 5, 0), RangeError);
  assert.throws(() => calculateLoan(NaN, 5, 30), RangeError);
});
