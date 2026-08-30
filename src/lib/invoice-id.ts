/** User-facing invoice number from stored id (e.g. WASL-0001 → #0001). */
export function formatInvoiceDisplayId(id: string): string {
  const match = id.match(/^WASL-(\d+)$/i);
  if (match) return `#${match[1]}`;

  const trailingDigits = id.match(/(\d+)$/);
  if (trailingDigits) return `#${trailingDigits[1]}`;

  return id.startsWith("#") ? id : `#${id}`;
}
