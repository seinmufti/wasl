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
  exchangeRate2: number;
};

export type AppSettings = {
  id: "settings";
  language: Locale;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyLogo: string | null;
  companySignature: string | null;
  debugMode: boolean;
};

export const LOCALES: Locale[] = ["en", "ckb", "ar"];
export const RTL_LOCALES: Locale[] = ["ckb", "ar"];

export type LanguageFlagId = "en" | "kurdistan" | "iraq";

export const LANGUAGE_OPTIONS: {
  locale: Locale;
  label: string;
  flag: LanguageFlagId;
}[] = [
  { locale: "en", label: "English", flag: "en" },
  { locale: "ckb", label: "کوردی (سۆرانی)", flag: "kurdistan" },
  { locale: "ar", label: "العربية", flag: "iraq" },
];
