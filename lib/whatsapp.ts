import { format } from "date-fns";
import type { FixtureView, OwnerStanding } from "@/lib/types";

function gd(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

export function generateWhatsAppTable(standings: OwnerStanding[]) {
  return [
    "🏆 World Cup Sweepstake Table",
    "",
    ...standings.flatMap((owner) => [
      `${owner.rank}. ${owner.name} — ${owner.points} pts | GD ${gd(owner.goalDifference)}`,
      owner.teams.map((team) => `${team.flagEmoji} ${team.name}`).join(", "),
    ]),
  ].join("\n");
}

export function generateWhatsAppFixtures(fixtures: FixtureView[], date = new Date()) {
  const dateKey = format(date, "yyyy-MM-dd");
  const todays = fixtures.filter((fixture) => format(fixture.kickoff, "yyyy-MM-dd") === dateKey);
  return [
    "⚽ Today’s World Cup Sweepstake Fixtures",
    "",
    ...(todays.length
      ? todays.map((fixture) => {
          const home = `${fixture.homeFlag} ${fixture.homeTeam}${fixture.homeOwner ? ` (${fixture.homeOwner})` : ""}`;
          const away = `${fixture.awayFlag} ${fixture.awayTeam}${fixture.awayOwner ? ` (${fixture.awayOwner})` : ""}`;
          const score = fixture.homeScore != null && fixture.awayScore != null ? ` — ${fixture.homeScore}-${fixture.awayScore}` : "";
          return `${format(fixture.kickoff, "HH:mm")} — ${home} vs ${away}${score}`;
        })
      : ["No stored sweepstake fixtures today."]),
  ].join("\n");
}
