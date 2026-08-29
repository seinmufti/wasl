"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSettings } from "@/components/settings-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageShell({
  title,
  backHref,
  footer,
  children,
  className,
}: {
  title: string;
  backHref?: string;
  footer: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const { t } = useSettings();

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="flex h-11 shrink-0 items-center gap-2 border-b px-4">
        {backHref ? (
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={backHref} aria-label={t("back")}>
              <ArrowLeft className="rtl:rotate-180" />
            </Link>
          </Button>
        ) : (
          <span className="size-7 shrink-0" aria-hidden />
        )}
        <h1 className="min-w-0 flex-1 truncate text-sm font-medium">{title}</h1>
      </div>

      <div
        data-page-scroll
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
      >
        {children}
      </div>

      <div className="shrink-0 border-t bg-background/95 p-4 backdrop-blur-sm">
        {footer}
      </div>
    </div>
  );
}
