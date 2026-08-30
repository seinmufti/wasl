"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  formatNationalPhoneMask,
  formatStoredPhone,
  PHONE_ZERO_PLACEHOLDER,
  parseLocalPhoneDigits,
} from "@/lib/phone";
import { extractWesternDigits } from "@/lib/digits";
import { cn } from "@/lib/utils";

function countDigitsBefore(value: string, index: number): number {
  return extractWesternDigits(value.slice(0, index)).length;
}

function cursorAfterDigits(formatted: string, digitCount: number): number {
  if (digitCount <= 0) return 0;

  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      seen++;
      if (seen === digitCount) return i + 1;
    }
  }

  return formatted.length;
}

export function IraqiPhoneInput({
  id,
  value,
  onChange,
  className,
  disabled,
  ariaLabel,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<number | null>(null);
  const [readyForEntry, setReadyForEntry] = useState(false);
  const national = parseLocalPhoneDigits(value);
  const isEmpty = national.length === 0;
  const showingZeroPlaceholder = isEmpty && !readyForEntry;
  const display = showingZeroPlaceholder
    ? PHONE_ZERO_PLACEHOLDER
    : formatNationalPhoneMask(national);

  function entryCursorPosition(digitCount = national.length): number {
    return cursorAfterDigits(display, digitCount);
  }

  function beginEntry() {
    if (!isEmpty) {
      snapCursorToEntryPoint();
      return;
    }

    setReadyForEntry(true);
    cursorRef.current = 0;
  }

  function snapCursorToEntryPoint() {
    const input = inputRef.current;
    if (!input) return;
    const pos = entryCursorPosition();
    input.setSelectionRange(pos, pos);
  }

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input || document.activeElement !== input) return;

    const pos = cursorRef.current ?? entryCursorPosition();
    input.setSelectionRange(pos, pos);
    cursorRef.current = null;
  }, [display, national.length]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const raw = input.value;
    const cursor = input.selectionStart ?? raw.length;
    const digitsBefore = countDigitsBefore(raw, cursor);

    let digits = parseLocalPhoneDigits(raw);

    if (digits.length === national.length && raw.length < display.length) {
      digits = national.slice(0, -1);
    }

    const formatted = formatNationalPhoneMask(digits);
    cursorRef.current = cursorAfterDigits(
      formatted,
      Math.min(digitsBefore, digits.length),
    );
    onChange(formatStoredPhone(digits));
  }

  function handleBlur() {
    if (isEmpty) {
      setReadyForEntry(false);
    }
  }

  return (
    <div
      className={cn(
        "flex h-14 min-h-14 w-full overflow-hidden rounded-xl border border-input bg-background transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <div className="flex shrink-0 items-center border-r border-input pl-2.5 pr-2 text-base text-muted-foreground">
        <span className="text-lg leading-none" aria-hidden>
          🇮🇶
        </span>
      </div>
      <input
        ref={inputRef}
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        aria-label={ariaLabel}
        disabled={disabled}
        value={display}
        className={cn(
          "min-w-0 flex-1 bg-transparent py-2 pl-2 pr-3.5 text-base tabular-nums outline-none text-start",
          showingZeroPlaceholder && "text-muted-foreground",
        )}
        dir="ltr"
        onFocus={beginEntry}
        onClick={beginEntry}
        onSelect={() => {
          if (!showingZeroPlaceholder) snapCursorToEntryPoint();
        }}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </div>
  );
}
