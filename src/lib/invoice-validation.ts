import type { MessageKey } from "@/lib/i18n";
import type { Invoice } from "@/lib/types";

export type InvoiceValidationIssue = {
  messageKey: MessageKey;
  fieldId: string;
};

export function findFirstInvoiceValidationIssue(
  invoice: Invoice,
): InvoiceValidationIssue | null {
  if (!invoice.customerName.trim()) {
    return { messageKey: "nameRequired", fieldId: "customer-name" };
  }

  for (const line of invoice.lines) {
    if (!line.description.trim()) {
      return { messageKey: "rowsRequired", fieldId: `desc-${line.id}` };
    }
    if (line.unitPrice <= 0) {
      return { messageKey: "rowsRequired", fieldId: `price-${line.id}` };
    }
  }

  return null;
}

export function focusInvoiceField(fieldId: string) {
  window.requestAnimationFrame(() => {
    const el = document.getElementById(fieldId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus({ preventScroll: true });
  });
}

export const INVALID_FIELD_RING =
  "border-destructive ring-3 ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/20";
