/**
 * A small, dependency-free SVG line chart for one series of y = f(x).
 * Reusable by any tool page. Colors come from CSS (see .chart in
 * css/components.css), so the chart follows the site's theme.
 */

const SVG_NS = "http://www.w3.org/2000/svg";
const MARGIN = { top: 16, right: 16, bottom: 44, left: 64 };
const HEIGHT = 300;
const SAMPLES = 240;

function svg(name, attrs = {}, parent) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (parent) parent.appendChild(node);
  return node;
}

/** Round a rough step up to 1, 2, 2.5 or 5 times a power of ten. */
export function niceStep(rough) {
  const power = 10 ** Math.floor(Math.log10(rough));
  const fraction = rough / power;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return nice * power;
}

function ticks(max, count) {
  const step = niceStep(max / count);
  const values = [];
  for (let v = 0; v <= max + step * 1e-9; v += step) values.push(Number(v.toFixed(10)));
  return values;
}

/**
 * Create a chart inside `container`. Returns an object with `update(options)`
 * to redraw with new data; the chart also redraws itself when resized.
 *
 * Options:
 *   fn(x)        -> y value, or null where the function is undefined
 *   xMax, yMax   axis maxima (both axes start at 0)
 *   xLabel, yLabel
 *   formatX(x), formatY(y)  tick and tooltip formatting
 *   marker       optional x value to highlight
 *   tooltip(x, y) -> string shown on hover
 *   description  text alternative for screen readers
 */
export function createLineChart(container) {
  let options = null;

  container.classList.add("chart");
  const tooltip = document.createElement("div");
  tooltip.className = "chart-tooltip";
  tooltip.hidden = true;

  function draw() {
    if (!options) return;
    const { fn, xMax, yMax, xLabel, yLabel, formatX, formatY, marker, description } = options;

    const width = container.clientWidth;
    if (width <= 0) return; // hidden; redraws via ResizeObserver when shown
    const plotW = width - MARGIN.left - MARGIN.right;
    const plotH = HEIGHT - MARGIN.top - MARGIN.bottom;
    const sx = (x) => MARGIN.left + (x / xMax) * plotW;
    const sy = (y) => MARGIN.top + plotH - (y / yMax) * plotH;

    const root = svg("svg", {
      width,
      height: HEIGHT,
      viewBox: `0 0 ${width} ${HEIGHT}`,
      role: "img",
      "aria-label": description ?? "",
    });

    // Clip the line to the plot area so steep curves don't spill over.
    const clipId = `clip-${Math.random().toString(36).slice(2)}`;
    const clip = svg("clipPath", { id: clipId }, svg("defs", {}, root));
    svg("rect", { x: MARGIN.left, y: MARGIN.top, width: plotW, height: plotH }, clip);

    // Grid and y-axis ticks.
    for (const y of ticks(yMax, 4)) {
      svg("line", { class: "chart-grid", x1: MARGIN.left, x2: MARGIN.left + plotW, y1: sy(y), y2: sy(y) }, root);
      svg("text", { class: "chart-tick", x: MARGIN.left - 8, y: sy(y), "text-anchor": "end", "dominant-baseline": "middle" }, root)
        .textContent = formatY(y);
    }

    // X-axis ticks and baseline.
    for (const x of ticks(xMax, width < 480 ? 4 : 6)) {
      svg("text", { class: "chart-tick", x: sx(x), y: MARGIN.top + plotH + 18, "text-anchor": "middle" }, root)
        .textContent = formatX(x);
    }
    svg("line", { class: "chart-axis", x1: MARGIN.left, x2: MARGIN.left + plotW, y1: sy(0), y2: sy(0) }, root);

    // Axis labels.
    svg("text", { class: "chart-label", x: MARGIN.left + plotW / 2, y: HEIGHT - 4, "text-anchor": "middle" }, root)
      .textContent = xLabel;
    svg("text", {
      class: "chart-label",
      transform: `translate(14 ${MARGIN.top + plotH / 2}) rotate(-90)`,
      "text-anchor": "middle",
    }, root).textContent = yLabel;

    // The series, split into segments wherever fn returns null.
    let d = "";
    let penDown = false;
    for (let i = 0; i <= SAMPLES; i++) {
      const x = (i / SAMPLES) * xMax;
      const y = fn(x);
      if (y == null || !Number.isFinite(y)) {
        penDown = false;
        continue;
      }
      d += `${penDown ? "L" : "M"}${sx(x).toFixed(1)},${sy(Math.min(y, yMax * 2)).toFixed(1)}`;
      penDown = true;
    }
    svg("path", { class: "chart-line", d, "clip-path": `url(#${clipId})` }, root);

    // Highlighted point (the user's current input).
    if (marker != null && fn(marker) != null && fn(marker) <= yMax) {
      const my = fn(marker);
      svg("line", { class: "chart-marker-guide", x1: sx(marker), x2: sx(marker), y1: sy(0), y2: sy(my) }, root);
      svg("circle", { class: "chart-marker", cx: sx(marker), cy: sy(my), r: 5 }, root);
    }

    // Hover layer: crosshair + tooltip.
    const crosshair = svg("line", { class: "chart-crosshair", y1: MARGIN.top, y2: MARGIN.top + plotH, visibility: "hidden" }, root);
    const hoverDot = svg("circle", { class: "chart-hover-dot", r: 4, visibility: "hidden" }, root);
    const hitArea = svg("rect", { x: MARGIN.left, y: MARGIN.top, width: plotW, height: plotH, fill: "transparent" }, root);

    function hide() {
      crosshair.setAttribute("visibility", "hidden");
      hoverDot.setAttribute("visibility", "hidden");
      tooltip.hidden = true;
    }

    hitArea.addEventListener("pointermove", (event) => {
      const box = root.getBoundingClientRect();
      const px = Math.min(Math.max(event.clientX - box.left, MARGIN.left), MARGIN.left + plotW);
      const x = ((px - MARGIN.left) / plotW) * xMax;
      const y = fn(x);

      crosshair.setAttribute("x1", px);
      crosshair.setAttribute("x2", px);
      crosshair.setAttribute("visibility", "visible");

      if (y != null && y <= yMax) {
        hoverDot.setAttribute("cx", px);
        hoverDot.setAttribute("cy", sy(y));
        hoverDot.setAttribute("visibility", "visible");
      } else {
        hoverDot.setAttribute("visibility", "hidden");
      }

      tooltip.textContent = options.tooltip(x, y);
      tooltip.hidden = false;
      const flip = px > width / 2;
      tooltip.style.left = flip ? "" : `${px + 12}px`;
      tooltip.style.right = flip ? `${width - px + 12}px` : "";
      tooltip.style.top = `${MARGIN.top}px`;
    });
    hitArea.addEventListener("pointerleave", hide);

    container.replaceChildren(root, tooltip);
    hide();
  }

  new ResizeObserver(draw).observe(container);

  return {
    update(next) {
      options = next;
      draw();
    },
  };
}
