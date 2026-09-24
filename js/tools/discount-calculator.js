/**
 * Wires the discount calculator on tools/discount-calculator.html to the
 * pricing math in js/lib/pricing.js and draws the break-even curve.
 */
import { discountBreakEven } from "../lib/pricing.js";
import { formatPercent } from "../lib/format.js";
import { createLineChart, niceStep } from "../lib/line-chart.js";

const TABLE_DISCOUNTS = [5, 10, 15, 20, 25, 30];

const form = document.getElementById("discount-form");
const results = document.getElementById("discount-results");
const error = document.getElementById("discount-error");
const headline = document.getElementById("discount-headline");
const summary = document.getElementById("discount-summary");
const marginBefore = document.getElementById("discount-margin-before");
const marginAfter = document.getElementById("discount-margin-after");
const revenueChange = document.getElementById("discount-revenue");
const tableBody = document.getElementById("discount-table-body");
const tableCaption = document.getElementById("discount-table-caption");
const chart = createLineChart(document.getElementById("discount-chart"));

/** Required % volume increase, or null where the discount isn't possible. */
function volumeIncreaseOrNull(variableCost, discount) {
  try {
    return discountBreakEven(variableCost, discount).volumeIncrease;
  } catch {
    return null;
  }
}

function renderTable(variableCost) {
  tableCaption.textContent = `More units needed at ${formatPercent(variableCost)} variable costs`;
  tableBody.replaceChildren(
    ...TABLE_DISCOUNTS.map((discount) => {
      const row = document.createElement("tr");
      const increase = volumeIncreaseOrNull(variableCost, discount);
      row.innerHTML = "<td></td><td></td>";
      row.cells[0].textContent = formatPercent(discount);
      row.cells[1].textContent = increase == null ? "Not possible" : formatPercent(increase, { sign: true });
      return row;
    }),
  );
}

function renderChart(variableCost, discount, increase) {
  const margin = 100 - variableCost;
  const shown = Number.isFinite(discount) ? Math.min(Math.max(discount, 0), 99) : 0;
  // Show discounts up to 50%, or further if the user entered more, but never
  // past the margin, where the curve shoots off to infinity.
  const xMax = Math.min(margin, Math.max(50, Math.ceil((shown * 1.25) / 10) * 10));
  const yMax = niceStep(Math.max(100, (increase ?? 0) * 1.5) / 4) * 4;

  chart.update({
    fn: (x) => volumeIncreaseOrNull(variableCost, x),
    xMax,
    yMax,
    xLabel: "Discount",
    yLabel: "More units needed",
    formatX: (x) => formatPercent(x, { decimals: 0 }),
    formatY: (y) => formatPercent(y, { decimals: 0 }),
    marker: increase == null ? null : discount,
    tooltip: (x, y) =>
      y == null
        ? `${formatPercent(x)} off: not possible`
        : `${formatPercent(x)} off: ${formatPercent(y, { sign: true, decimals: 0 })} units`,
    description:
      `Line chart of the extra units you need to sell to break even, for discounts ` +
      `from 0% to ${formatPercent(xMax, { decimals: 0 })}, at ${formatPercent(variableCost)} variable costs.`,
  });
}

function update() {
  const data = new FormData(form);
  const variableCost = Number(data.get("variableCost"));
  const discount = Number(data.get("discount"));

  let result = null;
  try {
    result = discountBreakEven(variableCost, discount);
  } catch (err) {
    error.textContent = err.message;
  }

  error.hidden = result != null;
  results.hidden = result == null;

  if (result) {
    headline.textContent = formatPercent(result.volumeIncrease, { sign: true, decimals: 0 });
    summary.textContent =
      `more units sold to earn the same profit after a ${formatPercent(discount)} discount.`;
    marginBefore.textContent = formatPercent(result.marginBefore);
    marginAfter.textContent = formatPercent(result.marginAfter);
    revenueChange.textContent = formatPercent(result.revenueChange, { sign: true });
  }

  const validCost = variableCost >= 0 && variableCost < 100;
  document.getElementById("discount-visuals").hidden = !validCost;
  if (validCost) {
    renderChart(variableCost, discount, result?.volumeIncrease ?? null);
    renderTable(variableCost);
  }
}

form.addEventListener("input", update);
form.addEventListener("submit", (event) => event.preventDefault());
update();
