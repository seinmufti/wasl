"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ReadOnlyField } from "@/components/read-only-field";
import {
  formatInvoiceDateTime,
  parseInvoiceDateTime,
  splitInvoiceDateTime,
} from "@/lib/datetime";
import { toWesternDigits } from "@/lib/digits";

function DateTimeDisplay({
  id,
  timestamp,
}: {
  id?: string;
  timestamp: number;
}) {
  const { date, time } = splitInvoiceDateTime(timestamp);

  return (
    <ReadOnlyField
      id={id}
      className="flex items-center justify-between gap-2"
    >
      <span className="min-w-0 truncate">{date}</span>
      <span className="shrink-0">{time}</span>
    </ReadOnlyField>
  );
}

export function InvoiceDateTimeInput({
  id,
  value,
  onChange,
  readOnly,
}: {
  id?: string;
  value: number;
  onChange?: (timestamp: number) => void;
  readOnly?: boolean;
}) {
  const [text, setText] = useState(() => formatInvoiceDateTime(value));

  useEffect(() => {
    setText(formatInvoiceDateTime(value));
  }, [value]);

  if (readOnly) {
    return <DateTimeDisplay id={id} timestamp={value} />;
  }

  return (
    <Input
      id={id}
      value={text}
      placeholder="DD/MM/YYYY hh:mm AM"
      inputMode="numeric"
      dir="ltr"
      className="tabular-nums text-start"
      onChange={(event) => {
        const next = toWesternDigits(event.target.value);
        setText(next);
        const parsed = parseInvoiceDateTime(next);
        if (parsed !== null) onChange?.(parsed);
      }}
      onBlur={() => {
        const parsed = parseInvoiceDateTime(text);
        if (parsed !== null) {
          onChange?.(parsed);
          setText(formatInvoiceDateTime(parsed));
          return;
        }
        setText(formatInvoiceDateTime(value));
      }}
    />
  );
}
