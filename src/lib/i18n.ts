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
  | "createNewInvoice"
  | "home"
  | "invoices"
  | "noInvoices"
  | "noInvoicesHint"
  | "invoiceId"
  | "dateTime"
  | "customerName"
  | "name"
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
    createNewInvoice: "Create New Invoice",
    home: "Home",
    invoices: "Invoices",
    noInvoices: "No invoices yet",
    noInvoicesHint: "Create your first invoice to store it on this device.",
    invoiceId: "Invoice ID",
    dateTime: "Date & time",
    customerName: "Customer name",
    name: "Name",
    phone: "Phone number",
    address: "Address",
    description: "Description",
    quantity: "Qty",
    unitPrice: "Unit price",
    rowTotal: "Total",
    addRow: "Add row",
    removeRow: "Remove",
    grandTotal: "Grand total",
    exchangeRate: "USD/IQD Exch. Rate",
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
    items: "Rows",
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
    createNewInvoice: "دروستکردنی پسوڵەی نوێ",
    home: "سەرەکی",
    invoices: "پسوڵەکان",
    noInvoices: "هیچ پسوڵەیەک نییە",
    noInvoicesHint: "یەکەم پسوڵە دروست بکە بۆ پاشەکەوتکردن لەسەر ئەم ئامێرە.",
    invoiceId: "ژمارەی پسوڵە",
    dateTime: "بەروار و کات",
    customerName: "ناوی کڕیار",
    name: "ناو",
    phone: "ژمارەی تەلەفۆن",
    address: "ناونیشان",
    description: "وەسف",
    quantity: "بڕ",
    unitPrice: "نرخ",
    rowTotal: "کۆ",
    addRow: "زیادکردنی ڕیز",
    removeRow: "سڕینەوە",
    grandTotal: "کۆی گشتی",
    exchangeRate: "نرخی گۆڕینی USD/IQD",
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
    items: "ڕیزەکان",
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
    createNewInvoice: "إنشاء فاتورة جديدة",
    home: "الرئيسية",
    invoices: "الفواتير",
    noInvoices: "لا توجد فواتير بعد",
    noInvoicesHint: "أنشئ فاتورتك الأولى لحفظها على هذا الجهاز.",
    invoiceId: "رقم الفاتورة",
    dateTime: "التاريخ والوقت",
    customerName: "اسم الزبون",
    name: "الاسم",
    phone: "رقم الهاتف",
    address: "العنوان",
    description: "الوصف",
    quantity: "الكمية",
    unitPrice: "السعر",
    rowTotal: "المجموع",
    addRow: "إضافة صف",
    removeRow: "حذف",
    grandTotal: "المجموع الكلي",
    exchangeRate: "سعر صرف USD/IQD",
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
    items: "الصفوف",
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
