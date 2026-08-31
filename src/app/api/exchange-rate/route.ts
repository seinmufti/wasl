import { fetchUsdIqdSellRate } from "@/lib/exchange-rate";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sellRate = await fetchUsdIqdSellRate();
    return Response.json({ sellRate });
  } catch (error) {
    console.error("exchange-rate", error);
    return Response.json({ sellRate: 0 }, { status: 502 });
  }
}
