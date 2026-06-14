import assert from "node:assert/strict";
import test from "node:test";
import { calculateOwnerStandings } from "./standings";

test("aggregates owner points and applies table tie breakers", () => {
  const standings = calculateOwnerStandings([
    {
      espnEventId: "1",
      kickoff: new Date(),
      status: "post",
      statusDetail: "Full Time",
      completed: true,
      homeTeam: "Brazil",
      awayTeam: "Germany",
      homeAbbr: "BRA",
      awayAbbr: "GER",
      homeScore: 2,
      awayScore: 0,
    },
    {
      espnEventId: "2",
      kickoff: new Date(),
      status: "post",
      statusDetail: "Full Time",
      completed: true,
      homeTeam: "Türkiye",
      awayTeam: "United States",
      homeAbbr: "TUR",
      awayAbbr: "USA",
      homeScore: 1,
      awayScore: 1,
    },
    {
      espnEventId: "3",
      kickoff: new Date(),
      status: "post",
      statusDetail: "Full Time",
      completed: true,
      homeTeam: "Canada",
      awayTeam: "Bosnia-Herzegovina",
      homeAbbr: "CAN",
      awayAbbr: "BIH",
      homeScore: 1,
      awayScore: 1,
    },
  ]);

  assert.equal(standings[0].name, "Ross");
  assert.equal(standings[0].points, 3);
  assert.equal(standings.find((owner) => owner.name === "Andy")?.points, 1);
  assert.equal(standings.find((owner) => owner.name === "Jo")?.points, 1);
  assert.equal(standings.find((owner) => owner.name === "Rudy")?.played, 1);
  assert.equal(standings.find((owner) => owner.name === "Leanne")?.goalDifference, -2);
});
