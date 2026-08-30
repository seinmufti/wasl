import type { Invoice, InvoiceLine } from "@/lib/types";

export function lineTotal(line: InvoiceLine): number {
  const qty = Number(line.quantity) || 0;
  const price = Number(line.unitPrice) || 0;
  return qty * price;
}

export function grandTotalUsd(invoice: Pick<Invoice, "lines">): number {
  return invoice.lines.reduce((sum, line) => sum + lineTotal(line), 0);
}

export const EXCHANGE_RATE_USD_BASE = 100;

export function iqdPerUsd(exchangeRate: number): number {
  return (Number(exchangeRate) || 0) / EXCHANGE_RATE_USD_BASE;
}

export function hasExchangeRate(exchangeRate: number): boolean {
  return Number(exchangeRate) > 0;
}

export function grandTotalIqd(invoice: Pick<Invoice, "lines" | "exchangeRate">): number {
  return grandTotalUsd(invoice) * iqdPerUsd(invoice.exchangeRate);
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatIqd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(Number.isFinite(value) ? value : 0));
}

export function formatDate(timestamp: number, locale: string): string {
  return new Intl.DateTimeFormat(locale === "ckb" ? "ckb" : locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(timestamp);
}
