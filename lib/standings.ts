import { canonicalTeamName, SWEEPSTAKE_DRAW } from "@/lib/sweepstake";
import type { OwnerStanding, StoredMatch, TeamStanding } from "@/lib/types";

function emptyTeam(name: string, flagEmoji: string): TeamStanding {
  return { name, flagEmoji, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 };
}

export function calculateOwnerStandings(matches: StoredMatch[]): OwnerStanding[] {
  const teams = new Map<string, TeamStanding>();
  for (const entry of SWEEPSTAKE_DRAW) {
    for (const team of entry.teams) teams.set(team.name, emptyTeam(team.name, team.flagEmoji));
  }

  for (const match of matches) {
    if (!match.completed || match.homeScore == null || match.awayScore == null) continue;
    const home = teams.get(canonicalTeamName(match.homeTeam));
    const away = teams.get(canonicalTeamName(match.awayTeam));
    if (!home && !away) continue;

    if (home) applyResult(home, match.homeScore, match.awayScore);
    if (away) applyResult(away, match.awayScore, match.homeScore);
  }

  const standings = SWEEPSTAKE_DRAW.map((entry) => {
    const ownerTeams = entry.teams.map((team) => teams.get(team.name) ?? emptyTeam(team.name, team.flagEmoji));
    const sum = (field: keyof Omit<TeamStanding, "name" | "flagEmoji">) =>
      ownerTeams.reduce((total, team) => total + team[field], 0);
    return {
      rank: 0,
      name: entry.owner,
      teams: ownerTeams,
      played: sum("played"),
      won: sum("won"),
      drawn: sum("drawn"),
      lost: sum("lost"),
      goalsFor: sum("goalsFor"),
      goalsAgainst: sum("goalsAgainst"),
      goalDifference: sum("goalDifference"),
      points: sum("points"),
    };
  });

  standings.sort((a, b) =>
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor ||
    a.name.localeCompare(b.name),
  );
  return standings.map((standing, index) => ({ ...standing, rank: index + 1 }));
}

function applyResult(team: TeamStanding, goalsFor: number, goalsAgainst: number) {
  team.played += 1;
  team.goalsFor += goalsFor;
  team.goalsAgainst += goalsAgainst;
  team.goalDifference = team.goalsFor - team.goalsAgainst;
  if (goalsFor > goalsAgainst) {
    team.won += 1;
    team.points += 3;
  } else if (goalsFor === goalsAgainst) {
    team.drawn += 1;
    team.points += 1;
  } else {
    team.lost += 1;
  }
}
