import { fetchUsdIqdSellRate } from "@/lib/exchange-rate";

export async function GET() {
  try {
    const sellRate = await fetchUsdIqdSellRate();
    return Response.json({ sellRate });
  } catch {
    return Response.json({ sellRate: 0 }, { status: 502 });
  }
}
