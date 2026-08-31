import { parseWesternInteger } from "@/lib/digits";

export type BorsaPrice = {
  id: number | string;
  buy_rate: string | number;
  sell_rate: string | number;
};

export const BORSA_USD_IQD_ID = 1;
export const BORSA_PRICES_URL = "https://borsa-alam.com/get_prices.php";

const BORSA_FETCH_HEADERS = {
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9,ar;q=0.8,ckb;q=0.7",
  Referer: "https://borsa-alam.com/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};

export function parseBorsaRate(value: string | number): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  return parseWesternInteger(value);
}

export function parseUsdIqdSellRate(prices: unknown): number {
  if (!Array.isArray(prices)) {
    throw new Error("Borsa ALAM response was not a price list.");
  }

  const usdIqd = prices.find(
    (price) => Number((price as BorsaPrice).id) === BORSA_USD_IQD_ID,
  ) as BorsaPrice | undefined;

  if (!usdIqd) {
    throw new Error("USD/IQD rate not found.");
  }

  const sellRate = parseBorsaRate(usdIqd.sell_rate);
  if (sellRate <= 0) {
    throw new Error("USD/IQD sell rate was empty.");
  }

  return sellRate;
}

async function fetchBorsaPrices(): Promise<BorsaPrice[]> {
  const response = await fetch(BORSA_PRICES_URL, {
    cache: "no-store",
    headers: BORSA_FETCH_HEADERS,
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    throw new Error(`Borsa ALAM request failed (${response.status}).`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();

  if (!contentType.includes("json") && body.trimStart().startsWith("<")) {
    throw new Error("Borsa ALAM returned HTML instead of JSON.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body) as unknown;
  } catch {
    throw new Error("Borsa ALAM response was not valid JSON.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Borsa ALAM response was not a price list.");
  }

  return parsed as BorsaPrice[];
}

export async function fetchUsdIqdSellRate(): Promise<number> {
  const prices = await fetchBorsaPrices();
  return parseUsdIqdSellRate(prices);
}

/** Browser-only fallback when the server proxy is blocked. */
export async function fetchUsdIqdSellRateFromBrowser(): Promise<number> {
  const response = await fetch(BORSA_PRICES_URL, {
    cache: "no-store",
    headers: {
      Accept: "application/json, text/plain, */*",
    },
  });

  if (!response.ok) {
    throw new Error(`Borsa ALAM request failed (${response.status}).`);
  }

  return parseUsdIqdSellRate(await response.json());
}

export async function loadUsdIqdSellRate(): Promise<number> {
  if (typeof window !== "undefined") {
    try {
      const directRate = await fetchUsdIqdSellRateFromBrowser();
      if (directRate > 0) return directRate;
    } catch {
      // CORS or network — fall back to same-origin API route.
    }
  }

  const response = await fetch("/api/exchange-rate", { cache: "no-store" });
  const payload = (await response.json()) as { sellRate?: number };
  const sellRate = Number(payload.sellRate) || 0;

  if (sellRate > 0) return sellRate;

  throw new Error("Exchange rate unavailable.");
}
