import { test } from "node:test";
import assert from "node:assert/strict";
import { shouldTrack, endpointFor } from "../js/lib/analytics-config.js";

test("tracks the live site when a code is set", () => {
  assert.equal(shouldTrack("yourname.github.io", "yourname"), true);
  assert.equal(shouldTrack("example.com", "yourname"), true);
});

test("never tracks without a code", () => {
  assert.equal(shouldTrack("example.com", ""), false);
});

test("never tracks local testing", () => {
  for (const host of ["", "localhost", "127.0.0.1", "0.0.0.0", "[::1]", "my-mac.local"]) {
    assert.equal(shouldTrack(host, "yourname"), false, host);
  }
});

test("builds the GoatCounter endpoint", () => {
  assert.equal(endpointFor("yourname"), "https://yourname.goatcounter.com/count");
});
