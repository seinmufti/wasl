"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ArrowLeft, Settings } from "lucide-react";
import { BottomNav, isTabRoute } from "@/components/bottom-nav";
import { CompanyMark } from "@/components/company-mark";
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
import { fileToDataUrl } from "@/lib/export";
import { LANGUAGE_OPTIONS } from "@/lib/types";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t, language, setLanguage, companyLogo, setCompanyLogo, dir } =
    useSettings();
  const pathname = usePathname();
  const showBack = !isTabRoute(pathname);
  const isHome = pathname === "/";
  const pageTitle = t(pageTitleKey(pathname));
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const isDark = (theme ?? resolvedTheme) === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  async function onLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    await setCompanyLogo(dataUrl);
  }

  return (
    <div className="h-dvh overflow-hidden bg-muted">
      <ScrollToTop />
      <div className="mx-auto flex h-dvh w-full max-w-[430px] flex-col bg-background shadow-sm">
        <header className="z-20 grid h-14 shrink-0 grid-cols-[auto_1fr_3rem] items-center border-b border-primary-foreground/10 bg-primary px-4 text-primary-foreground">
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="justify-self-end text-primary-foreground hover:bg-primary-foreground/10"
            aria-label={t("settings")}
            onClick={() => setOpen(true)}
          >
            <Settings className="size-6" />
          </Button>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>

        <BottomNav />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={dir === "rtl" ? "left" : "right"}
          className="w-[min(100%,20rem)]"
          showCloseButton
        >
          <SheetHeader>
            <SheetTitle>{t("settings")}</SheetTitle>
            <SheetDescription>{t("appName")}</SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-6 px-4">
            <section className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("appearance")}
              </p>
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
            </section>

            <Separator />

            <section className="space-y-3">
              <Label>{t("language")}</Label>
              <div className="grid gap-2">
                {LANGUAGE_OPTIONS.map(({ locale, label }) => (
                  <Button
                    key={locale}
                    type="button"
                    variant={language === locale ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setLanguage(locale)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <Label>{t("companyLogo")}</Label>
              <div className="flex items-center gap-3">
                {companyLogo ? (
                  <CompanyMark
                    src={companyLogo}
                    imgClassName="size-12 rounded-lg border"
                    className="size-12"
                  />
                ) : (
                  <div
                    className="size-12 shrink-0 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/30"
                    aria-hidden
                  />
                )}
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    {t("uploadLogo")}
                  </Button>
                  {companyLogo ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCompanyLogo(null)}
                    >
                      {t("removeLogo")}
                    </Button>
                  ) : null}
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onLogoChange}
              />
            </section>
          </div>

          <SheetFooter className="border-t">
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
