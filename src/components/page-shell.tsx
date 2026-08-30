"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { PullToRefresh } from "@/components/pull-to-refresh";
import { cn } from "@/lib/utils";

export function PageShell({
  footer,
  onRefresh,
  children,
  className,
}: {
  footer?: React.ReactNode;
  onRefresh?: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
      return;
    }
    router.refresh();
  }, [onRefresh, router]);

  return (
    <div className={cn("relative flex h-full min-h-0 flex-col", className)}>
      <PullToRefresh onRefresh={handleRefresh}>{children}</PullToRefresh>

      {footer ? (
        <div className="shrink-0 border-t bg-background/95 p-5 backdrop-blur-sm">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
