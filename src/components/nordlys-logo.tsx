import { cn } from "@/lib/utils";

export function NordlysLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 24"
      aria-hidden
      className={cn("h-5 w-8 shrink-0", className)}
    >
      <rect width="40" height="24" rx="4" fill="#0B1220" />
      <path
        d="M2 16c4-6 7-3 10-7s5 1 8-4 5 2 8-2 5 3 10 1"
        fill="none"
        stroke="#5EEAD4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M2 19c5-5 8-2 11-6s6 0 8-3 6 3 9-1 5 2 8 0"
        fill="none"
        stroke="#818CF8"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M3 21c6-4 9-1 12-4s5 1 8-2 6 2 8 0 5 1 7 0"
        fill="none"
        stroke="#34D399"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}
