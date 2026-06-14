import { syncResults } from "@/lib/sync";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  try {
    return Response.json(await syncResults({ from: url.searchParams.get("from") ?? undefined, to: url.searchParams.get("to") ?? undefined }));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Sync failed" }, { status: 502 });
  }
}
