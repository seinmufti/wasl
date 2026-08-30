import { cn } from "@/lib/utils";

export function CompanyMark({
  src,
  className,
  imgClassName,
}: {
  src: string | null;
  className?: string;
  imgClassName?: string;
}) {
  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={cn("h-9 w-9 shrink-0 rounded-md object-contain", imgClassName, className)}
    />
  );
}
