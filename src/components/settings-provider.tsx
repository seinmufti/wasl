"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getSettings,
  setCompanyLogo,
  setDebugMode,
  setLanguage,
  updateSettings,
} from "@/lib/db";
import { isRtl, t, type MessageKey } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type CompanyProfilePatch = Partial<{
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyLogo: string | null;
  companySignature: string | null;
}>;

type SettingsContextValue = {
  ready: boolean;
  language: Locale;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyLogo: string | null;
  companySignature: string | null;
  debugMode: boolean;
  dir: "ltr" | "rtl";
  setLanguage: (language: Locale) => Promise<void>;
  setCompanyLogo: (logo: string | null) => Promise<void>;
  updateCompanyProfile: (patch: CompanyProfilePatch) => Promise<void>;
  setDebugMode: (enabled: boolean) => Promise<void>;
  t: (key: MessageKey) => string;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [language, setLanguageState] = useState<Locale>("en");
  const [companyName, setCompanyNameState] = useState("Wasl");
  const [companyPhone, setCompanyPhoneState] = useState("");
  const [companyEmail, setCompanyEmailState] = useState("");
  const [companyLogo, setLogoState] = useState<string | null>(null);
  const [companySignature, setSignatureState] = useState<string | null>(null);
  const [debugMode, setDebugModeState] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSettings()
      .then(async (settings) => {
        if (cancelled) return;
        let debug = settings.debugMode ?? false;
        try {
          const response = await fetch("/api/debug-mode");
          if (response.ok) {
            const { projectDebug } = (await response.json()) as {
              projectDebug: boolean;
            };
            if (projectDebug && !debug) {
              debug = true;
              await setDebugMode(true);
            }
          }
        } catch {
          // ignore
        }
        setLanguageState(settings.language);
        setCompanyNameState(settings.companyName ?? "Wasl");
        setCompanyPhoneState(settings.companyPhone ?? "");
        setCompanyEmailState(settings.companyEmail ?? "");
        setLogoState(settings.companyLogo);
        setSignatureState(settings.companySignature ?? null);
        setDebugModeState(debug);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
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

  const updateCompanyProfile = useCallback(async (patch: CompanyProfilePatch) => {
    if (patch.companyName !== undefined) setCompanyNameState(patch.companyName);
    if (patch.companyPhone !== undefined) setCompanyPhoneState(patch.companyPhone);
    if (patch.companyEmail !== undefined) setCompanyEmailState(patch.companyEmail);
    if (patch.companyLogo !== undefined) setLogoState(patch.companyLogo);
    if (patch.companySignature !== undefined) {
      setSignatureState(patch.companySignature);
    }
    await updateSettings(patch);
  }, []);

  const changeDebugMode = useCallback(async (enabled: boolean) => {
    setDebugModeState(enabled);
    await setDebugMode(enabled);
    try {
      await fetch("/api/debug-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
    } catch {
      // Offline or API unavailable — in-app setting still works.
    }
  }, []);

  const translate = useCallback((key: MessageKey) => t(language, key), [language]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ready,
      language,
      companyName,
      companyPhone,
      companyEmail,
      companyLogo,
      companySignature,
      debugMode,
      dir: isRtl(language) ? "rtl" : "ltr",
      setLanguage: changeLanguage,
      setCompanyLogo: changeLogo,
      updateCompanyProfile,
      setDebugMode: changeDebugMode,
      t: translate,
    }),
    [
      ready,
      language,
      companyName,
      companyPhone,
      companyEmail,
      companyLogo,
      companySignature,
      debugMode,
      changeLanguage,
      changeLogo,
      updateCompanyProfile,
      changeDebugMode,
      translate,
    ],
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
