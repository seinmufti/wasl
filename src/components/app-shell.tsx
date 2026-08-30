"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ArrowLeft, Settings } from "lucide-react";
import { BottomNav, isTabRoute } from "@/components/bottom-nav";
import { NordlysLogo } from "@/components/nordlys-logo";
import { WaslLogo } from "@/components/wasl-logo";
import { ScrollToTop } from "@/components/scroll-to-top";
import { useSettings } from "@/components/settings-provider";
import { pageTitleKey } from "@/lib/page-title";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { phoneShellSizeClass } from "@/lib/phone-shell";
import { LANGUAGE_OPTIONS } from "@/lib/types";
import { useDebugInvoiceFill } from "@/components/debug-invoice-fill-context";
import { LanguageFlag } from "@/components/language-flag";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t, language, setLanguage, debugMode, setDebugMode, dir } = useSettings();
  const pathname = usePathname();
  const showBack = !isTabRoute(pathname);
  const isHome = pathname === "/";
  const pageTitle = t(pageTitleKey(pathname));
  const isInvoiceForm =
    pathname === "/new" || pathname.startsWith("/invoice/");
  const { canFill, triggerDummyFill } = useDebugInvoiceFill();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isDark = (theme ?? resolvedTheme) === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-dvh w-full items-center justify-center overflow-hidden bg-muted">
      <ScrollToTop />
      <div
        className={`mx-auto flex flex-col overflow-hidden bg-background shadow-sm ${phoneShellSizeClass}`}
      >
        <header className="z-20 grid h-14 shrink-0 grid-cols-[auto_1fr_auto] items-center border-b border-primary-foreground/10 bg-primary px-4 text-primary-foreground">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/" aria-label={t("back")}>
                <ArrowLeft className="size-6 rtl:rotate-180" />
              </Link>
            </Button>
          ) : isHome ? (
            <WaslLogo inverted className="h-9" />
          ) : (
            <span className="size-11 shrink-0" aria-hidden />
          )}
          <h1 className="truncate text-center text-lg font-semibold tracking-tight">
            {pageTitle}
          </h1>
          <div className="flex items-center justify-self-end gap-0.5">
            {debugMode && isInvoiceForm && canFill ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-lg text-primary-foreground hover:bg-primary-foreground/10"
                aria-label={t("fillDummyData")}
                onClick={triggerDummyFill}
              >
                🤪
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              aria-label={t("settings")}
              onClick={() => setOpen(true)}
            >
              <Settings className="size-6" />
            </Button>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>

        <BottomNav />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={dir === "rtl" ? "left" : "right"}
          className="w-[min(100%,20rem)] gap-0 overflow-hidden p-0"
          showCloseButton
        >
          <SheetHeader className="shrink-0">
            <SheetTitle>{t("settings")}</SheetTitle>
            <SheetDescription>{t("appName")}</SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="flex flex-col gap-6 px-4 py-4">
            <section className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("language")}
              </p>
              <div className="grid gap-2">
                {LANGUAGE_OPTIONS.map(({ locale, label, flag }) => (
                  <Button
                    key={locale}
                    type="button"
                    variant={language === locale ? "default" : "outline"}
                    className="w-full justify-start gap-2"
                    onClick={() => setLanguage(locale)}
                  >
                    <LanguageFlag flag={flag} />
                    {label}
                  </Button>
                ))}
              </div>
            </section>

            <Separator />

            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="dark-mode">{t("darkMode")}</Label>
              <Switch
                id="dark-mode"
                checked={mounted && isDark}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="developer-mode">{t("developerMode")}</Label>
              <Switch
                id="developer-mode"
                checked={debugMode}
                onCheckedChange={(checked) => setDebugMode(checked)}
              />
            </div>
            </div>
          </div>

          <SheetFooter className="mt-0 shrink-0 border-t">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <NordlysLogo />
              <span>{t("developedBy")}</span>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
