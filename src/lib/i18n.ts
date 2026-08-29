import { RTL_LOCALES, type Locale } from "@/lib/types";

export type MessageKey =
  | "appName"
  | "settings"
  | "appearance"
  | "darkMode"
  | "language"
  | "companyLogo"
  | "uploadLogo"
  | "removeLogo"
  | "developedBy"
  | "createInvoice"
  | "invoices"
  | "noInvoices"
  | "noInvoicesHint"
  | "invoiceId"
  | "customerName"
  | "phone"
  | "address"
  | "description"
  | "quantity"
  | "unitPrice"
  | "rowTotal"
  | "addRow"
  | "removeRow"
  | "grandTotal"
  | "exchangeRate"
  | "iqdTotal"
  | "save"
  | "saving"
  | "export"
  | "exportLanguage"
  | "pdf"
  | "highResImage"
  | "generating"
  | "exportFailed"
  | "back"
  | "nameRequired"
  | "english"
  | "kurdish"
  | "arabic"
  | "invoice"
  | "date"
  | "customer"
  | "usd"
  | "iqd"
  | "items"
  | "thankYou"
  | "companyName"
  | "deleteInvoice"
  | "deleteInvoiceConfirm"
  | "cancel"
  | "delete";

export const dictionaries: Record<Locale, Record<MessageKey, string>> = {
  en: {
    appName: "Wasl",
    settings: "Settings",
    appearance: "Appearance",
    darkMode: "Dark mode",
    language: "Language",
    companyLogo: "Company logo",
    uploadLogo: "Upload logo",
    removeLogo: "Remove",
    developedBy: "Developed by Nordlys",
    createInvoice: "Create invoice",
    invoices: "Invoices",
    noInvoices: "No invoices yet",
    noInvoicesHint: "Create your first invoice to store it on this device.",
    invoiceId: "Invoice ID",
    customerName: "Customer name",
    phone: "Phone number",
    address: "Address",
    description: "Description",
    quantity: "Qty",
    unitPrice: "Unit price",
    rowTotal: "Total",
    addRow: "Add row",
    removeRow: "Remove",
    grandTotal: "Grand total",
    exchangeRate: "USD to IQD today",
    iqdTotal: "Total in IQD",
    save: "Save",
    saving: "Saving…",
    export: "Export",
    exportLanguage: "Export language",
    pdf: "PDF",
    highResImage: "High-res image",
    generating: "Generating…",
    exportFailed: "Could not create the export.",
    back: "Back",
    nameRequired: "Enter the customer name.",
    english: "English",
    kurdish: "Kurdish (Sorani)",
    arabic: "Arabic",
    invoice: "Invoice",
    date: "Date",
    customer: "Customer",
    usd: "USD",
    iqd: "IQD",
    items: "Items",
    thankYou: "Thank you for your business.",
    companyName: "Wasl",
    deleteInvoice: "Delete invoice",
    deleteInvoiceConfirm: "This invoice will be permanently removed from this device.",
    cancel: "Cancel",
    delete: "Delete",
  },
  ckb: {
    appName: "وەسڵ",
    settings: "ڕێکخستنەکان",
    appearance: "ڕووکار",
    darkMode: "دۆخی تاریک",
    language: "زمان",
    companyLogo: "لۆگۆی کۆمپانیا",
    uploadLogo: "بارکردنی لۆگۆ",
    removeLogo: "سڕینەوە",
    developedBy: "پەرەپێدراوە لەلایەن نۆردلیس",
    createInvoice: "دروستکردنی پسوڵە",
    invoices: "پسوڵەکان",
    noInvoices: "هیچ پسوڵەیەک نییە",
    noInvoicesHint: "یەکەم پسوڵە دروست بکە بۆ پاشەکەوتکردن لەسەر ئەم ئامێرە.",
    invoiceId: "ژمارەی پسوڵە",
    customerName: "ناوی کڕیار",
    phone: "ژمارەی تەلەفۆن",
    address: "ناونیشان",
    description: "وەسف",
    quantity: "بڕ",
    unitPrice: "نرخ",
    rowTotal: "کۆ",
    addRow: "زیادکردنی ڕیز",
    removeRow: "سڕینەوە",
    grandTotal: "کۆی گشتی",
    exchangeRate: "نرخی ئەمڕۆی دۆلار بۆ دینار",
    iqdTotal: "کۆی دینار",
    save: "پاشەکەوتکردن",
    saving: "پاشەکەوت دەکرێت…",
    export: "هەناردە",
    exportLanguage: "زمانی هەناردە",
    pdf: "PDF",
    highResImage: "وێنەی بەرز",
    generating: "دروست دەکرێت…",
    exportFailed: "نەتوانرا هەناردەکە دروست بکرێت.",
    back: "گەڕانەوە",
    nameRequired: "ناوی کڕیار بنووسە.",
    english: "ئینگلیزی",
    kurdish: "کوردی (سۆرانی)",
    arabic: "عەرەبی",
    invoice: "پسوڵە",
    date: "بەروار",
    customer: "کڕیار",
    usd: "دۆلار",
    iqd: "دینار",
    items: "کاڵاکان",
    thankYou: "سوپاس بۆ مامەڵەکەتان.",
    companyName: "وەسڵ",
    deleteInvoice: "سڕینەوەی پسوڵە",
    deleteInvoiceConfirm: "ئەم پسوڵەیە بە تەواوی لەسەر ئەم ئامێرە دەسڕدرێتەوە.",
    cancel: "پاشگەزبوونەوە",
    delete: "سڕینەوە",
  },
  ar: {
    appName: "وصل",
    settings: "الإعدادات",
    appearance: "المظهر",
    darkMode: "الوضع الداكن",
    language: "اللغة",
    companyLogo: "شعار الشركة",
    uploadLogo: "رفع الشعار",
    removeLogo: "إزالة",
    developedBy: "طوّر بواسطة نوردليس",
    createInvoice: "إنشاء فاتورة",
    invoices: "الفواتير",
    noInvoices: "لا توجد فواتير بعد",
    noInvoicesHint: "أنشئ فاتورتك الأولى لحفظها على هذا الجهاز.",
    invoiceId: "رقم الفاتورة",
    customerName: "اسم الزبون",
    phone: "رقم الهاتف",
    address: "العنوان",
    description: "الوصف",
    quantity: "الكمية",
    unitPrice: "السعر",
    rowTotal: "المجموع",
    addRow: "إضافة صف",
    removeRow: "حذف",
    grandTotal: "المجموع الكلي",
    exchangeRate: "سعر صرف الدولار إلى الدينار اليوم",
    iqdTotal: "المجموع بالدينار",
    save: "حفظ",
    saving: "جارٍ الحفظ…",
    export: "تصدير",
    exportLanguage: "لغة التصدير",
    pdf: "PDF",
    highResImage: "صورة عالية الدقة",
    generating: "جارٍ الإنشاء…",
    exportFailed: "تعذر إنشاء التصدير.",
    back: "رجوع",
    nameRequired: "أدخل اسم الزبون.",
    english: "الإنجليزية",
    kurdish: "الكردية (السورانية)",
    arabic: "العربية",
    invoice: "فاتورة",
    date: "التاريخ",
    customer: "الزبون",
    usd: "دولار",
    iqd: "دينار",
    items: "البنود",
    thankYou: "شكرًا لتعاملكم معنا.",
    companyName: "وصل",
    deleteInvoice: "حذف الفاتورة",
    deleteInvoiceConfirm: "سيتم حذف هذه الفاتورة نهائيًا من هذا الجهاز.",
    cancel: "إلغاء",
    delete: "حذف",
  },
};

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function t(locale: Locale, key: MessageKey): string {
  return dictionaries[locale][key];
}

export function localeBcp47(locale: Locale): string {
  if (locale === "ckb") return "ckb";
  return locale;
}
