/**
 * Pricing math. Pure functions only: no DOM access, so they can be unit
 * tested and reused by any page.
 *
 * Based on the break-even examples in Hermann Simon's "Power Pricing".
 * With variable costs v (as a % of price), each sale leaves a margin of
 * m = 100 - v. Changing the price by c points changes that margin to m + c,
 * so to earn the same total profit you must sell m / (m + c) times as many
 * units.
 */

function checkVariableCost(variableCostPct) {
  if (!(variableCostPct >= 0 && variableCostPct < 100)) {
    throw new RangeError("Variable costs must be at least 0% and below 100%.");
  }
}

/**
 * How much more you need to sell to keep the same profit after a discount.
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
  checkVariableCost(variableCostPct);
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

/**
 * How many sales you can lose and still keep the same profit after a price
 * increase.
 *
 * @param {number} variableCostPct Variable costs as a % of the current price.
 * @param {number} increasePct     Price increase in %.
 * @returns {{
 *   marginBefore: number,   // % of the original price kept per sale
 *   marginAfter: number,    // same, after the increase
 *   volumeDecrease: number, // % of units you can lose and still break even
 *   revenueChange: number,  // % change in revenue at that volume
 * }}
 */
export function priceIncreaseBreakEven(variableCostPct, increasePct) {
  checkVariableCost(variableCostPct);
  if (!(increasePct >= 0 && Number.isFinite(increasePct))) {
    throw new RangeError("Price increase must be 0% or more.");
  }

  const marginBefore = 100 - variableCostPct;
  const marginAfter = marginBefore + increasePct;
  const volumeMultiple = marginBefore / marginAfter;

  return {
    marginBefore,
    marginAfter,
    volumeDecrease: (1 - volumeMultiple) * 100,
    revenueChange: ((100 + increasePct) / 100) * volumeMultiple * 100 - 100,
  };
}
