"use client";

import { useId, useRef } from "react";
import { cn } from "@/lib/utils";

export function FloatingLabelInput({
  id,
  label,
  value,
  className,
  onFocus,
  onBlur,
  placeholder: _placeholder,
  ...props
}: React.ComponentProps<"input"> & {
  label: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        "relative h-14 min-h-14 min-w-0 overflow-hidden rounded-xl border border-input bg-transparent transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
        className,
      )}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault();
          inputRef.current?.focus();
        }
      }}
    >
      <input
        ref={inputRef}
        id={inputId}
        value={value}
        placeholder=" "
        onFocus={onFocus}
        onBlur={onBlur}
        className="peer absolute inset-0 h-full w-full border-0 bg-transparent px-3.5 pb-2.5 pt-7 text-base outline-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "pointer-events-none absolute start-3.5 top-1/2 z-10 max-w-[calc(100%-1.75rem)] -translate-y-1/2 truncate text-sm leading-none text-muted-foreground transition-[top,transform,font-size] duration-150 ease-out",
          "peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs",
          "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs",
        )}
      >
        {label}
      </label>
    </div>
  );
}
