export function InvoiceFormSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-1.5">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 animate-pulse rounded-lg bg-muted" />
        </div>
      ))}

      <div className="space-y-3">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        <div className="space-y-2 rounded-xl border p-3">
          <div className="h-8 animate-pulse rounded-lg bg-muted" />
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-2">
            <div className="h-14 animate-pulse rounded-lg bg-muted" />
            <div className="h-14 animate-pulse rounded-lg bg-muted" />
            <div className="h-14 animate-pulse rounded-lg bg-muted" />
            <div className="mt-6 size-8 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border p-3">
        <div className="flex justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-8 animate-pulse rounded-lg bg-muted" />
        <div className="flex justify-between">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
