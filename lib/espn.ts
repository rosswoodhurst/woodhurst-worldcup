import type { StoredMatch } from "@/lib/types";

export const ESPN_SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

type EspnCompetitor = {
  homeAway?: string;
  score?: string;
  team?: { displayName?: string; shortDisplayName?: string; name?: string; abbreviation?: string };
};

type EspnEvent = {
  id?: string;
  date?: string;
  status?: { type?: { name?: string; description?: string; detail?: string; completed?: boolean; state?: string } };
  competitions?: { competitors?: EspnCompetitor[] }[];
};

export type ParsedEspnMatch = StoredMatch & { rawJson: unknown };

export function parseEspnScoreboard(payload: unknown): ParsedEspnMatch[] {
  const events = isRecord(payload) && Array.isArray(payload.events) ? (payload.events as EspnEvent[]) : [];
  return events.flatMap((event) => {
    const competitors = event.competitions?.[0]?.competitors ?? [];
    const home = competitors.find((team) => team.homeAway === "home");
    const away = competitors.find((team) => team.homeAway === "away");
    const homeName = teamName(home);
    const awayName = teamName(away);
    if (!event.id || !event.date || !homeName || !awayName) return [];
    return [{
      espnEventId: event.id,
      kickoff: new Date(event.date),
      status: event.status?.type?.state ?? event.status?.type?.name ?? "pre",
      statusDetail: event.status?.type?.detail ?? event.status?.type?.description ?? null,
      completed: Boolean(event.status?.type?.completed),
      homeTeam: homeName,
      awayTeam: awayName,
      homeAbbr: home?.team?.abbreviation ?? null,
      awayAbbr: away?.team?.abbreviation ?? null,
      homeScore: parseScore(home?.score),
      awayScore: parseScore(away?.score),
      rawJson: event,
    }];
  });
}

export async function fetchEspnScoreboard(date?: string) {
  const url = new URL(ESPN_SCOREBOARD_URL);
  if (date) url.searchParams.set("dates", normalizeEspnDate(date));
  return fetchScoreboardUrl(url);
}

export async function fetchEspnScoreboardRange(from: string, to: string) {
  const url = new URL(ESPN_SCOREBOARD_URL);
  url.searchParams.set("dates", `${normalizeEspnDate(from)}-${normalizeEspnDate(to)}`);
  url.searchParams.set("limit", "200");
  return fetchScoreboardUrl(url);
}

async function fetchScoreboardUrl(url: URL) {
  const response = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`ESPN returned ${response.status} ${response.statusText}`);
  return parseEspnScoreboard(await response.json());
}

function normalizeEspnDate(date: string) {
  return date.replaceAll("-", "");
}

function teamName(competitor?: EspnCompetitor) {
  return competitor?.team?.displayName ?? competitor?.team?.shortDisplayName ?? competitor?.team?.name ?? null;
}

function parseScore(value?: string) {
  if (value == null || value === "") return null;
  const score = Number.parseInt(value, 10);
  return Number.isFinite(score) ? score : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
