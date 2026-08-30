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
        <Button disabled className="w-full">
          {t("export")}
        </Button>
      }
    >
      <div className="flex justify-center py-16">
        <LoadingCircle progress={1} spinning />
      </div>
    </PageShell>
  );
}
