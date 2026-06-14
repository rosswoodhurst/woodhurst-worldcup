import type { OwnerStanding } from "@/lib/types";

export function Podium({ standings }: { standings: OwnerStanding[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {standings.slice(0, 3).map((owner) => (
        <div key={owner.name} className="panel px-3 py-4 text-center">
          <div className="label">{owner.rank === 1 ? "Leader" : `#${owner.rank}`}</div>
          <div className="mt-2 truncate font-black">{owner.name}</div>
          <div className="mt-1 font-mono text-2xl font-bold text-accent">{owner.points}</div>
          <div className="text-xs font-bold text-muted">points</div>
        </div>
      ))}
    </div>
  );
}
