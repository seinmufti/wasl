"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { HundredDollarBill } from "@/components/hundred-dollar-bill";
import { ExportDialog } from "@/components/export-dialog";
import { FloatingLabelInput } from "@/components/floating-label-input";
import { InvoiceDateTimeInput } from "@/components/invoice-datetime-input";
import { ReadOnlyField } from "@/components/read-only-field";
import { LoadingCircle } from "@/components/pull-to-refresh";
import { IraqiPhoneInput } from "@/components/iraqi-phone-input";
import { NumericInput } from "@/components/numeric-input";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/components/settings-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getInvoice, nextInvoiceId, saveInvoice } from "@/lib/db";
import {
  formatIqd,
  formatUsd,
  grandTotalIqd,
  grandTotalUsd,
  lineTotal,
} from "@/lib/money";
import { cn, createId } from "@/lib/utils";
import type { Invoice, InvoiceLine } from "@/lib/types";

function emptyLine(): InvoiceLine {
  return {
    id: createId(),
    description: "",
    quantity: 1,
    unitPrice: 0,
  };
}

function emptyInvoice(id: string): Invoice {
  return {
    id,
    createdAt: Date.now(),
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    lines: [emptyLine()],
    exchangeRate: 0,
    exchangeRate2: 0,
  };
}

export function InvoiceForm({
  initial,
  openExportOnMount = false,
}: {
  initial?: Invoice;
  openExportOnMount?: boolean;
}) {
  const router = useRouter();
  const { t } = useSettings();
  const [invoice, setInvoice] = useState<Invoice | null>(initial ?? null);
  const [ready, setReady] = useState(Boolean(initial));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    if (initial) {
      setInvoice(initial);
      setReady(true);
      return;
    }

    let cancelled = false;
    nextInvoiceId()
      .then((id) => {
        if (cancelled) return;
        setInvoice(emptyInvoice(id));
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setInvoice(emptyInvoice("WASL-0001"));
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [initial]);

  useEffect(() => {
    if (openExportOnMount && initial) {
      setExportOpen(true);
      router.replace(`/invoice/${initial.id}`, { scroll: false });
    }
  }, [openExportOnMount, initial, router]);

  useEffect(() => {
    if (!ready || !invoice) return;

    let cancelled = false;

    fetch("/api/exchange-rate")
      .then((response) => response.json())
      .then(({ sellRate }: { sellRate: number }) => {
        if (cancelled || !sellRate) return;
        setInvoice((current) =>
          current ? { ...current, exchangeRate2: sellRate } : current,
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [ready, invoice?.id]);

  const usd = useMemo(
    () => (invoice ? grandTotalUsd(invoice) : 0),
    [invoice],
  );
  const iqd = useMemo(
    () => (invoice ? grandTotalIqd(invoice) : 0),
    [invoice],
  );

  function patch(partial: Partial<Invoice>) {
    setInvoice((current) => (current ? { ...current, ...partial } : current));
  }

  function patchLine(id: string, partial: Partial<InvoiceLine>) {
    setInvoice((current) =>
      current
        ? {
            ...current,
            lines: current.lines.map((line) =>
              line.id === id ? { ...line, ...partial } : line,
            ),
          }
        : current,
    );
  }

  async function onSave() {
    if (!invoice) return;
    setError("");
    setSaving(true);
    try {
      const next = { ...invoice, customerName: invoice.customerName.trim() };
      await saveInvoice(next);
      setInvoice(next);
      if (!initial) {
        router.replace(`/invoice/${next.id}?export=1`);
        return;
      }
      setExportOpen(true);
    } finally {
      setSaving(false);
    }
  }

  const handleRefresh = useCallback(async () => {
    if (initial) {
      const found = await getInvoice(initial.id);
      if (found) {
        setInvoice(found);
        setError("");
      }
      return;
    }

    const id = await nextInvoiceId();
    setInvoice(emptyInvoice(id));
    setError("");
    setReady(true);
  }, [initial]);

  return (
    <PageShell
      onRefresh={handleRefresh}
      footer={
        <Button
          type="button"
          className="w-full"
          onClick={onSave}
          disabled={!ready || saving}
        >
          {saving ? t("saving") : t("export")}
        </Button>
      }
    >
      {!ready || !invoice ? (
        <div className="flex justify-center py-16">
          <LoadingCircle progress={1} spinning />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0 space-y-1.5">
              <Label htmlFor="invoice-id">{t("invoiceId")}</Label>
              <ReadOnlyField
                id="invoice-id"
                className="flex items-center"
              >
                <span className="min-w-0 truncate">{invoice.id}</span>
              </ReadOnlyField>
            </div>
            <div className="min-w-0 space-y-1.5">
              <Label htmlFor="invoice-datetime">{t("dateTime")}</Label>
              <InvoiceDateTimeInput
                id="invoice-datetime"
                value={invoice.createdAt}
                readOnly
              />
            </div>
          </div>

          <Separator />

          <FloatingLabelInput
            id="customer-name"
            label={t("name")}
            value={invoice.customerName}
            onChange={(event) => patch({ customerName: event.target.value })}
            autoComplete="name"
          />

          <IraqiPhoneInput
            id="customer-phone"
            ariaLabel={t("phone")}
            value={invoice.customerPhone}
            onChange={(value) => patch({ customerPhone: value })}
          />

          <FloatingLabelInput
            id="customer-address"
            label={t("address")}
            value={invoice.customerAddress}
            onChange={(event) =>
              patch({ customerAddress: event.target.value })
            }
            autoComplete="street-address"
          />

          <Separator />

          <section className="space-y-3">
            <p className="text-base font-medium">{t("items")}</p>
            {invoice.lines.map((line, index) => (
              <div key={line.id} className="space-y-3 rounded-xl border p-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 shrink-0 text-base font-medium tabular-nums text-foreground">
                    #{index + 1}
                  </span>
                  <Input
                    className="min-w-0 flex-1"
                    placeholder={t("description")}
                    value={line.description}
                    onChange={(event) =>
                      patchLine(line.id, { description: event.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-2">
                  <div className="space-y-1">
                    <Label htmlFor={`qty-${line.id}`} className="text-sm">
                      {t("quantity")}
                    </Label>
                    <NumericInput
                      id={`qty-${line.id}`}
                      clearOnFocusWhen={1}
                      value={line.quantity}
                      onValueChange={(quantity) =>
                        patchLine(line.id, { quantity })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`price-${line.id}`} className="text-sm">
                      {t("unitPrice")}
                    </Label>
                    <NumericInput
                      id={`price-${line.id}`}
                      value={line.unitPrice}
                      onValueChange={(unitPrice) =>
                        patchLine(line.id, { unitPrice })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`total-${line.id}`} className="text-sm">
                      {t("rowTotal")}
                    </Label>
                    <Input
                      id={`total-${line.id}`}
                      readOnly
                      tabIndex={-1}
                      className="tabular-nums read-only:border-input/70 read-only:bg-muted/70 read-only:text-muted-foreground dark:read-only:bg-input/60"
                      value={lineTotal(line) || ""}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-6 text-destructive/80 hover:bg-destructive/10 hover:text-destructive dark:text-destructive/90 dark:hover:bg-destructive/20"
                    aria-label={t("removeRow")}
                    onClick={() => {
                      if (invoice.lines.length === 1) {
                        patchLine(line.id, {
                          description: "",
                          quantity: 1,
                          unitPrice: 0,
                        });
                        return;
                      }
                      patch({
                        lines: invoice.lines.filter(
                          (item) => item.id !== line.id,
                        ),
                      });
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full border-input/60 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground dark:bg-input/60"
              onClick={() => patch({ lines: [...invoice.lines, emptyLine()] })}
            >
              <Plus />
              {t("addRow")}
            </Button>
          </section>

          <section className="space-y-3 rounded-xl border p-4">
            <div className="flex items-center justify-between text-base">
              <span>{t("grandTotal")}</span>
              <span className="tabular-nums font-medium">
                {formatUsd(usd)} {t("usd")}
              </span>
            </div>
            <div className="space-y-1.5">
              <Label className="font-medium">{t("exchangeRate")}</Label>
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] grid-rows-[auto_auto_auto] items-center gap-x-2 gap-y-1.5">
                <HundredDollarBill
                  id="rate-usd-2"
                  className="row-span-3 self-center"
                />
                <span className="col-start-3 row-start-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                  Borsa ALAM
                </span>
                <span className="col-start-2 row-span-2 row-start-2 flex items-center self-stretch px-0.5 text-base font-medium text-muted-foreground">
                  =
                </span>
                <ReadOnlyField
                  id="rate-iqd-2"
                  className={cn(
                    "col-start-3 row-start-2 flex h-9 min-h-9 items-center justify-center border-amber-300 bg-amber-50 px-2 py-0 text-amber-600 hover:bg-amber-100 active:bg-amber-100/80 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-950/60",
                  )}
                  onClick={() =>
                    patch({ exchangeRate: invoice.exchangeRate2 ?? 0 })
                  }
                >
                  <span className="w-full text-center text-lg font-semibold leading-none tabular-nums">
                    {formatIqd(invoice.exchangeRate2 ?? 0)}
                  </span>
                </ReadOnlyField>
                <div className="col-start-3 row-start-3 flex h-9 min-h-9 items-center overflow-hidden rounded-xl border border-input bg-transparent focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30">
                  <NumericInput
                    id="rate-iqd"
                    className="h-9 min-h-9 w-full border-0 bg-transparent px-2 py-0 text-center text-lg font-semibold leading-none shadow-none focus-visible:border-transparent focus-visible:ring-0"
                    integer
                    value={invoice.exchangeRate}
                    onValueChange={(exchangeRate) => patch({ exchangeRate })}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-base font-semibold">
              <span>{t("iqdTotal")}</span>
              <span className="tabular-nums">
                {formatIqd(iqd)} {t("iqd")}
              </span>
            </div>
          </section>

          {error ? <p className="text-base text-destructive">{error}</p> : null}
        </div>
      )}

      {invoice ? (
        <ExportDialog
          invoice={invoice}
          open={exportOpen}
          onOpenChange={setExportOpen}
        />
      ) : null}
    </PageShell>
  );
}
