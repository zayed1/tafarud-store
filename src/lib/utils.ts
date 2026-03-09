export function getCountryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    AE: "🇦🇪",
    SA: "🇸🇦",
    KW: "🇰🇼",
    BH: "🇧🇭",
    QA: "🇶🇦",
    OM: "🇴🇲",
    EG: "🇪🇬",
    JO: "🇯🇴",
    US: "🇺🇸",
    GB: "🇬🇧",
    GLOBAL: "🌐",
  };
  return flags[countryCode.toUpperCase()] || "🌐";
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ar-AE", {
    style: "currency",
    currency: "AED",
  }).format(price);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLocalizedField(
  item: any,
  field: string,
  locale: string
): string {
  return item[`${field}_${locale}`] || item[`${field}_ar`] || "";
}
