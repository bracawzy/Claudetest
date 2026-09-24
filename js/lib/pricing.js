/**
 * Pricing math. Pure functions only: no DOM access, so they can be unit
 * tested and reused by any page.
 */

/**
 * How much more you need to sell to keep the same profit after a discount.
 * Based on the break-even example in Hermann Simon's "Power Pricing".
 *
 * With variable costs v (as a % of price), each sale leaves a margin of
 * m = 100 - v. A discount d cuts that margin to m - d, so to earn the same
 * total you must sell m / (m - d) times as many units.
 *
 * @param {number} variableCostPct Variable costs as a % of the current price.
 * @param {number} discountPct     Price discount in %.
 * @returns {{
 *   marginBefore: number,   // % of the original price kept per sale
 *   marginAfter: number,    // same, after the discount
 *   volumeIncrease: number, // % more units needed to break even
 *   revenueChange: number,  // % change in revenue at that volume
 * }}
 */
export function discountBreakEven(variableCostPct, discountPct) {
  if (!(variableCostPct >= 0 && variableCostPct < 100)) {
    throw new RangeError("Variable costs must be at least 0% and below 100%.");
  }
  if (!(discountPct >= 0 && discountPct < 100)) {
    throw new RangeError("Discount must be at least 0% and below 100%.");
  }

  const marginBefore = 100 - variableCostPct;
  const marginAfter = marginBefore - discountPct;

  if (marginAfter <= 0) {
    throw new RangeError(
      `A ${discountPct}% discount wipes out your ${marginBefore}% margin, ` +
        "so every sale loses money. No increase in sales can make up for it.",
    );
  }

  const volumeMultiple = marginBefore / marginAfter;

  return {
    marginBefore,
    marginAfter,
    volumeIncrease: (volumeMultiple - 1) * 100,
    revenueChange: ((100 - discountPct) / 100) * volumeMultiple * 100 - 100,
  };
}
