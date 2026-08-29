export type Locale = "en" | "ckb" | "ar";

export type InvoiceLine = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type Invoice = {
  id: string;
  createdAt: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  lines: InvoiceLine[];
  exchangeRate: number;
};

export type AppSettings = {
  id: "settings";
  language: Locale;
  companyLogo: string | null;
};

export const LOCALES: Locale[] = ["en", "ckb", "ar"];
export const RTL_LOCALES: Locale[] = ["ckb", "ar"];
