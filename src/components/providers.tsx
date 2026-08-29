"use client";

import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "@/components/settings-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SettingsProvider>{children}</SettingsProvider>
    </ThemeProvider>
  );
}
