import { ActionButtons } from "@/components/action-buttons";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let matchCount = 0;
  let latest: { status: string; message: string | null; startedAt: Date; finishedAt: Date | null; matchesFetched: number; matchesUpserted: number } | null = null;
  let error = false;
  try {
    const prisma = getPrisma();
    [matchCount, latest] = await Promise.all([prisma.match.count(), prisma.syncLog.findFirst({ orderBy: { startedAt: "desc" } })]);
  } catch { error = true; }

  return (
    <div className="max-w-2xl space-y-7">
      <div><h1 className="text-3xl font-black tracking-tight">Admin</h1><p className="mt-2 font-semibold text-muted">Manual result sync and basic diagnostics.</p></div>
      <ActionButtons compact />
      <section className="panel divide-y">
        <Row label="Database" value={error ? "Unavailable" : "Connected"} />
        <Row label="Matches stored" value={String(matchCount)} />
        <Row label="Last sync" value={latest?.finishedAt?.toLocaleString("en-GB") ?? "Never"} />
        <Row label="Last status" value={latest?.status ?? "—"} />
      </section>
      <details className="panel p-4">
        <summary className="cursor-pointer text-sm font-black">Debug information</summary>
        <pre className="mt-4 overflow-auto rounded-xl bg-background p-4 font-mono text-xs text-muted">{JSON.stringify(latest, null, 2)}</pre>
      </details>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 px-4 py-3"><span className="text-sm font-bold text-muted">{label}</span><span className="text-right text-sm font-black">{value}</span></div>;
}
