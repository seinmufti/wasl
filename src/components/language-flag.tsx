import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";
import type { LanguageFlagId } from "@/lib/types";

const FLAG_EMOJI: Record<Exclude<LanguageFlagId, "kurdistan">, string> = {
  en: "🇺🇸",
  iraq: "🇮🇶",
};

const FLAG_SLOT = {
  md: "inline-flex h-4 w-[1.125rem] shrink-0 items-center justify-center overflow-hidden",
  sm: "inline-flex h-[13px] w-[1.125rem] shrink-0 items-center justify-center overflow-hidden",
} as const;

export function LanguageFlag({
  flag,
  className,
  size = "md",
}: {
  flag: LanguageFlagId;
  className?: string;
  size?: keyof typeof FLAG_SLOT;
}) {
  const slot = FLAG_SLOT[size];

  if (flag === "kurdistan") {
    return (
      <span aria-hidden className={cn(slot, className)}>
        <img
          src={withBasePath("/images/kurdistan-flag.png")}
          alt=""
          className="h-full w-full object-contain object-center"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        slot,
        size === "sm" ? "text-[13px] leading-none" : "text-base leading-none",
        className,
      )}
    >
      {FLAG_EMOJI[flag]}
    </span>
  );
}
