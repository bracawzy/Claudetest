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
  return sign && rounded > 0 ? `+${text}` : text;
}
