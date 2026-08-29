"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getSettings, setCompanyLogo, setLanguage } from "@/lib/db";
import { isRtl, t, type MessageKey } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type SettingsContextValue = {
  ready: boolean;
  language: Locale;
  companyLogo: string | null;
  dir: "ltr" | "rtl";
  setLanguage: (language: Locale) => Promise<void>;
  setCompanyLogo: (logo: string | null) => Promise<void>;
  t: (key: MessageKey) => string;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [language, setLanguageState] = useState<Locale>("en");
  const [companyLogo, setLogoState] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSettings().then((settings) => {
      if (cancelled) return;
      setLanguageState(settings.language);
      setLogoState(settings.companyLogo);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl(language) ? "rtl" : "ltr";
  }, [language, ready]);

  const changeLanguage = useCallback(async (next: Locale) => {
    setLanguageState(next);
    await setLanguage(next);
  }, []);

  const changeLogo = useCallback(async (next: string | null) => {
    setLogoState(next);
    await setCompanyLogo(next);
  }, []);

  const translate = useCallback((key: MessageKey) => t(language, key), [language]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ready,
      language,
      companyLogo,
      dir: isRtl(language) ? "rtl" : "ltr",
      setLanguage: changeLanguage,
      setCompanyLogo: changeLogo,
      t: translate,
    }),
    [ready, language, companyLogo, changeLanguage, changeLogo, translate],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
