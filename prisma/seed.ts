import { getPrisma } from "../lib/prisma";
import { SWEEPSTAKE_DRAW, normalizeTeamName } from "../lib/sweepstake";

async function main() {
  const prisma = getPrisma();
  await prisma.team.deleteMany();
  await prisma.owner.deleteMany();

  for (const entry of SWEEPSTAKE_DRAW) {
    await prisma.owner.create({
      data: {
        name: entry.owner,
        teams: {
          create: entry.teams.map((team) => ({
            name: team.name,
            normalizedName: normalizeTeamName(team.name),
            flagEmoji: team.flagEmoji,
          })),
        },
      },
    });
  }
  console.log(`Seeded ${SWEEPSTAKE_DRAW.length} owners and ${SWEEPSTAKE_DRAW.length * 3} teams.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await getPrisma().$disconnect();
  });
