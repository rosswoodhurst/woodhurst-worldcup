import { getStandings } from "@/lib/data";
import { generateWhatsAppTable } from "@/lib/whatsapp";

export async function GET() {
  try { return new Response(generateWhatsAppTable(await getStandings()), { headers: { "content-type": "text/plain; charset=utf-8" } }); }
  catch { return new Response("Database unavailable.", { status: 503 }); }
}
