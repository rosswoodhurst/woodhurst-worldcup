export type DrawEntry = {
  owner: string;
  teams: { name: string; flagEmoji: string }[];
};

export const SWEEPSTAKE_DRAW: DrawEntry[] = [
  { owner: "Sonny", teams: [["Paraguay", "🇵🇾"], ["Spain", "🇪🇸"], ["Portugal", "🇵🇹"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "Eve", teams: [["England", "🏴"], ["Senegal", "🇸🇳"], ["Uzbekistan", "🇺🇿"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "Lucy", teams: [["South Korea", "🇰🇷"], ["Saudi Arabia", "🇸🇦"], ["Haiti", "🇭🇹"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "Andy", teams: [["Qatar", "🇶🇦"], ["Egypt", "🇪🇬"], ["Turkey", "🇹🇷"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "Max", teams: [["Argentina", "🇦🇷"], ["DR Congo", "🇨🇩"], ["Ghana", "🇬🇭"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "Alfie", teams: [["Japan", "🇯🇵"], ["Tunisia", "🇹🇳"], ["Ivory Coast", "🇨🇮"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "G", teams: [["Ecuador", "🇪🇨"], ["Scotland", "🏴"], ["Switzerland", "🇨🇭"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "Jools", teams: [["Croatia", "🇭🇷"], ["Colombia", "🇨🇴"], ["Algeria", "🇩🇿"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "Jo", teams: [["Panama", "🇵🇦"], ["Iraq", "🇮🇶"], ["USA", "🇺🇸"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "Fred", teams: [["Belgium", "🇧🇪"], ["Cape Verde", "🇨🇻"], ["Netherlands", "🇳🇱"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "Lyra", teams: [["Jordan", "🇯🇴"], ["South Africa", "🇿🇦"], ["New Zealand", "🇳🇿"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "Ross", teams: [["Uruguay", "🇺🇾"], ["Brazil", "🇧🇷"], ["Mexico", "🇲🇽"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "Finn", teams: [["Curacao", "🇨🇼"], ["Czechia", "🇨🇿"], ["Norway", "🇳🇴"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "Leanne", teams: [["Australia", "🇦🇺"], ["Germany", "🇩🇪"], ["France", "🇫🇷"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "Mae", teams: [["Canada", "🇨🇦"], ["Iran", "🇮🇷"], ["Morocco", "🇲🇦"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
  { owner: "Rudy", teams: [["Austria", "🇦🇹"], ["Sweden", "🇸🇪"], ["Bosnia and Herzegovina", "🇧🇦"]].map(([name, flagEmoji]) => ({ name, flagEmoji })) },
];

const ALIASES: Record<string, string> = {
  turkey: "Turkey",
  turkiye: "Turkey",
  usa: "USA",
  unitedstates: "USA",
  southkorea: "South Korea",
  korearepublic: "South Korea",
  drcongo: "DR Congo",
  congodr: "DR Congo",
  congo: "DR Congo",
  ivorycoast: "Ivory Coast",
  cotedivoire: "Ivory Coast",
  colombia: "Colombia",
  curacao: "Curacao",
  bosnia: "Bosnia and Herzegovina",
  bosniaherzegovina: "Bosnia and Herzegovina",
  bosniaandherzegovina: "Bosnia and Herzegovina",
  caboverde: "Cape Verde",
  capeverde: "Cape Verde",
  saudiarabia: "Saudi Arabia",
  czechia: "Czechia",
  czechrepublic: "Czechia",
};

export function normalizeTeamName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function canonicalTeamName(name: string): string {
  const normalized = normalizeTeamName(name);
  return ALIASES[normalized] ?? name.trim();
}

export function getSeedTeams() {
  return SWEEPSTAKE_DRAW.flatMap((entry) =>
    entry.teams.map((team) => ({
      ...team,
      ownerName: entry.owner,
      normalizedName: normalizeTeamName(team.name),
    })),
  );
}
