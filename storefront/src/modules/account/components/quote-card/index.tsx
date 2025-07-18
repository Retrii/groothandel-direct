import QuoteStatusBadge from "@/app/[countryCode]/(main)/account/@dashboard/quotes/components/quote-status-badge"
import { convertToLocale } from "@/lib/util/money"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { StoreQuoteResponse } from "@/types"
import Image from "next/image"
import { useMemo } from "react"

type QuoteCardProps = {
  quote: StoreQuoteResponse["quote"]
}

const QuoteCard = ({ quote }: QuoteCardProps) => {
  const { draft_order: order } = quote
  const createdAt = new Date(order.created_at)

  const numberOfLines = useMemo(
    () =>
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0,
    [order]
  )

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "accepted":
        return 100
      case "sent":
        return 50
      case "pending":
        return 25
      default:
        return 10
    }
  }

  return (
    <LocalizedClientLink href={`/account/quotes/details/${quote.id}`}>
      <div className="group relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden">
        {/* Status bar at top */}
        <div className="h-1 bg-gray-100">
          <div
            className={`h-full transition-all duration-300 bg-green-500`}
            style={{ width: `${getStatusProgress(quote.status)}%` }}
          />
        </div>

        <div className="p-4">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">
                  Offerte #{order.display_id}
                </h3>
                <QuoteStatusBadge status={quote.status} />
              </div>
              <p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {convertToLocale({
                  amount: order.total,
                  currency_code: order.currency_code,
                })}
              </p>
              <p className="text-xs text-gray-500">excl. BTW</p>
            </div>
          </div>

          {/* Products Section */}
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Product Images */}
                <div className="flex -space-x-2">
                  {order.items?.slice(0, 4).map((item, index) => (
                    <div
                      key={item.id}
                      className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-100"
                      style={{ zIndex: 4 - index }}
                    >
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          width={32}
                          height={32}
                          quality={75}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                  ))}
                  {order.items && order.items.length > 4 && (
                    <div className="relative w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        +{order.items.length - 4}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Count */}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {numberOfLines} artikel{numberOfLines !== 1 ? "en" : ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.items?.length} verschillende product
                    {order.items?.length !== 1 ? "en" : ""}
                  </p>
                </div>
              </div>

              {/* View Button */}
              <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-900 transition-colors">
                <span className="hidden sm:inline mr-1">Details</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default QuoteCard
