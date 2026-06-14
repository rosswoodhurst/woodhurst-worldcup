import assert from "node:assert/strict";
import test from "node:test";
import { buildSyncDates } from "./sync";

test("default sync includes the complete tournament date range", () => {
  const dates = buildSyncDates();
  assert.equal(dates[0], "20260611");
  assert.equal(dates.at(-1), "20260719");
  assert.equal(dates.length, 39);
});

test("an explicit sync date remains exact", () => {
  assert.deepEqual(buildSyncDates({ from: "2026-06-13" }), ["20260613"]);
});
