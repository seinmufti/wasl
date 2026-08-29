import { cn } from "@/lib/utils";

export function WaslLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden
      className={cn("size-8 shrink-0", className)}
    >
      <rect width="40" height="40" rx="10" fill="#2563eb" />
      <path
        d="M10 29V11h5.2l3.8 10.2L22.8 11H28v18h-4.8v-9.8L19.4 29h-3.8l-3.8-9.8V29H10Z"
        fill="#ffffff"
      />
    </svg>
  );
}
