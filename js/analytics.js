/**
 * Loads GoatCounter on every page and exposes trackEvent() for things that
 * aren't page views, like someone using a calculator.
 *
 * Included on every page with:
 *   <script type="module" src=".../js/analytics.js"></script>
 */
import { GOATCOUNTER_CODE, shouldTrack, endpointFor } from "./lib/analytics-config.js";

const enabled = shouldTrack(location.hostname);

if (enabled) {
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://gc.zgo.at/count.js";
  script.dataset.goatcounter = endpointFor(GOATCOUNTER_CODE);
  document.head.appendChild(script);
}

/**
 * Count a named event, e.g. trackEvent("price-calculator/discount").
 * Does nothing when analytics are off or the counter hasn't loaded.
 */
export function trackEvent(name, title = name) {
  if (!enabled) return;
  window.goatcounter?.count?.({ path: name, title, event: true });
}
