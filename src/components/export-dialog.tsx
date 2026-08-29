"use client";

import { useEffect, useRef, useState } from "react";
import { FileImage, FileText } from "lucide-react";
import { InvoiceExport } from "@/components/invoice-export";
import { useSettings } from "@/components/settings-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { captureA4, dataUrlToBlob, imageToPdf, shareOrDownload } from "@/lib/export";
import { LOCALES, type Invoice, type Locale } from "@/lib/types";

export function ExportDialog({
  invoice,
  open,
  onOpenChange,
}: {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t, language, companyLogo } = useSettings();
  const [exportLocale, setExportLocale] = useState<Locale>(language);
  const [busy, setBusy] = useState<"pdf" | "image" | null>(null);
  const [error, setError] = useState("");
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setExportLocale(language);
  }, [open, language]);

  async function exportAs(kind: "pdf" | "image") {
    const node = exportRef.current;
    if (!node || !invoice) return;
    setBusy(kind);
    setError("");
    try {
      const dataUrl = await captureA4(node, kind === "pdf" ? "jpeg" : "png");
      if (kind === "image") {
        await shareOrDownload(
          dataUrlToBlob(dataUrl),
          `${invoice.id}.png`,
          invoice.id,
        );
      } else {
        await shareOrDownload(imageToPdf(dataUrl), `${invoice.id}.pdf`, invoice.id);
      }
    } catch {
      setError(t("exportFailed"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(24rem,calc(100vw-1.5rem))]">
        <DialogHeader>
          <DialogTitle>{t("export")}</DialogTitle>
          <DialogDescription>{invoice?.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="export-language">{t("exportLanguage")}</Label>
          <Select
            value={exportLocale}
            onValueChange={(value) => setExportLocale(value as Locale)}
          >
            <SelectTrigger id="export-language" className="w-full">
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
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            disabled={!invoice || busy !== null}
            onClick={() => exportAs("pdf")}
          >
            <FileText />
            {busy === "pdf" ? t("generating") : t("pdf")}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!invoice || busy !== null}
            onClick={() => exportAs("image")}
          >
            <FileImage />
            {busy === "image" ? t("generating") : t("highResImage")}
          </Button>
        </div>

        {invoice ? (
          <div
            aria-hidden
            className="pointer-events-none fixed top-0 left-0"
            style={{ opacity: 0.01, zIndex: -1 }}
          >
            <div ref={exportRef}>
              <InvoiceExport
                invoice={invoice}
                locale={exportLocale}
                companyLogo={companyLogo}
              />
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
