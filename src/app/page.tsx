"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { LoadingCircle } from "@/components/pull-to-refresh";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/components/settings-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteInvoice, listInvoices } from "@/lib/db";
import { formatInvoiceDisplayId } from "@/lib/invoice-id";
import {
  formatDate,
  formatIqd,
  formatUsd,
  grandTotalIqd,
  grandTotalUsd,
} from "@/lib/money";
import type { Invoice } from "@/lib/types";

export default function HomePage() {
  const { t, language } = useSettings();
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadInvoices = useCallback(async () => {
    const items = await listInvoices();
    setInvoices(items);
  }, []);

  useEffect(() => {
    let cancelled = false;
    listInvoices()
      .then((items) => {
        if (!cancelled) setInvoices(items);
      })
      .catch(() => {
        if (!cancelled) setInvoices([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteInvoice(deleteTarget.id);
      setInvoices((current) =>
        current ? current.filter((item) => item.id !== deleteTarget.id) : current,
      );
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <PageShell
      onRefresh={async () => {
        try {
          await loadInvoices();
        } catch {
          setInvoices([]);
        }
      }}
    >
      {invoices === null ? (
        <div className="flex justify-center py-16">
          <LoadingCircle progress={1} spinning />
        </div>
      ) : invoices.length === 0 ? (
        <div className="flex min-h-[14rem] flex-col items-center justify-center gap-3 py-12 text-center">
          <p className="text-lg font-medium">{t("noInvoices")}</p>
          <p className="max-w-[18rem] text-base text-muted-foreground">
            {t("noInvoicesHint")}
          </p>
          <Button asChild size="lg" className="mt-2">
            <Link href="/new">
              <Plus />
              {t("createNewInvoice")}
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {invoices.map((invoice) => (
            <li
              key={invoice.id}
              className="flex items-stretch overflow-hidden rounded-xl border transition-colors hover:bg-muted/60"
            >
              <Link
                href={`/invoice/${invoice.id}`}
                className="min-w-0 flex-1 p-4"
              >
                <p className="text-base font-medium">
                  {formatInvoiceDisplayId(invoice.id)}
                </p>
                <p className="mt-1 truncate text-base">{invoice.customerName}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(invoice.createdAt, language)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                  {formatUsd(grandTotalUsd(invoice))} {t("usd")} ·{" "}
                  {formatIqd(grandTotalIqd(invoice))} {t("iqd")}
                </p>
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="my-auto me-2 shrink-0 text-red-400 hover:bg-red-500/10 hover:text-red-500"
                aria-label={t("deleteInvoice")}
                onClick={() => setDeleteTarget(invoice)}
              >
                <Trash2 className="size-5" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteInvoice")}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? (
                <>
                  <span className="font-medium text-foreground">
                    {formatInvoiceDisplayId(deleteTarget.id)}
                  </span>
                  {" — "}
                  {t("deleteInvoiceConfirm")}
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}
