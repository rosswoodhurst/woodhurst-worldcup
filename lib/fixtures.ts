import { canonicalTeamName, getSeedTeams } from "@/lib/sweepstake";
import type { FixtureView, StoredMatch } from "@/lib/types";

export function decorateFixtures(matches: StoredMatch[]): FixtureView[] {
  const teams = new Map(getSeedTeams().map((team) => [team.name, team]));
  return matches.map((match) => {
    const home = teams.get(canonicalTeamName(match.homeTeam));
    const away = teams.get(canonicalTeamName(match.awayTeam));
    return {
      ...match,
      homeOwner: home?.ownerName ?? null,
      awayOwner: away?.ownerName ?? null,
      homeFlag: home?.flagEmoji ?? "🌍",
      awayFlag: away?.flagEmoji ?? "🌍",
      sweepstakeMatch: Boolean(home && away),
    };
  });
}
