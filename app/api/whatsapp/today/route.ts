import { getFixtures } from "@/lib/data";
import { generateWhatsAppFixtures } from "@/lib/whatsapp";

export async function GET() {
  try { return new Response(generateWhatsAppFixtures(await getFixtures()), { headers: { "content-type": "text/plain; charset=utf-8" } }); }
  catch { return new Response("Database unavailable.", { status: 503 }); }
}
