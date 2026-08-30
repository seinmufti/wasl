const EASTERN_DIGIT_OFFSETS: Array<{ start: number; base: number }> = [
  { start: 0x0660, base: 0x0660 }, // Arabic-Indic ٠-٩
  { start: 0x06f0, base: 0x06f0 }, // Extended Arabic-Indic ۰-۹ (Kurdish/Persian keypads)
];

/** Convert Arabic/Kurdish numerals and separators to Western digits. */
export function toWesternDigits(value: string): string {
  let result = value;

  for (const { start } of EASTERN_DIGIT_OFFSETS) {
    for (let digit = 0; digit <= 9; digit++) {
      result = result.replaceAll(
        String.fromCharCode(start + digit),
        String(digit),
      );
    }
  }

  return result
    .replace(/\u066B/g, ".") // Arabic decimal separator
    .replace(/[\u066C\u060C,]/g, ""); // Arabic thousands separators
}

export function extractWesternDigits(value: string): string {
  return toWesternDigits(value).replace(/\D/g, "");
}

export function parseWesternNumber(value: string): number {
  const normalized = toWesternDigits(value.trim());
  if (!normalized) return 0;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function parseWesternInteger(value: string): number {
  const digits = extractWesternDigits(value);
  if (!digits) return 0;
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatWesternNumber(value: number): string {
  if (!Number.isFinite(value) || value === 0) return "";
  return String(value);
}

export function isPartialDecimalInput(value: string): boolean {
  const normalized = toWesternDigits(value.trim());
  return normalized === "" || /^\d*\.?\d*$/.test(normalized);
}

export function formatCommaInteger(value: number): string {
  if (!Number.isFinite(value) || value === 0) return "";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}
