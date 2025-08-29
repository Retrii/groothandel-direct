import { isEmpty } from "@/lib/util/isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale,
}: ConvertToLocaleParams) => {
  // Automatically use European formatting for EUR currency
  if (currency_code?.toLowerCase() === "eur" && !locale) {
    locale = "nl-NL" // Dutch locale for European formatting
  }

  // Default to en-US if no locale specified and not EUR
  const finalLocale = locale || "en-US"

  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(finalLocale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits: minimumFractionDigits ?? 2,
        maximumFractionDigits: maximumFractionDigits ?? 2,
      }).format(amount)
    : amount.toString()
}
