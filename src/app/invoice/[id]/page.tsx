"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoiceLoadingShell } from "@/components/invoice-loading-shell";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/components/settings-provider";
import { Button } from "@/components/ui/button";
import { getInvoice } from "@/lib/db";
import type { Invoice } from "@/lib/types";

function InvoicePageInner({ id }: { id: string }) {
  const { t } = useSettings();
  const searchParams = useSearchParams();
  const [invoice, setInvoice] = useState<Invoice | null | undefined>(undefined);

  useEffect(() => {
    getInvoice(id).then((found) => setInvoice(found ?? null));
  }, [id]);

  if (invoice === undefined) {
    return <InvoiceLoadingShell />;
  }

  if (invoice === null) {
    return (
      <PageShell
        title={t("invoice")}
        backHref="/"
        footer={
          <Button asChild className="h-11 w-full" variant="outline">
            <Link href="/">{t("back")}</Link>
          </Button>
        }
      >
        <div className="flex min-h-[12rem] items-center justify-center text-sm text-muted-foreground">
          {t("noInvoices")}
        </div>
      </PageShell>
    );
  }

  return (
    <InvoiceForm
      initial={invoice}
      openExportOnMount={searchParams.get("export") === "1"}
    />
  );
}

export default function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense fallback={<InvoiceLoadingShell />}>
      <InvoicePageInner id={id} />
    </Suspense>
  );
}
