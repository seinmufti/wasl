"use client";

import { LoadingCircle } from "@/components/pull-to-refresh";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/components/settings-provider";
import { Button } from "@/components/ui/button";

export function InvoiceLoadingShell() {
  const { t } = useSettings();

  return (
    <PageShell
      footer={
        <div className="grid grid-cols-2 gap-3">
          <Button disabled>{t("save")}</Button>
          <Button variant="outline" disabled>
            {t("export")}
          </Button>
        </div>
      }
    >
      <div className="flex justify-center py-16">
        <LoadingCircle progress={1} spinning />
      </div>
    </PageShell>
  );
}
