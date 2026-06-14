import { getStandings } from "@/lib/data";

export async function GET() {
  try { return Response.json(await getStandings()); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 503 }); }
}
