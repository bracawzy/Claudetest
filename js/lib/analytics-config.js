/**
 * Analytics settings. Pure values and functions only, so they can be tested.
 *
 * Traffic stats use GoatCounter (https://www.goatcounter.com): free for
 * personal sites, open source, no cookies and no personal data, so no cookie
 * banner is needed.
 */

/**
 * Your GoatCounter site code: the "yourname" in yourname.goatcounter.com.
 * Leave empty to turn analytics off.
 */
export const GOATCOUNTER_CODE = "";

/** Hosts that are never counted, so local testing doesn't skew the numbers. */
const IGNORED_HOSTS = new Set(["", "localhost", "127.0.0.1", "0.0.0.0", "[::1]"]);

export function shouldTrack(hostname, code = GOATCOUNTER_CODE) {
  return Boolean(code) && !IGNORED_HOSTS.has(hostname) && !hostname.endsWith(".local");
}

export function endpointFor(code = GOATCOUNTER_CODE) {
  return `https://${code}.goatcounter.com/count`;
}
