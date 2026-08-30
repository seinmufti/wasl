"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, FileImage, FileText, Loader2, Share2, X } from "lucide-react";
import { ExportPreviewViewport } from "@/components/export-preview-viewport";
import { InvoiceExport } from "@/components/invoice-export";
import { useSettings } from "@/components/settings-provider";
import { Button } from "@/components/ui/button";
import { captureA4, dataUrlToBlob, downloadBlob, imageToPdf, shareBlob } from "@/lib/export";
import { formatInvoiceDisplayId } from "@/lib/invoice-id";
import { LANGUAGE_OPTIONS, type Invoice, type Locale } from "@/lib/types";
import { LanguageFlag } from "@/components/language-flag";

type ExportAction = "download" | "share";
type ExportKind = "pdf" | "image";
type ExportBusy = `${ExportAction}:${ExportKind}` | null;

function exportBusyKey(action: ExportAction, kind: ExportKind): ExportBusy {
  return `${action}:${kind}`;
}

export function ExportDialog({
  invoice,
  open,
  onOpenChange,
}: {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t, language, companyLogo, companyName, companyPhone, companyEmail, companySignature } =
    useSettings();
  const [exportLocale, setExportLocale] = useState<Locale>(language);
  const [busy, setBusy] = useState<ExportBusy>(null);
  const [error, setError] = useState("");
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setExportLocale(language);
    setError("");
  }, [open, language]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onOpenChange(false);
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [open, onOpenChange]);

  const exportLanguageLabel: Record<Locale, string> = {
    en: t("english"),
    ckb: t("kurdish"),
    ar: t("arabic"),
  };

  async function exportAs(action: ExportAction, kind: ExportKind) {
    const node = exportRef.current;
    if (!node || !invoice) return;
    const busyKey = exportBusyKey(action, kind);
    setBusy(busyKey);
    setError("");
    try {
      await document.fonts.ready;
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
      const dataUrl = await captureA4(node, kind === "pdf" ? "jpeg" : "png");
      const blob =
        kind === "image" ? dataUrlToBlob(dataUrl) : imageToPdf(dataUrl);
      const filename =
        kind === "image" ? `${invoice.id}.png` : `${invoice.id}.pdf`;

      if (action === "download") {
        await downloadBlob(blob, filename);
      } else {
        await shareBlob(blob, filename, invoice.id);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      if (
        action === "share" &&
        error instanceof Error &&
        error.message === "Share not supported"
      ) {
        setError(t("shareNotSupported"));
      } else {
        setError(t("exportFailed"));
      }
    } finally {
      setBusy(null);
    }
  }

  function renderLanguageButtons() {
    return (
      <div className="grid shrink-0 grid-cols-3 gap-1.5 sm:gap-2">
        {LANGUAGE_OPTIONS.map(({ locale, flag }) => (
          <Button
            key={locale}
            type="button"
            variant={exportLocale === locale ? "default" : "outline"}
            className="h-auto min-h-11 min-w-0 justify-center gap-1.5 whitespace-normal border-white/20 bg-white/10 px-2 py-2 text-white hover:bg-white/20 hover:text-white data-[variant=default]:border-transparent data-[variant=default]:bg-white data-[variant=default]:text-[#525659]"
            onClick={() => setExportLocale(locale)}
          >
            <LanguageFlag flag={flag} size="sm" />
            <span className="min-w-0 text-center text-xs leading-snug font-medium break-words">
              {exportLanguageLabel[locale]}
            </span>
          </Button>
        ))}
      </div>
    );
  }

  function renderExportCard(
    action: ExportAction,
    title: string,
    TitleIcon: typeof Download,
  ) {
    const disabled = !invoice || busy !== null;
    const pdfBusy = busy === exportBusyKey(action, "pdf");
    const imageBusy = busy === exportBusyKey(action, "image");
    const formatButtonClass =
      "flex h-auto min-h-11 flex-1 flex-col gap-1 bg-white px-2 py-2 text-[#525659] hover:bg-white/90";

    return (
      <div
        role="group"
        aria-label={title}
        className="flex flex-col items-center gap-2 rounded-xl border border-white/15 bg-white/10 p-2"
      >
        <div className="flex items-center gap-1.5 text-sm font-medium text-white">
          <TitleIcon className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          <span>{title}</span>
        </div>
        <div className="flex w-full items-stretch justify-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className={formatButtonClass}
            disabled={disabled}
            aria-label={`${title} ${t("pdf")}`}
            onClick={() => exportAs(action, "pdf")}
          >
            {pdfBusy ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <FileText className="size-5" />
            )}
            <span className="text-xs font-medium">{t("pdf")}</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            className={formatButtonClass}
            disabled={disabled}
            aria-label={`${title} ${t("image")}`}
            onClick={() => exportAs(action, "image")}
          >
            {imageBusy ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <FileImage className="size-5" />
            )}
            <span className="text-xs font-medium">{t("image")}</span>
          </Button>
        </div>
      </div>
    );
  }

  function renderExportActions() {
    return (
      <div className="shrink-0 rounded-xl border border-white/10 bg-[#464a4d] p-2 px-3 pb-2 sm:px-4">
        <div className="grid grid-cols-2 gap-2">
          {renderExportCard("download", t("download"), Download)}
          {renderExportCard("share", t("share"), Share2)}
        </div>
      </div>
    );
  }

  if (!open || !invoice || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex flex-col bg-[#525659] pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="flex shrink-0 flex-col gap-4 px-3 pb-2 sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium text-white/90">
            {formatInvoiceDisplayId(invoice.id)}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-white hover:bg-white/10 hover:text-white"
            onClick={() => onOpenChange(false)}
            aria-label={t("back")}
          >
            <X />
          </Button>
        </div>
        {renderLanguageButtons()}
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden px-3 sm:px-4">
        <ExportPreviewViewport
          invoice={invoice}
          locale={exportLocale}
          companyLogo={companyLogo}
          companyName={companyName}
          companyPhone={companyPhone}
          companyEmail={companyEmail}
          companySignature={companySignature}
          maxZoom={4}
          active={open}
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 -z-10 opacity-[0.01]"
      >
        <div
          ref={exportRef}
          className="bg-white"
          style={{ width: "210mm", height: "297mm" }}
        >
          <InvoiceExport
            invoice={invoice}
            locale={exportLocale}
            companyLogo={companyLogo}
            companyName={companyName}
            companyPhone={companyPhone}
            companyEmail={companyEmail}
            companySignature={companySignature}
          />
        </div>
      </div>

      <div className="mt-auto shrink-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4">
        {error ? (
          <p className="mb-2 text-sm text-red-300">{error}</p>
        ) : null}
        {renderExportActions()}
      </div>
    </div>,
    document.body,
  );
}
