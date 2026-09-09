import { fetchUsdIqdSellRate } from "@/lib/exchange-rate";

export const dynamic = "force-dynamic";
export const preferredRegion = "fra1";
export const maxDuration = 15;

export async function GET() {
  try {
    const sellRate = await fetchUsdIqdSellRate();
    return Response.json({ sellRate });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("exchange-rate", message);
    return Response.json({ sellRate: 0, error: message }, { status: 502 });
  }
}
