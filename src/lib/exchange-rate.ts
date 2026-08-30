export type BorsaPrice = {
  id: number;
  buy_rate: string;
  sell_rate: string;
};

export const BORSA_USD_IQD_ID = 1;

export function parseBorsaRate(value: string): number {
  const normalized = value.replace(/,/g, "").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function fetchUsdIqdSellRate(): Promise<number> {
  const response = await fetch("https://borsa-alam.com/get_prices.php", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rate.");
  }

  const prices = (await response.json()) as BorsaPrice[];
  const usdIqd = prices.find((price) => price.id === BORSA_USD_IQD_ID);

  if (!usdIqd) {
    throw new Error("USD/IQD rate not found.");
  }

  return parseBorsaRate(usdIqd.sell_rate);
}
