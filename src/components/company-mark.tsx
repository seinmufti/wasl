import { WaslLogo } from "@/components/wasl-logo";
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
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className={cn("size-8 shrink-0 rounded-md object-contain", imgClassName)}
      />
    );
  }

  return <WaslLogo className={className} />;
}
