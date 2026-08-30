import { cn } from "@/lib/utils";

export function WaslLogo({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 32"
      aria-hidden
      className={cn("h-9 w-auto shrink-0", className)}
    >
      <rect
        width="64"
        height="32"
        rx="8"
        fill={inverted ? "var(--primary-foreground)" : "var(--primary)"}
      />
      <text
        x="32"
        y="21.5"
        textAnchor="middle"
        fill={inverted ? "var(--primary)" : "var(--primary-foreground)"}
        fontSize="13"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        Wasl
      </text>
    </svg>
  );
}
