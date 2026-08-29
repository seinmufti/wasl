export function InvoiceListSkeleton() {
  return (
    <ul className="space-y-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <li key={index} className="rounded-xl border p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
          <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-40 animate-pulse rounded bg-muted" />
        </li>
      ))}
    </ul>
  );
}
