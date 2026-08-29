import { CompanyMark } from "@/components/company-mark";
import { isRtl, t } from "@/lib/i18n";
import {
  formatDate,
  formatIqd,
  formatUsd,
  grandTotalIqd,
  grandTotalUsd,
  lineTotal,
} from "@/lib/money";
import type { Invoice, Locale } from "@/lib/types";

export function InvoiceExport({
  invoice,
  locale,
  companyLogo,
}: {
  invoice: Invoice;
  locale: Locale;
  companyLogo: string | null;
}) {
  const label = (key: Parameters<typeof t>[1]) => t(locale, key);
  const usd = grandTotalUsd(invoice);
  const iqd = grandTotalIqd(invoice);
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <div
      className="invoice-a4 box-border flex flex-col p-[14mm]"
      dir={dir}
      style={{ color: "#111", background: "#fff" }}
    >
      <header className="flex items-start justify-between gap-6 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-3">
          <CompanyMark
            src={companyLogo}
            className="size-12"
            imgClassName="size-12 rounded-lg object-contain"
          />
          <div>
            <p className="text-xl font-semibold tracking-tight">{label("appName")}</p>
            <p className="text-sm text-neutral-500">{label("invoice")}</p>
          </div>
        </div>
        <div className="text-end text-sm">
          <p className="font-medium">
            {label("invoiceId")}: {invoice.id}
          </p>
          <p className="text-neutral-500">
            {label("date")}: {formatDate(invoice.createdAt, locale)}
          </p>
        </div>
      </header>

      <section className="mt-6 grid gap-1 text-sm">
        <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
          {label("customer")}
        </p>
        <p className="text-base font-medium">{invoice.customerName}</p>
        {invoice.customerPhone ? <p>{invoice.customerPhone}</p> : null}
        {invoice.customerAddress ? (
          <p className="whitespace-pre-wrap text-neutral-700">
            {invoice.customerAddress}
          </p>
        ) : null}
      </section>

      <table className="mt-8 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-neutral-800 text-start">
            <th className="py-2 font-semibold">{label("description")}</th>
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
                <td className="py-2.5">{line.description || "—"}</td>
                <td className="py-2.5 text-end tabular-nums">{line.quantity}</td>
                <td className="py-2.5 text-end tabular-nums">
                  {formatUsd(line.unitPrice)}
                </td>
                <td className="py-2.5 text-end tabular-nums">
                  {formatUsd(lineTotal(line))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <section className="mt-auto space-y-2 border-t border-neutral-200 pt-5 text-sm">
        <div className="flex items-center justify-between">
          <span>
            {label("grandTotal")} ({label("usd")})
          </span>
          <span className="tabular-nums font-medium">{formatUsd(usd)}</span>
        </div>
        <div className="flex items-center justify-between text-neutral-600">
          <span>{label("exchangeRate")}</span>
          <span className="tabular-nums">{formatIqd(invoice.exchangeRate)}</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold">
          <span>
            {label("iqdTotal")} ({label("iqd")})
          </span>
          <span className="tabular-nums">{formatIqd(iqd)}</span>
        </div>
        <p className="pt-6 text-center text-xs text-neutral-500">
          {label("thankYou")}
        </p>
      </section>
    </div>
  );
}
