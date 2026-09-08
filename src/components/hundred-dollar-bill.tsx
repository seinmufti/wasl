import { exchangeRateFieldClassName } from "@/lib/exchange-rate-ui";
import { cn } from "@/lib/utils";

export function HundredDollarBill({
  id,
  className,
}: {
  id?: string;
  className?: string;
}) {
  return (
    <div
      id={id}
      aria-label="100 USD"
      className={cn(
        exchangeRateFieldClassName,
        "relative overflow-hidden rounded-xl shadow-sm",
        className,
      )}
    >
      <img
        src="/images/hundred-dollar-bill.png"
        alt="100 dollar bill"
        className="absolute inset-0 h-full w-full object-fill"
      />
    </div>
  );
}
