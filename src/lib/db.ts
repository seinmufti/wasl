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
    this.version(2).stores({
      invoices: "id, createdAt",
      settings: "id",
      customers: "id, createdAt, name",
    });
    this.version(3).stores({
      invoices: "id, createdAt",
      settings: "id",
      customers: "id, createdAt, &name",
    });
    this.version(4).stores({
      invoices: "id, createdAt",
      settings: "id",
    });
  }
}

let db: WaslDB | null = null;

function getDb(): WaslDB {
  if (typeof indexedDB === "undefined") {
    throw new Error("IndexedDB is not available in this browser.");
  }
  if (!db) {
    db = new WaslDB();
  }
  return db;
}

async function withDb<T>(fallback: T, run: (database: WaslDB) => Promise<T>) {
  try {
    return await run(getDb());
  } catch (error) {
    console.error("Wasl database error:", error);
    return fallback;
  }
}

const DEFAULT_SETTINGS: AppSettings = {
  id: "settings",
  language: "en",
  companyLogo: null,
};

export async function getSettings(): Promise<AppSettings> {
  return withDb(DEFAULT_SETTINGS, async (database) => {
    const existing = await database.settings.get("settings");
    if (existing) return existing;
    await database.settings.put(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  });
}

export async function updateSettings(
  patch: Partial<Omit<AppSettings, "id">>,
): Promise<AppSettings> {
  const current = await getSettings();
  const next = { ...current, ...patch };
  return withDb(next, async (database) => {
    await database.settings.put(next);
    return next;
  });
}

export async function setLanguage(language: Locale) {
  return updateSettings({ language });
}

export async function setCompanyLogo(companyLogo: string | null) {
  return updateSettings({ companyLogo });
}

export async function nextInvoiceId(): Promise<string> {
  return withDb("WASL-0001", async (database) => {
    const ids = await database.invoices.toCollection().primaryKeys();
    let max = 0;
    for (const id of ids) {
      const match = String(id).match(/^WASL-(\d+)$/);
      if (match) max = Math.max(max, Number(match[1]));
    }
    return `WASL-${String(max + 1).padStart(4, "0")}`;
  });
}

export async function listInvoices(): Promise<Invoice[]> {
  return withDb([], async (database) =>
    database.invoices.orderBy("createdAt").reverse().toArray(),
  );
}

export async function getInvoice(id: string): Promise<Invoice | undefined> {
  return withDb(undefined, async (database) => database.invoices.get(id));
}

export async function saveInvoice(invoice: Invoice): Promise<void> {
  await withDb(undefined, async (database) => {
    await database.invoices.put(invoice);
  });
}

export async function deleteInvoice(id: string): Promise<void> {
  await withDb(undefined, async (database) => {
    await database.invoices.delete(id);
  });
}
