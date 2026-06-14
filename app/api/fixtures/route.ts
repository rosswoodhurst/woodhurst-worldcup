import { getFixtures } from "@/lib/data";

export async function GET() {
  try { return Response.json(await getFixtures()); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 503 }); }
}
