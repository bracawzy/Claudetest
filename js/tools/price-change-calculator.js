/**
 * Wires the price change calculator on tools/price-change-calculator.html to
 * the pricing math in js/lib/pricing.js and draws the break-even curve.
 */
import { discountBreakEven, priceIncreaseBreakEven } from "../lib/pricing.js";
import { formatPercent } from "../lib/format.js";
import { createLineChart, niceStep } from "../lib/line-chart.js";

const TABLE_CHANGES = [5, 10, 15, 20, 25, 30];

/** Everything that differs between the two modes. */
const MODES = {
  discount: {
    // Units needed, in %, or null where no amount of sales can break even.
    volume(variableCost, change) {
      try {
        return discountBreakEven(variableCost, change).volumeIncrease;
      } catch {
        return null;
      }
    },
    calculate: (variableCost, change) => {
      const r = discountBreakEven(variableCost, change);
      return { ...r, volume: r.volumeIncrease };
    },
    changeLabel: "Discount (%)",
    headline: (volume) => formatPercent(volume, { sign: true, decimals: 0 }),
    summary: (change) => `more units sold to earn the same profit after a ${formatPercent(change)} discount.`,
    chartTitle: "More units needed at each discount",
    xLabel: "Discount",
    yLabel: "More units needed",
    tableHeading: "More units needed",
    tableCaption: (variableCost) => `More units needed at ${formatPercent(variableCost)} variable costs`,
    formatVolume: (volume) => formatPercent(volume, { sign: true }),
    tooltip: (x, y) =>
      y == null
        ? `${formatPercent(x)} off: not possible`
        : `${formatPercent(x)} off: ${formatPercent(y, { sign: true, decimals: 0 })} units`,
    // Show discounts up to 50% (further if entered), but never past the
    // margin, where the curve shoots off to infinity.
    xMax: (margin, change) => Math.min(margin, Math.max(50, Math.ceil((change * 1.25) / 10) * 10)),
    yMax: (volume) => niceStep(Math.max(100, (volume ?? 0) * 1.5) / 4) * 4,
  },

  increase: {
    volume(variableCost, change) {
      try {
        return priceIncreaseBreakEven(variableCost, change).volumeDecrease;
      } catch {
        return null;
      }
    },
    calculate: (variableCost, change) => {
      const r = priceIncreaseBreakEven(variableCost, change);
      return { ...r, volume: r.volumeDecrease };
    },
    changeLabel: "Price increase (%)",
    headline: (volume) => formatPercent(volume, { decimals: 0 }),
    summary: (change) =>
      `fewer units, and you still earn the same profit after a ${formatPercent(change)} price increase.`,
    chartTitle: "Sales you can lose at each price increase",
    xLabel: "Price increase",
    yLabel: "Units you can lose",
    tableHeading: "Units you can lose",
    tableCaption: (variableCost) => `Units you can lose at ${formatPercent(variableCost)} variable costs`,
    formatVolume: (volume) => formatPercent(volume),
    tooltip: (x, y) => `${formatPercent(x)} up: can lose ${formatPercent(y, { decimals: 0 })}`,
    xMax: (margin, change) => Math.max(50, Math.ceil((change * 1.25) / 10) * 10),
    yMax: (_volume, fnAtXMax) => niceStep(Math.max(10, fnAtXMax) / 4) * 4,
  },
};

const form = document.getElementById("price-form");
const changeInput = document.getElementById("price-change");
const changeSlider = document.getElementById("price-change-slider");
const changeLabel = document.getElementById("price-change-label");
const results = document.getElementById("price-results");
const error = document.getElementById("price-error");
const visuals = document.getElementById("price-visuals");
const headline = document.getElementById("price-headline");
const summary = document.getElementById("price-summary");
const marginBefore = document.getElementById("price-margin-before");
const marginAfter = document.getElementById("price-margin-after");
const revenueChange = document.getElementById("price-revenue");
const chartTitle = document.getElementById("price-chart-title");
const tableHeading = document.getElementById("price-table-heading");
const tableCaption = document.getElementById("price-table-caption");
const tableBody = document.getElementById("price-table-body");
const chart = createLineChart(document.getElementById("price-chart"));

function renderResults(mode, variableCost, change) {
  let result = null;
  try {
    result = mode.calculate(variableCost, change);
  } catch (err) {
    error.textContent = err.message;
  }

  error.hidden = result != null;
  results.hidden = result == null;
  if (!result) return null;

  headline.textContent = mode.headline(result.volume);
  summary.textContent = mode.summary(change);
  marginBefore.textContent = formatPercent(result.marginBefore);
  marginAfter.textContent = formatPercent(result.marginAfter);
  revenueChange.textContent = formatPercent(result.revenueChange, { sign: true });
  return result;
}

function renderChart(mode, variableCost, change, volume) {
  const shown = Number.isFinite(change) ? Math.min(Math.max(change, 0), 99) : 0;
  const xMax = mode.xMax(100 - variableCost, shown);
  const fn = (x) => mode.volume(variableCost, x);

  chartTitle.textContent = mode.chartTitle;
  chart.update({
    fn,
    xMax,
    yMax: mode.yMax(volume, fn(xMax) ?? 0),
    xLabel: mode.xLabel,
    yLabel: mode.yLabel,
    formatX: (x) => formatPercent(x, { decimals: 0 }),
    formatY: (y) => formatPercent(y, { decimals: 0 }),
    marker: volume == null ? null : change,
    tooltip: mode.tooltip,
    description:
      `Line chart of ${mode.yLabel.toLowerCase()} to earn the same profit, for a ` +
      `${mode.xLabel.toLowerCase()} from 0% to ${formatPercent(xMax, { decimals: 0 })}, ` +
      `at ${formatPercent(variableCost)} variable costs.`,
  });
}

function renderTable(mode, variableCost) {
  tableHeading.textContent = mode.tableHeading;
  tableCaption.textContent = mode.tableCaption(variableCost);
  tableBody.replaceChildren(
    ...TABLE_CHANGES.map((change) => {
      const row = document.createElement("tr");
      const volume = mode.volume(variableCost, change);
      row.append(document.createElement("td"), document.createElement("td"));
      row.cells[0].textContent = formatPercent(change);
      row.cells[1].textContent = volume == null ? "Not possible" : mode.formatVolume(volume);
      return row;
    }),
  );
}

function update() {
  const data = new FormData(form);
  const mode = MODES[data.get("mode")];
  const variableCost = Number(data.get("variableCost"));
  const change = Number(data.get("change"));

  changeLabel.textContent = mode.changeLabel;
  const result = renderResults(mode, variableCost, change);

  const validCost = variableCost >= 0 && variableCost < 100;
  visuals.hidden = !validCost;
  if (validCost) {
    renderChart(mode, variableCost, change, result?.volume ?? null);
    renderTable(mode, variableCost);
  }
}

// Keep the number box and slider in step. Only the number box has a `name`,
// so it is the single value the form reads.
changeSlider.addEventListener("input", () => {
  changeInput.value = changeSlider.value;
});
changeInput.addEventListener("input", () => {
  if (changeInput.value !== "") changeSlider.value = changeInput.value;
});

// Link straight to a mode with #discount or #increase.
function applyHash() {
  const mode = location.hash.slice(1);
  if (mode in MODES) {
    form.elements.mode.value = mode;
    update();
  }
}
window.addEventListener("hashchange", applyHash);

form.addEventListener("input", update);
form.addEventListener("submit", (event) => event.preventDefault());
update();
applyHash();
