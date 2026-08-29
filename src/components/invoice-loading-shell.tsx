"use client";

import { InvoiceFormSkeleton } from "@/components/invoice-form-skeleton";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/components/settings-provider";
import { Button } from "@/components/ui/button";

export function InvoiceLoadingShell() {
  const { t } = useSettings();

  return (
    <PageShell
      title={t("invoice")}
      backHref="/"
      footer={
        <div className="grid grid-cols-2 gap-2">
          <Button className="h-11" disabled>
            {t("save")}
          </Button>
          <Button className="h-11" variant="outline" disabled>
            {t("export")}
          </Button>
        </div>
      }
    >
      <InvoiceFormSkeleton />
    </PageShell>
  );
}
