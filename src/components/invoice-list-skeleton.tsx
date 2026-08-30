export function InvoiceListSkeleton() {
  return (
    <ul className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <li key={index} className="rounded-xl border p-4">
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-5 w-36 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-44 animate-pulse rounded bg-muted" />
        </li>
      ))}
    </ul>
  );
}
