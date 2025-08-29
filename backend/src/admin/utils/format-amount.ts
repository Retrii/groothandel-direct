export const formatAmount = (amount: number, currency_code: string) => {
  // Automatically use European formatting for EUR currency
  const locale = currency_code?.toLowerCase() === "eur" ? "nl-NL" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency_code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
