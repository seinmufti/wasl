import Dexie, { type EntityTable } from "dexie";
import type { AppSettings, Invoice, Locale } from "@/lib/types";

class WaslDB extends Dexie {
  invoices!: EntityTable<Invoice, "id">;
  settings!: EntityTable<AppSettings, "id">;

  constructor() {
    super("wasl");
    this.version(1).stores({
      invoices: "id, createdAt",
      settings: "id",
    });
  }
}

export const db = new WaslDB();

const DEFAULT_SETTINGS: AppSettings = {
  id: "settings",
  language: "en",
  companyLogo: null,
};

export async function getSettings(): Promise<AppSettings> {
  const existing = await db.settings.get("settings");
  if (existing) return existing;
  await db.settings.put(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

export async function updateSettings(
  patch: Partial<Omit<AppSettings, "id">>,
): Promise<AppSettings> {
  const current = await getSettings();
  const next = { ...current, ...patch };
  await db.settings.put(next);
  return next;
}

export async function setLanguage(language: Locale) {
  return updateSettings({ language });
}

export async function setCompanyLogo(companyLogo: string | null) {
  return updateSettings({ companyLogo });
}

export async function nextInvoiceId(): Promise<string> {
  const ids = await db.invoices.toCollection().primaryKeys();
  let max = 0;
  for (const id of ids) {
    const match = String(id).match(/^WASL-(\d+)$/);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `WASL-${String(max + 1).padStart(4, "0")}`;
}

export async function listInvoices(): Promise<Invoice[]> {
  return db.invoices.orderBy("createdAt").reverse().toArray();
}

export async function getInvoice(id: string): Promise<Invoice | undefined> {
  return db.invoices.get(id);
}

export async function saveInvoice(invoice: Invoice): Promise<void> {
  await db.invoices.put(invoice);
}

export async function deleteInvoice(id: string): Promise<void> {
  await db.invoices.delete(id);
}
