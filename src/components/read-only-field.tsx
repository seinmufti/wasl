import { cn } from "@/lib/utils";

export const readOnlyFieldClassName =
  "h-11 min-h-11 w-full min-w-0 cursor-default rounded-xl border border-input/60 bg-muted/40 px-3 py-2 text-sm tabular-nums text-muted-foreground dark:bg-input/50";

export function ReadOnlyField({
  id,
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      id={id}
      className={cn(
        readOnlyFieldClassName,
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
