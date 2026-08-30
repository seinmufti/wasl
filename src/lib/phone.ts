import { extractWesternDigits } from "@/lib/digits";

export const IRAQ_NATIONAL_PHONE_LENGTH = 10;

export function parseLocalPhoneDigits(value: string): string {
  const digits = extractWesternDigits(value);
  if (!digits) return "";

  if (digits.startsWith("964")) {
    return digits.slice(3, 3 + IRAQ_NATIONAL_PHONE_LENGTH);
  }

  if (digits.startsWith("0")) {
    return digits.slice(1, 1 + IRAQ_NATIONAL_PHONE_LENGTH);
  }

  return digits.slice(0, IRAQ_NATIONAL_PHONE_LENGTH);
}

export function formatStoredPhone(nationalDigits: string): string {
  const digits = extractWesternDigits(nationalDigits).slice(0, IRAQ_NATIONAL_PHONE_LENGTH);
  return digits ? `+964${digits}` : "";
}

export function splitNationalPhone(nationalDigits: string): [string, string, string] {
  const digits = extractWesternDigits(nationalDigits).slice(0, IRAQ_NATIONAL_PHONE_LENGTH);
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)];
}

export function joinNationalPhone(parts: [string, string, string]): string {
  return extractWesternDigits(parts.join("")).slice(0, IRAQ_NATIONAL_PHONE_LENGTH);
}

function padPhoneSegment(segment: string, length: number): string {
  return segment.padEnd(length, "_");
}

export function formatNationalPhoneMask(nationalDigits: string): string {
  const digits = extractWesternDigits(nationalDigits).slice(0, IRAQ_NATIONAL_PHONE_LENGTH);
  const p1 = padPhoneSegment(digits.slice(0, 3), 3);
  const p2 = padPhoneSegment(digits.slice(3, 6), 3);
  const p3 = padPhoneSegment(digits.slice(6, 10), 4);
  return `${p1}-${p2}-${p3}`;
}

export const PHONE_ZERO_PLACEHOLDER = "000-000-0000";
export const PHONE_EMPTY_MASK = formatNationalPhoneMask("");

export function formatNationalPhoneDashed(nationalDigits: string): string {
  const [p1, p2, p3] = splitNationalPhone(nationalDigits);
  if (!p1) return "";
  if (!p2) return p1;
  if (!p3) return `${p1}-${p2}`;
  return `${p1}-${p2}-${p3}`;
}

export function formatPhoneDisplay(stored: string): string {
  if (!stored) return "";

  const national = parseLocalPhoneDigits(stored);
  if (!national) return stored;

  const dashed = formatNationalPhoneDashed(national);
  return dashed ? `+964 ${dashed}` : "+964";
}
