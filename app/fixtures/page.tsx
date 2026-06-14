import { format } from "date-fns";
import { FixtureCard } from "@/components/fixture-card";
import { getFixtures } from "@/lib/data";
import type { FixtureView } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function FixturesPage() {
  let fixtures: FixtureView[] = [];
  let error = false;
  try { fixtures = await getFixtures(); } catch { error = true; }
  const groups = Map.groupBy(fixtures, (fixture) => format(fixture.kickoff, "yyyy-MM-dd"));

  return (
    <div className="space-y-7">
      <div><h1 className="text-3xl font-black tracking-tight">Fixtures & results</h1><p className="mt-2 font-semibold text-muted">Every stored World Cup fixture, grouped by date.</p></div>
      {error && <div className="panel p-4 text-sm font-bold text-muted">Database unavailable. Configure `DATABASE_URL` to load fixtures.</div>}
      {!error && fixtures.length === 0 && <div className="panel p-6 text-center font-bold text-muted">No fixtures stored yet. Run a results refresh to get started.</div>}
      {[...groups.entries()].map(([date, items]) => (
        <section key={date} className="space-y-3">
          <h2 className="label">{format(new Date(`${date}T12:00:00`), "EEEE, d MMMM")}</h2>
          <div className="grid gap-3 md:grid-cols-2">{items.map((fixture) => <FixtureCard key={fixture.espnEventId} fixture={fixture} />)}</div>
        </section>
      ))}
    </div>
  );
}
