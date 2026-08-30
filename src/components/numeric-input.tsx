"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  formatCommaInteger,
  formatWesternNumber,
  isPartialDecimalInput,
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
  const [editingText, setEditingText] = useState<string | null>(null);

  const display =
    editingText !== null
      ? editingText
      : showEmpty && clearOnFocusWhen !== undefined && value === clearOnFocusWhen
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
        if (!integer) {
          setEditingText(
            clearOnFocusWhen !== undefined && value === clearOnFocusWhen
              ? ""
              : format(value),
          );
        } else if (clearOnFocusWhen !== undefined && value === clearOnFocusWhen) {
          setShowEmpty(true);
        }
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setShowEmpty(false);
        setEditingText(null);
        if (clearOnFocusWhen !== undefined && value === 0) {
          onValueChange(clearOnFocusWhen);
        }
        onBlur?.(event);
      }}
      onChange={(event) => {
        const next = event.target.value;
        if (!integer) {
          if (!isPartialDecimalInput(next)) return;
          setEditingText(next);
          onValueChange(parse(next));
          return;
        }
        setShowEmpty(false);
        onValueChange(parse(next));
      }}
    />
  );
}
