import { Prisma } from "@prisma/client";
import { addDays, format, isAfter, parseISO } from "date-fns";
import { fetchEspnScoreboardRange } from "@/lib/espn";
import { getPrisma } from "@/lib/prisma";

export type SyncOptions = { from?: string; to?: string };
export const WORLD_CUP_START_DATE = "2026-06-11";
export const WORLD_CUP_END_DATE = "2026-07-19";

export async function syncResults(options: SyncOptions = {}) {
  const prisma = getPrisma();
  const dates = buildSyncDates(options);
  const log = await prisma.syncLog.create({ data: { status: "running" } });
  let fetched = 0;
  let upserted = 0;

  try {
    const matches = await fetchEspnScoreboardRange(dates[0], dates.at(-1) ?? dates[0]);
    fetched = matches.length;
    for (const match of matches) {
      const { rawJson, ...data } = match;
      await prisma.match.upsert({
        where: { espnEventId: match.espnEventId },
        create: { ...data, rawJson: rawJson as Prisma.InputJsonValue },
        update: { ...data, rawJson: rawJson as Prisma.InputJsonValue },
      });
      upserted += 1;
    }
    const result = { status: "success", message: `Synced ${upserted} matches across ${dates.length} date(s).`, matchesFetched: fetched, matchesUpserted: upserted };
    await prisma.syncLog.update({ where: { id: log.id }, data: { ...result, finishedAt: new Date() } });
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync error";
    await prisma.syncLog.update({ where: { id: log.id }, data: { status: "error", message, matchesFetched: fetched, matchesUpserted: upserted, finishedAt: new Date() } });
    throw error;
  }
}

export function buildSyncDates(options: SyncOptions = {}) {
  const { from, to } = options;
  // Default to the full tournament so every result and upcoming fixture is
  // stored. ESPN supports this range in one request when limit is raised.
  const start = parseISO(normalizeDate(from ?? WORLD_CUP_START_DATE));
  const end = parseISO(normalizeDate(to ?? from ?? WORLD_CUP_END_DATE));
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || isAfter(start, end)) throw new Error("Invalid sync date range.");
  const dates: string[] = [];
  for (let date = start; !isAfter(date, end); date = addDays(date, 1)) dates.push(format(date, "yyyyMMdd"));
  if (dates.length > 90) throw new Error("Date ranges are limited to 90 days.");
  return dates;
}

function normalizeDate(value: string) {
  return /^\d{8}$/.test(value) ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}` : value;
}
