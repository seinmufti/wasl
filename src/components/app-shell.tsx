"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Settings } from "lucide-react";
import { WaslLogo } from "@/components/wasl-logo";
import { CompanyMark } from "@/components/company-mark";
import { NordlysLogo } from "@/components/nordlys-logo";
import { ScrollToTop } from "@/components/scroll-to-top";
import { useSettings } from "@/components/settings-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { LOCALES, type Locale } from "@/lib/types";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t, language, setLanguage, companyLogo, setCompanyLogo, dir } =
    useSettings();
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
        <header className="z-20 grid h-12 shrink-0 grid-cols-[2.5rem_1fr_2.5rem] items-center border-b bg-background px-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("settings")}
            onClick={() => setOpen(true)}
          >
            <Settings className="size-5" />
          </Button>
          <div className="flex items-center justify-center gap-2">
            <WaslLogo />
            <span className="text-base font-semibold tracking-tight">
              {t("appName")}
            </span>
          </div>
          <span className="size-10 shrink-0" aria-hidden />
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={dir === "rtl" ? "right" : "left"}
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
              <Label htmlFor="language">{t("language")}</Label>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value as Locale)}
              >
                <SelectTrigger id="language" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {LOCALES.map((locale) => (
                    <SelectItem key={locale} value={locale}>
                      {locale === "en"
                        ? t("english")
                        : locale === "ckb"
                          ? t("kurdish")
                          : t("arabic")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>

            <Separator />

            <section className="space-y-3">
              <Label>{t("companyLogo")}</Label>
              <div className="flex items-center gap-3">
                <CompanyMark
                  src={companyLogo}
                  imgClassName="size-12 rounded-lg border"
                  className="size-12"
                />
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
