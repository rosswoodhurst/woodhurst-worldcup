export type StoredMatch = {
  espnEventId: string;
  kickoff: Date;
  status: string;
  statusDetail: string | null;
  completed: boolean;
  homeTeam: string;
  awayTeam: string;
  homeAbbr: string | null;
  awayAbbr: string | null;
  homeScore: number | null;
  awayScore: number | null;
};

export type TeamStanding = {
  name: string;
  flagEmoji: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export type OwnerStanding = {
  rank: number;
  name: string;
  teams: TeamStanding[];
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export type FixtureView = StoredMatch & {
  homeOwner: string | null;
  awayOwner: string | null;
  homeFlag: string;
  awayFlag: string;
  sweepstakeMatch: boolean;
};
