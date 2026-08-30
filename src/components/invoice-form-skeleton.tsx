export function InvoiceFormSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
          <div className="h-11 animate-pulse rounded-xl bg-muted" />
        </div>
      ))}

      <div className="space-y-3">
        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
        <div className="space-y-3 rounded-xl border p-4">
          <div className="h-11 animate-pulse rounded-xl bg-muted" />
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-2">
            <div className="h-16 animate-pulse rounded-xl bg-muted" />
            <div className="h-16 animate-pulse rounded-xl bg-muted" />
            <div className="h-16 animate-pulse rounded-xl bg-muted" />
            <div className="mt-6 size-11 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border p-4">
        <div className="flex justify-between">
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          <div className="h-5 w-16 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-11 animate-pulse rounded-xl bg-muted" />
        <div className="flex justify-between">
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
          <div className="h-5 w-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
