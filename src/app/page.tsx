"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { InvoiceListSkeleton } from "@/components/invoice-list-skeleton";
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

  useEffect(() => {
    listInvoices().then(setInvoices);
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
      title={t("invoices")}
      footer={
        <Button asChild className="h-11 w-full">
          <Link href="/new">
            <Plus />
            {t("createInvoice")}
          </Link>
        </Button>
      }
    >
      {invoices === null ? (
        <InvoiceListSkeleton />
      ) : invoices.length === 0 ? (
        <div className="flex min-h-[12rem] flex-col items-center justify-center gap-2 py-12 text-center">
          <p className="font-medium">{t("noInvoices")}</p>
          <p className="max-w-[16rem] text-sm text-muted-foreground">
            {t("noInvoicesHint")}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {invoices.map((invoice) => (
            <li
              key={invoice.id}
              className="flex items-stretch overflow-hidden rounded-xl border transition-colors hover:bg-muted/60"
            >
              <Link
                href={`/invoice/${invoice.id}`}
                className="min-w-0 flex-1 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(invoice.createdAt, language)}
                  </p>
                </div>
                <p className="mt-1 truncate text-sm">{invoice.customerName}</p>
                <p className="mt-1 text-xs text-muted-foreground tabular-nums">
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
                <Trash2 className="size-4" />
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
                    {deleteTarget.id}
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
