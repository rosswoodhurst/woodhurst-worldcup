import "dotenv/config";
import { getPrisma } from "../lib/prisma";
import { syncResults } from "../lib/sync";

function valueAfter(flag: string) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const result = await syncResults({ from: valueAfter("--from"), to: valueAfter("--to") });
  console.log(result.message);
}

main()
  .catch((error) => {
    console.error("Result sync failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await getPrisma().$disconnect();
  });
