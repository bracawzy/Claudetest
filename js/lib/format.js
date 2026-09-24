/** Shared number formatting helpers. */

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(value) {
  return currencyFormatter.format(value);
}

/**
 * Format a number that is already in percent (e.g. 12.5 -> "12.5%").
 * Pass { sign: true } to always show + or -.
 */
export function formatPercent(value, { sign = false, decimals = 1 } = {}) {
  const rounded = Number(value.toFixed(decimals));
  const text = `${rounded.toLocaleString("en-US", { maximumFractionDigits: decimals })}%`;
  if (rounded < 0) return `\u2212${text.slice(1)}`; // true minus sign
  return sign && rounded > 0 ? `+${text}` : text;
}
