"use client";

import { ThemeProvider } from "next-themes";
import { DebugInvoiceFillProvider } from "@/components/debug-invoice-fill-context";
import { SettingsProvider } from "@/components/settings-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SettingsProvider>
        <DebugInvoiceFillProvider>{children}</DebugInvoiceFillProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
