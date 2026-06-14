import type { OwnerStanding } from "@/lib/types";

function gd(value: number) {
  return value > 0 ? `+${value}` : value;
}

export function StandingsList({ standings }: { standings: OwnerStanding[] }) {
  return (
    <div className="panel overflow-hidden">
      <div className="hidden grid-cols-[44px_1fr_repeat(5,64px)] gap-2 border-b px-5 py-3 text-right text-xs font-extrabold uppercase tracking-wider text-muted sm:grid">
        <span className="text-left">#</span><span className="text-left">Owner</span><span>P</span><span>W</span><span>D</span><span>GD</span><span>Pts</span>
      </div>
      <ol className="divide-y">
        {standings.map((owner) => (
          <li key={owner.name} className="grid grid-cols-[42px_1fr_auto] items-center gap-3 px-4 py-4 sm:grid-cols-[44px_1fr_repeat(5,64px)] sm:px-5">
            <span className="font-mono text-lg font-bold text-muted">{owner.rank}</span>
            <div className="min-w-0">
              <div className="font-black">{owner.name}</div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                {owner.teams.map((team) => <span key={team.name}>{team.flagEmoji} {team.name}</span>)}
              </div>
              <div className="mt-2 text-xs font-bold text-muted sm:hidden">{owner.won}W · {owner.drawn}D · {owner.lost}L · GD {gd(owner.goalDifference)}</div>
            </div>
            <div className="text-right sm:hidden">
              <div className="font-mono text-2xl font-bold text-accent">{owner.points}</div>
              <div className="label">pts</div>
            </div>
            <span className="hidden text-right font-mono text-sm sm:block">{owner.played}</span>
            <span className="hidden text-right font-mono text-sm sm:block">{owner.won}</span>
            <span className="hidden text-right font-mono text-sm sm:block">{owner.drawn}</span>
            <span className="hidden text-right font-mono text-sm sm:block">{gd(owner.goalDifference)}</span>
            <span className="hidden text-right font-mono text-lg font-bold text-accent sm:block">{owner.points}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
