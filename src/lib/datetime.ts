import { toWesternDigits } from "@/lib/digits";

function to12Hour(hours24: number): { hours: number; period: "AM" | "PM" } {
  const period: "AM" | "PM" = hours24 >= 12 ? "PM" : "AM";
  let hours = hours24 % 12;
  if (hours === 0) hours = 12;
  return { hours, period };
}

function to24Hour(hours12: number, period: "AM" | "PM"): number {
  if (period === "AM") return hours12 === 12 ? 0 : hours12;
  return hours12 === 12 ? 12 : hours12 + 12;
}

export function formatInvoiceDateTime(timestamp: number): string {
  const { date, time } = splitInvoiceDateTime(timestamp);
  return `${date} ${time}`;
}

export function splitInvoiceDateTime(timestamp: number): {
  date: string;
  time: string;
} {
  const value = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, "0");
  const { hours, period } = to12Hour(value.getHours());

  return {
    date: `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${value.getFullYear()}`,
    time: `${pad(hours)}:${pad(value.getMinutes())} ${period}`,
  };
}

export function parseInvoiceDateTime(value: string): number | null {
  const normalized = toWesternDigits(value.trim());
  const match = normalized.match(
    /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
  );
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const hours12 = Number(match[4]);
  const minutes = Number(match[5]);
  const period = match[6].toUpperCase() as "AM" | "PM";

  if (hours12 < 1 || hours12 > 12) return null;

  const hours = to24Hour(hours12, period);

  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hours ||
    date.getMinutes() !== minutes
  ) {
    return null;
  }

  return date.getTime();
}
