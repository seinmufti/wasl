export type DummyInvoiceTemplate = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  lines: { description: string; quantity: number; unitPrice: number }[];
  /** IQD per USD 100; 0 = USD-only (no IQD conversion). */
  exchangeRate: number;
};

/** Debug-only sample invoices — cycles on each 🤪 tap. */
export const DUMMY_INVOICES: DummyInvoiceTemplate[] = [
  {
    customerName: "Azad Karim",
    customerPhone: "+9647701234567",
    customerAddress: "Erbil, Ankawa, Street 100m",
    lines: [{ description: "Website maintenance", quantity: 1, unitPrice: 250 }],
    exchangeRate: 0,
  },
  {
    customerName: "Sara Mohammed",
    customerPhone: "+9647509876543",
    customerAddress: "Sulaymaniyah, Malik Mahmud Ring Rd",
    lines: [
      { description: "Cement bags 50kg", quantity: 20, unitPrice: 8.5 },
      { description: "Delivery", quantity: 1, unitPrice: 45 },
    ],
    exchangeRate: 152_000,
  },
  {
    customerName: "ڕێباز ئەحمەد",
    customerPhone: "+9647805551234",
    customerAddress: "هەولێر، ٤٠ مەتری، بینای ١٢",
    lines: [
      { description: "Kebab platter", quantity: 15, unitPrice: 12 },
      { description: "Soft drinks", quantity: 30, unitPrice: 1.5 },
      { description: "Service charge", quantity: 1, unitPrice: 25 },
    ],
    exchangeRate: 153_750,
  },
  {
    customerName: "Ali Hassan Trading",
    customerPhone: "+9647701112233",
    customerAddress: "Baghdad, Karrada, Sector 62",
    lines: [{ description: "Industrial generator rental", quantity: 1, unitPrice: 3200 }],
    exchangeRate: 154_000,
  },
  {
    customerName: "Nadia Fatah",
    customerPhone: "+9647514445566",
    customerAddress: "Duhok, Azadi quarter",
    lines: [
      { description: "A4 paper reams", quantity: 10, unitPrice: 4.25 },
      { description: "Toner cartridges", quantity: 4, unitPrice: 38 },
      { description: "USB flash drives 64GB", quantity: 6, unitPrice: 9 },
      { description: "Binding coils", quantity: 2, unitPrice: 6.5 },
    ],
    exchangeRate: 0,
  },
  {
    customerName: "کۆمپانیای ئاراز",
    customerPhone: "+9647708889900",
    customerAddress: "سلێمانی، سەر رێگای پێشەوا",
    lines: [
      { description: "POS terminal setup", quantity: 2, unitPrice: 175 },
      { description: "Staff training (days)", quantity: 3, unitPrice: 90 },
    ],
    exchangeRate: 153_000,
  },
  {
    customerName: "محمد العبيدي",
    customerPhone: "+9647803334455",
    customerAddress: "البصرة، العشار، قرب سوق الحرية",
    lines: [
      { description: "تصليح مكيف", quantity: 2, unitPrice: 55 },
      { description: "قطع غيار", quantity: 1, unitPrice: 120 },
      { description: "أجور يومية", quantity: 1, unitPrice: 40 },
    ],
    exchangeRate: 155_000,
  },
  {
    customerName: "Test Customer",
    customerPhone: "+9647500000001",
    customerAddress: "Quick demo address",
    lines: [{ description: "Sample line item", quantity: 1, unitPrice: 99.99 }],
    exchangeRate: 0,
  },
  {
    customerName: "Hawkar IT Solutions",
    customerPhone: "+9647712223344",
    customerAddress: "Erbil, Dream City, Block C",
    lines: [
      { description: "Laptop Dell Latitude", quantity: 3, unitPrice: 680 },
      { description: "Docking stations", quantity: 3, unitPrice: 85 },
      { description: "Extended warranty", quantity: 3, unitPrice: 45 },
      { description: "On-site install", quantity: 1, unitPrice: 150 },
      { description: "Cable kit", quantity: 3, unitPrice: 22 },
    ],
    exchangeRate: 152_500,
  },
  {
    customerName: "Layla Omar",
    customerPhone: "+9647517778899",
    customerAddress: "Kirkuk, Rahimawa district",
    lines: [
      { description: "Graphic design package", quantity: 1, unitPrice: 450 },
      { description: "Social media assets", quantity: 1, unitPrice: 180 },
    ],
    exchangeRate: 0,
  },
];

export function pickDummyInvoice(index: number): DummyInvoiceTemplate {
  return DUMMY_INVOICES[index % DUMMY_INVOICES.length];
}
