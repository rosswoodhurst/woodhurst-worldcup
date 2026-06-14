import { endOfDay, startOfDay, subDays } from "date-fns";
import { decorateFixtures } from "@/lib/fixtures";
import { getPrisma } from "@/lib/prisma";
import { calculateOwnerStandings } from "@/lib/standings";
import type { StoredMatch } from "@/lib/types";

export async function getMatches(): Promise<StoredMatch[]> {
  const prisma = getPrisma();
  return prisma.match.findMany({ orderBy: { kickoff: "asc" } });
}

export async function getStandings() {
  return calculateOwnerStandings(await getMatches());
}

export async function getFixtures() {
  return decorateFixtures(await getMatches());
}

export async function getRecentFixtures() {
  const prisma = getPrisma();
  const matches = await prisma.match.findMany({
    where: { kickoff: { gte: startOfDay(subDays(new Date(), 2)), lte: endOfDay(new Date(Date.now() + 7 * 86400000)) } },
    orderBy: { kickoff: "asc" },
  });
  return decorateFixtures(matches);
}
