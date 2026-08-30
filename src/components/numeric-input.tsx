"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  formatCommaInteger,
  formatWesternNumber,
  parseWesternInteger,
  parseWesternNumber,
} from "@/lib/digits";
import { cn } from "@/lib/utils";

export function NumericInput({
  value,
  onValueChange,
  className,
  integer = false,
  clearOnFocusWhen,
  onFocus,
  onBlur,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "type"> & {
  value: number;
  onValueChange: (value: number) => void;
  integer?: boolean;
  /** When focused, show an empty field if the value equals this number. */
  clearOnFocusWhen?: number;
}) {
  const format = integer ? formatCommaInteger : formatWesternNumber;
  const parse = integer ? parseWesternInteger : parseWesternNumber;
  const [showEmpty, setShowEmpty] = useState(false);

  const display =
    showEmpty && clearOnFocusWhen !== undefined && value === clearOnFocusWhen
      ? ""
      : format(value);

  return (
    <Input
      {...props}
      type="text"
      dir="ltr"
      inputMode={integer ? "numeric" : "decimal"}
      className={cn("tabular-nums", className)}
      value={display}
      onFocus={(event) => {
        if (clearOnFocusWhen !== undefined && value === clearOnFocusWhen) {
          setShowEmpty(true);
        }
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setShowEmpty(false);
        if (clearOnFocusWhen !== undefined && value === 0) {
          onValueChange(clearOnFocusWhen);
        }
        onBlur?.(event);
      }}
      onChange={(event) => {
        setShowEmpty(false);
        onValueChange(parse(event.target.value));
      }}
    />
  );
}
