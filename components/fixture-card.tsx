import { format } from "date-fns";
import type { FixtureView } from "@/lib/types";

export function FixtureCard({ fixture }: { fixture: FixtureView }) {
  const status = fixture.completed ? "Full time" : fixture.status === "in" ? "Live" : "Scheduled";
  return (
    <article className={`panel p-4 ${fixture.sweepstakeMatch ? "border-accent/60" : ""}`}>
      <div className="mb-4 flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-muted">
        <span>{format(fixture.kickoff, "HH:mm")}</span>
        <span className={fixture.status === "in" ? "text-accent" : ""}>{status}</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Team side="home" flag={fixture.homeFlag} name={fixture.homeTeam} owner={fixture.homeOwner} />
        <div className="min-w-16 text-center font-mono text-xl font-bold">
          {fixture.homeScore != null && fixture.awayScore != null ? `${fixture.homeScore} – ${fixture.awayScore}` : "vs"}
        </div>
        <Team side="away" flag={fixture.awayFlag} name={fixture.awayTeam} owner={fixture.awayOwner} />
      </div>
    </article>
  );
}

function Team({ side, flag, name, owner }: { side: "home" | "away"; flag: string; name: string; owner: string | null }) {
  return (
    <div className={side === "away" ? "text-right" : ""}>
      <div className="text-xl">{flag}</div>
      <div className="mt-1 text-sm font-black">{name}</div>
      <div className="mt-0.5 text-xs font-bold text-muted">{owner ?? "Not in draw"}</div>
    </div>
  );
}
