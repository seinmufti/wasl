import { RTL_LOCALES, type Locale } from "@/lib/types";

export type MessageKey =
  | "appName"
  | "settings"
  | "appearance"
  | "profile"
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
  | "grandTotalUsd"
  | "grandTotalIqd"
  | "exchangeRate"
  | "exchangeRateShort"
  | "iqdTotal"
  | "save"
  | "saved"
  | "saving"
  | "export"
  | "exportLanguage"
  | "pdf"
  | "image"
  | "highResImage"
  | "download"
  | "share"
  | "shareNotSupported"
  | "generating"
  | "exportFailed"
  | "back"
  | "nameRequired"
  | "rowsRequired"
  | "english"
  | "kurdish"
  | "arabic"
  | "invoice"
  | "date"
  | "time"
  | "customer"
  | "usd"
  | "iqd"
  | "items"
  | "thankYou"
  | "companyName"
  | "companyEmail"
  | "companyProfileHint"
  | "signature"
  | "clearSignature"
  | "deleteInvoice"
  | "deleteInvoiceConfirm"
  | "cancel"
  | "delete"
  | "developerMode"
  | "fillDummyData";

export const dictionaries: Record<Locale, Record<MessageKey, string>> = {
  en: {
    appName: "Wasl",
    settings: "Settings",
    appearance: "Appearance",
    profile: "Profile",
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
    grandTotalUsd: "Grand Total (USD)",
    grandTotalIqd: "Grand Total (IQD)",
    exchangeRate: "USD/IQD Exch. Rate",
    exchangeRateShort: "Exch. Rate",
    iqdTotal: "Total in IQD",
    save: "Save",
    saved: "Saved",
    saving: "Saving…",
    export: "Export",
    exportLanguage: "Export language",
    pdf: "PDF",
    image: "Image",
    highResImage: "High-res image",
    download: "Download",
    share: "Share",
    shareNotSupported: "Sharing is not available on this device.",
    generating: "Generating…",
    exportFailed: "Could not create the export.",
    back: "Back",
    nameRequired: "Enter the customer name.",
    rowsRequired: "Each row needs a description and unit price.",
    english: "English",
    kurdish: "Kurdish (Sorani)",
    arabic: "Arabic",
    invoice: "Invoice",
    date: "Date",
    time: "Time",
    customer: "Customer",
    usd: "USD",
    iqd: "IQD",
    items: "Rows",
    thankYou: "Thank you for your business.",
    companyName: "Company name",
    companyEmail: "Email",
    companyProfileHint: "Shown on exported invoices.",
    signature: "Signature",
    clearSignature: "Clear signature",
    deleteInvoice: "Delete invoice",
    deleteInvoiceConfirm: "This invoice will be permanently removed from this device.",
    cancel: "Cancel",
    delete: "Delete",
    developerMode: "Developer mode",
    fillDummyData: "Fill with sample invoice data",
  },
  ckb: {
    appName: "وەسڵ",
    settings: "ڕێکخستنەکان",
    appearance: "ڕووکار",
    profile: "پڕۆفایل",
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
    grandTotalUsd: "کۆی گشتی (USD)",
    grandTotalIqd: "کۆی گشتی (IQD)",
    exchangeRate: "نرخی گۆڕینی USD/IQD",
    exchangeRateShort: "نرخی گۆڕین",
    iqdTotal: "کۆی دینار",
    save: "پاشەکەوتکردن",
    saved: "پاشەکەوت کرا",
    saving: "پاشەکەوت دەکرێت…",
    export: "هەناردە",
    exportLanguage: "زمانی هەناردە",
    pdf: "PDF",
    image: "وێنە",
    highResImage: "وێنەی بەرز",
    download: "داگرتن",
    share: "هاوبەشکردن",
    shareNotSupported: "هاوبەشکردن لەسەر ئەم ئامێرە بەردەست نییە.",
    generating: "دروست دەکرێت…",
    exportFailed: "نەتوانرا هەناردەکە دروست بکرێت.",
    back: "گەڕانەوە",
    nameRequired: "ناوی کڕیار بنووسە.",
    rowsRequired: "هەر ڕیزێک پێویستی بە وەسف و نرخ هەیە.",
    english: "ئینگلیزی",
    kurdish: "کوردی (سۆرانی)",
    arabic: "عەرەبی",
    invoice: "پسوڵە",
    date: "بەروار",
    time: "کات",
    customer: "کڕیار",
    usd: "دۆلار",
    iqd: "دینار",
    items: "ڕیزەکان",
    thankYou: "سوپاس بۆ مامەڵەکەتان.",
    companyName: "ناوی کۆمپانیا",
    companyEmail: "ئیمەیڵ",
    companyProfileHint: "لەسەر پسوڵە هەناردەکراوەکان دەردەکەوێت.",
    signature: "واژۆ",
    clearSignature: "سڕینەوەی واژۆ",
    deleteInvoice: "سڕینەوەی پسوڵە",
    deleteInvoiceConfirm: "ئەم پسوڵەیە بە تەواوی لەسەر ئەم ئامێرە دەسڕدرێتەوە.",
    cancel: "پاشگەزبوونەوە",
    delete: "سڕینەوە",
    developerMode: "دۆخی گەشەپێدەر",
    fillDummyData: "پڕکردنەوە بە داتای نموونەیی",
  },
  ar: {
    appName: "وصل",
    settings: "الإعدادات",
    appearance: "المظهر",
    profile: "الملف الشخصي",
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
    grandTotalUsd: "المجموع الكلي (USD)",
    grandTotalIqd: "المجموع الكلي (IQD)",
    exchangeRate: "سعر صرف USD/IQD",
    exchangeRateShort: "سعر الصرف",
    iqdTotal: "المجموع بالدينار",
    save: "حفظ",
    saved: "تم الحفظ",
    saving: "جارٍ الحفظ…",
    export: "تصدير",
    exportLanguage: "لغة التصدير",
    pdf: "PDF",
    image: "صورة",
    highResImage: "صورة عالية الدقة",
    download: "تنزيل",
    share: "مشاركة",
    shareNotSupported: "المشاركة غير متاحة على هذا الجهاز.",
    generating: "جارٍ الإنشاء…",
    exportFailed: "تعذر إنشاء التصدير.",
    back: "رجوع",
    nameRequired: "أدخل اسم الزبون.",
    rowsRequired: "يجب أن يحتوي كل صف على وصف وسعر.",
    english: "الإنجليزية",
    kurdish: "الكردية (السورانية)",
    arabic: "العربية",
    invoice: "فاتورة",
    date: "التاريخ",
    time: "الوقت",
    customer: "الزبون",
    usd: "دولار",
    iqd: "دينار",
    items: "الصفوف",
    thankYou: "شكرًا لتعاملكم معنا.",
    companyName: "اسم الشركة",
    companyEmail: "البريد الإلكتروني",
    companyProfileHint: "يظهر على الفواتير المُصدَّرة.",
    signature: "التوقيع",
    clearSignature: "مسح التوقيع",
    deleteInvoice: "حذف الفاتورة",
    deleteInvoiceConfirm: "سيتم حذف هذه الفاتورة نهائيًا من هذا الجهاز.",
    cancel: "إلغاء",
    delete: "حذف",
    developerMode: "وضع المطور",
    fillDummyData: "ملء ببيانات فاتورة تجريبية",
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
