import { CompanyMark } from "@/components/company-mark";
import { WaslLogo } from "@/components/wasl-logo";
import { isRtl, t } from "@/lib/i18n";
import { splitInvoiceDateTime } from "@/lib/datetime";
import { formatInvoiceDisplayId } from "@/lib/invoice-id";
import { formatPhoneDisplay } from "@/lib/phone";
import {
  EXCHANGE_RATE_USD_BASE,
  formatIqd,
  formatUsd,
  grandTotalIqd,
  grandTotalUsd,
  hasExchangeRate,
  lineTotal,
} from "@/lib/money";
import type { Invoice, Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Visual scale for export typography and spacing (preview + PDF capture). */
const INVOICE_CONTENT_SCALE = 1.2;

export function InvoiceExport({
  invoice,
  locale,
  companyLogo,
  companyName,
  companyPhone,
  companyEmail,
  companySignature,
}: {
  invoice: Invoice;
  locale: Locale;
  companyLogo: string | null;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companySignature: string | null;
}) {
  const label = (key: Parameters<typeof t>[1]) => t(locale, key);
  const usd = grandTotalUsd(invoice);
  const showIqd = hasExchangeRate(invoice.exchangeRate);
  const iqd = showIqd ? grandTotalIqd(invoice) : 0;
  const dir = isRtl(locale) ? "rtl" : "ltr";
  const displayName = companyName.trim() || label("appName");
  const { date: invoiceDate, time: invoiceTime } = splitInvoiceDateTime(
    invoice.createdAt,
  );

  return (
    <div
      className={cn(
        "invoice-a4 relative box-border overflow-hidden",
        dir === "rtl" && "invoice-a4-rtl",
      )}
      dir="ltr"
      style={{ color: "#111", background: "#fff" }}
    >
      <div
        className="absolute left-0 top-0 flex h-full origin-top-left flex-col p-[14mm]"
        style={{
          width: `${100 / INVOICE_CONTENT_SCALE}%`,
          height: `${100 / INVOICE_CONTENT_SCALE}%`,
          transform: `scale(${INVOICE_CONTENT_SCALE})`,
        }}
      >
      <div dir={dir} className="flex h-full flex-col">
      <header className="flex items-start justify-between gap-6 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-3">
          {companyLogo ? (
            <CompanyMark
              src={companyLogo}
              className="max-h-12 w-auto max-w-[3.5rem] shrink-0 rounded-lg object-contain"
            />
          ) : (
            <WaslLogo className="h-12" />
          )}
          <div>
            <p className="text-xl font-semibold tracking-tight">{displayName}</p>
            {companyPhone.trim() ? (
              <p className="text-sm text-neutral-500" dir="ltr">
                {formatPhoneDisplay(companyPhone)}
              </p>
            ) : null}
            {companyEmail.trim() ? (
              <p className="text-sm text-neutral-500" dir="ltr">
                {companyEmail.trim()}
              </p>
            ) : null}
          </div>
        </div>
        <div className="text-end">
          <p className="text-xl font-semibold tracking-tight">
            {label("invoiceId")}: {formatInvoiceDisplayId(invoice.id)}
          </p>
          <p className="text-sm text-neutral-500 tabular-nums" dir="ltr">
            {label("date")}: {invoiceDate}
          </p>
          <p className="text-sm text-neutral-500 tabular-nums" dir="ltr">
            {label("time")}: {invoiceTime}
          </p>
        </div>
      </header>

      <p className="mt-6 text-center text-base font-semibold uppercase tracking-wide">
        {label("invoice")}
      </p>

      <section className="mt-4 grid gap-1 text-sm">
        <p className="text-base font-medium">{invoice.customerName}</p>
        {invoice.customerPhone ? (
          <p dir="ltr">{formatPhoneDisplay(invoice.customerPhone)}</p>
        ) : null}
        {invoice.customerAddress ? (
          <p className="whitespace-pre-wrap text-neutral-700">
            {invoice.customerAddress}
          </p>
        ) : null}
      </section>

      <table className="mt-8 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-neutral-800">
            <th className="py-2 text-start font-semibold">{label("description")}</th>
            <th className="w-16 py-2 text-end font-semibold">
              {label("quantity")}
            </th>
            <th className="w-28 py-2 text-end font-semibold">
              {label("unitPrice")}
            </th>
            <th className="w-28 py-2 text-end font-semibold">
              {label("rowTotal")}
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.lines
            .filter(
              (line) =>
                line.description.trim() || line.quantity || line.unitPrice,
            )
            .map((line) => (
              <tr key={line.id} className="border-b border-neutral-200">
                <td className="py-2.5 text-start" dir="auto">
                  {line.description || "—"}
                </td>
                <td className="py-2.5 text-end tabular-nums" dir="ltr">
                  {line.quantity}
                </td>
                <td className="py-2.5 text-end tabular-nums" dir="ltr">
                  {formatUsd(line.unitPrice)}
                </td>
                <td className="py-2.5 text-end tabular-nums" dir="ltr">
                  {formatUsd(lineTotal(line))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <section
        className={
          companySignature
            ? "mt-8 grid grid-cols-2 items-stretch gap-6"
            : "mt-8 flex items-start justify-end"
        }
      >
        {companySignature ? (
          <div className="flex flex-col items-center justify-end">
            <div className="flex min-w-0 flex-col items-center gap-0.5 text-blue-600">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={companySignature}
                alt=""
                className="h-16 max-w-full object-contain"
              />
              <p className="text-center text-xs tabular-nums" dir="ltr">
                {invoiceDate}
              </p>
              <p className="text-center text-xs tabular-nums" dir="ltr">
                {invoiceTime}
              </p>
            </div>
          </div>
        ) : null}
        <div
          className={
            companySignature
              ? "ms-auto w-max max-w-full space-y-3 border-t border-neutral-200 pt-4 text-sm"
              : "w-max max-w-full space-y-3 border-t border-neutral-200 pt-4 text-sm"
          }
        >
          <div className="flex items-center justify-between gap-4 whitespace-nowrap">
            <span>{label("grandTotalUsd")}</span>
            <span className="tabular-nums font-medium" dir="ltr">
              {formatUsd(usd)}
            </span>
          </div>
          {showIqd ? (
            <>
              <div className="flex items-center justify-between gap-4 text-neutral-600">
                <span className="shrink-0">{label("exchangeRateShort")}</span>
                <span className="tabular-nums text-end leading-snug" dir="ltr">
                  <span className="block whitespace-nowrap">
                    {EXCHANGE_RATE_USD_BASE} {label("usd")} =
                  </span>
                  <span className="block whitespace-nowrap">
                    {formatIqd(invoice.exchangeRate)} {label("iqd")}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 whitespace-nowrap text-base font-semibold">
                <span>{label("grandTotalIqd")}</span>
                <span className="tabular-nums" dir="ltr">
                  {formatIqd(iqd)}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <p className="mt-auto pt-6 text-center text-xs text-neutral-500">
        {label("thankYou")}
      </p>
      </div>
      </div>
    </div>
  );
}
