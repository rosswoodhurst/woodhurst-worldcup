import { ActionButtons } from "@/components/action-buttons";
import { Podium } from "@/components/podium";
import { StandingsList } from "@/components/standings-list";
import { getMatches } from "@/lib/data";
import { calculateOwnerStandings } from "@/lib/standings";
import type { StoredMatch } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let databaseOffline = false;
  let matches: StoredMatch[] = [];
  try {
    matches = await getMatches();
  } catch {
    databaseOffline = true;
  }
  const standings = calculateOwnerStandings(matches);

  return (
    <div className="space-y-8">
      <section className="max-w-4xl">
        <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
          ⚽ Woodhurst World Cup Sweepstake
        </h1>
        <p className="mt-3 text-base font-semibold text-muted sm:text-lg">
          Family bragging rights, updated automatically.
        </p>
      </section>
      {databaseOffline && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm font-bold text-amber-200">
          Database unavailable. Showing the seeded draw with zero scores.
        </div>
      )}
      <ActionButtons />
      <section className="space-y-3">
        <h2 className="label">Top three</h2>
        <Podium standings={standings} />
      </section>
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-black">League table</h2>
            <p className="mt-1 text-sm font-semibold text-muted">
              Points, goal difference, then goals scored.
            </p>
          </div>
          <span className="hidden label sm:block">
            {matches.length} matches stored
          </span>
        </div>
        <StandingsList standings={standings} />
      </section>
    </div>
  );
}
