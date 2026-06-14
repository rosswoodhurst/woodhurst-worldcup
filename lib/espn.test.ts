import assert from "node:assert/strict";
import test from "node:test";
import { parseEspnScoreboard } from "./espn";

test("defensively parses an ESPN event", () => {
  const matches = parseEspnScoreboard({
    events: [{
      id: "event-1",
      date: "2026-06-14T18:00:00Z",
      status: { type: { state: "post", detail: "FT", completed: true } },
      competitions: [{ competitors: [
        { homeAway: "home", score: "2", team: { displayName: "Brazil", abbreviation: "BRA" } },
        { homeAway: "away", score: "1", team: { displayName: "Mexico", abbreviation: "MEX" } },
      ] }],
    }],
  });

  assert.equal(matches.length, 1);
  assert.equal(matches[0].homeTeam, "Brazil");
  assert.equal(matches[0].awayScore, 1);
  assert.equal(matches[0].completed, true);
});

test("skips incomplete ESPN events", () => {
  assert.deepEqual(parseEspnScoreboard({ events: [{ id: "missing-teams" }] }), []);
});
