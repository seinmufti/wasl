"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { ExportDialog } from "@/components/export-dialog";
import { InvoiceFormSkeleton } from "@/components/invoice-form-skeleton";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/components/settings-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { nextInvoiceId, saveInvoice } from "@/lib/db";
import {
  formatIqd,
  formatUsd,
  grandTotalIqd,
  grandTotalUsd,
  lineTotal,
} from "@/lib/money";
import type { Invoice, InvoiceLine } from "@/lib/types";

function emptyLine(): InvoiceLine {
  return {
    id: crypto.randomUUID(),
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
  const [saved, setSaved] = useState(Boolean(initial));
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    if (initial) {
      setInvoice(initial);
      setReady(true);
      return;
    }

    let cancelled = false;
    nextInvoiceId().then((id) => {
      if (cancelled) return;
      setInvoice(emptyInvoice(id));
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
    if (!invoice.customerName.trim()) {
      setError(t("nameRequired"));
      return;
    }
    setError("");
    setSaving(true);
    try {
      const next = { ...invoice, customerName: invoice.customerName.trim() };
      await saveInvoice(next);
      setInvoice(next);
      setSaved(true);
      if (!initial) {
        router.replace(`/invoice/${next.id}?export=1`);
        return;
      }
      setExportOpen(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell
      title={t("invoice")}
      backHref="/"
      footer={
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            className="h-11"
            onClick={onSave}
            disabled={!ready || saving}
          >
            {saving ? t("saving") : t("save")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11"
            disabled={!saved}
            onClick={() => setExportOpen(true)}
          >
            {t("export")}
          </Button>
        </div>
      }
    >
      {!ready || !invoice ? (
        <InvoiceFormSkeleton />
      ) : (
        <div className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="invoice-id">{t("invoiceId")}</Label>
            <Input id="invoice-id" value={invoice.id} readOnly />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="customer-name">{t("customerName")}</Label>
            <Input
              id="customer-name"
              value={invoice.customerName}
              onChange={(event) => patch({ customerName: event.target.value })}
              autoComplete="name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="customer-phone">{t("phone")}</Label>
            <Input
              id="customer-phone"
              type="tel"
              inputMode="tel"
              value={invoice.customerPhone}
              onChange={(event) => patch({ customerPhone: event.target.value })}
              autoComplete="tel"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="customer-address">{t("address")}</Label>
            <Textarea
              id="customer-address"
              rows={3}
              value={invoice.customerAddress}
              onChange={(event) =>
                patch({ customerAddress: event.target.value })
              }
            />
          </div>

          <section className="space-y-3">
            <p className="text-sm font-medium">{t("items")}</p>
            {invoice.lines.map((line) => (
              <div key={line.id} className="space-y-2 rounded-xl border p-3">
                <Input
                  placeholder={t("description")}
                  value={line.description}
                  onChange={(event) =>
                    patchLine(line.id, { description: event.target.value })
                  }
                />
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-2">
                  <div className="space-y-1">
                    <Label htmlFor={`qty-${line.id}`} className="text-xs">
                      {t("quantity")}
                    </Label>
                    <Input
                      id={`qty-${line.id}`}
                      type="number"
                      min={0}
                      inputMode="decimal"
                      value={line.quantity}
                      onChange={(event) =>
                        patchLine(line.id, {
                          quantity: Number(event.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`price-${line.id}`} className="text-xs">
                      {t("unitPrice")}
                    </Label>
                    <Input
                      id={`price-${line.id}`}
                      type="number"
                      min={0}
                      step="0.01"
                      inputMode="decimal"
                      value={line.unitPrice}
                      onChange={(event) =>
                        patchLine(line.id, {
                          unitPrice: Number(event.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`total-${line.id}`} className="text-xs">
                      {t("rowTotal")}
                    </Label>
                    <Input
                      id={`total-${line.id}`}
                      type="number"
                      min={0}
                      step="0.01"
                      inputMode="decimal"
                      value={lineTotal(line) || ""}
                      onChange={(event) => {
                        const total = Number(event.target.value) || 0;
                        const qty = line.quantity || 1;
                        patchLine(line.id, {
                          quantity: line.quantity || 1,
                          unitPrice: qty > 0 ? total / qty : 0,
                        });
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-6"
                    disabled={invoice.lines.length === 1}
                    aria-label={t("removeRow")}
                    onClick={() =>
                      patch({
                        lines: invoice.lines.filter(
                          (item) => item.id !== line.id,
                        ),
                      })
                    }
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => patch({ lines: [...invoice.lines, emptyLine()] })}
            >
              <Plus />
              {t("addRow")}
            </Button>
          </section>

          <section className="space-y-3 rounded-xl border p-3">
            <div className="flex items-center justify-between text-sm">
              <span>{t("grandTotal")}</span>
              <span className="tabular-nums font-medium">
                {formatUsd(usd)} {t("usd")}
              </span>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rate">{t("exchangeRate")}</Label>
              <Input
                id="rate"
                type="number"
                min={0}
                step="1"
                inputMode="decimal"
                value={invoice.exchangeRate || ""}
                onChange={(event) =>
                  patch({ exchangeRate: Number(event.target.value) || 0 })
                }
              />
            </div>
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{t("iqdTotal")}</span>
              <span className="tabular-nums">
                {formatIqd(iqd)} {t("iqd")}
              </span>
            </div>
          </section>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
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
