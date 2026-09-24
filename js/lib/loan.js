/**
 * Loan math. Pure functions only: no DOM access, so they can be unit tested
 * and reused by any page.
 */

/**
 * Monthly payment for a fixed-rate, fully amortizing loan.
 *
 * @param {number} principal  Amount borrowed, > 0.
 * @param {number} annualRate Yearly interest rate as a percent, e.g. 6.5.
 * @param {number} years      Loan term in years, > 0.
 * @returns {{monthlyPayment: number, totalPaid: number, totalInterest: number}}
 */
export function calculateLoan(principal, annualRate, years) {
  if (!(principal > 0)) throw new RangeError("Loan amount must be greater than 0.");
  if (!(annualRate >= 0)) throw new RangeError("Interest rate can't be negative.");
  if (!(years > 0)) throw new RangeError("Term must be greater than 0 years.");

  const months = Math.round(years * 12);
  const monthlyRate = annualRate / 100 / 12;

  const monthlyPayment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months);

  const totalPaid = monthlyPayment * months;

  return {
    monthlyPayment,
    totalPaid,
    totalInterest: totalPaid - principal,
  };
}
