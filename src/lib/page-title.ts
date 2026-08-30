import type { MessageKey } from "@/lib/i18n";

export function pageTitleKey(pathname: string): MessageKey {
  if (pathname === "/") return "invoices";
  if (pathname === "/new") return "invoice";
  if (pathname.startsWith("/invoice/")) return "invoice";
  return "appName";
}
