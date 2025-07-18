"use client"

import { acceptQuote, rejectQuote } from "@/lib/data/quotes"
import { formatAmount } from "@/modules/common/components/amount-cell"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { PromptModal } from "@/modules/common/components/prompt-modal"
import { B2BCustomer } from "@/types/global"
import { StoreQuoteResponse } from "@/types/quote"
import { AdminOrderLineItem, AdminOrderPreview } from "@medusajs/types"
import { toast } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import React, { useMemo, useState } from "react"
import QuoteMessages from "../quote-messages"
import QuoteStatusBadge from "../quote-status-badge"
import { QuoteTableItem } from "../quote-table"

type QuoteDetailsProps = {
  quote: StoreQuoteResponse["quote"] & {
    customer: B2BCustomer
  }
  preview: AdminOrderPreview
  countryCode: string
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({
  quote,
  preview,
  countryCode,
}) => {
  const order = quote.draft_order
  const originalItemsMap = useMemo(() => {
    return new Map<string, AdminOrderLineItem>(
      order.items?.map((item: AdminOrderLineItem) => [item.id, item])
    )
  }, [order])
  const router = useRouter()
  const [isAccepting, setIsAccepting] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  return (
    <div className="space-y-6" data-testid="quote-details-wrapper">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LocalizedClientLink
              href="/account/quotes"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="back-to-overview-button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </LocalizedClientLink>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Offerte #{quote.draft_order.display_id}
              </h1>
              <p className="text-gray-600 mt-1">
                Details en status van uw offerte
              </p>
            </div>
          </div>
          <QuoteStatusBadge status={quote.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Accepted Quote Banner */}
          {quote.status === "accepted" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <div>
                    <p className="text-green-800 font-medium">
                      Offerte geaccepteerd door klant
                    </p>
                    <p className="text-green-700 text-sm">
                      Bestelling is klaar voor verwerking
                    </p>
                  </div>
                </div>
                <Button
                  size="small"
                  onClick={() =>
                    router.push(
                      `/${countryCode}/account/orders/details/${quote.draft_order_id}`
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Bestelling bekijken
                </Button>
              </div>
            </div>
          )}

          {/* Quote Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Artikelen</h2>
              <p className="text-sm text-gray-600 mt-1">
                Producten in deze offerte
              </p>
            </div>
            <div className="p-6 space-y-4">
              {preview.items?.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-100 rounded-lg p-4"
                >
                  <QuoteTableItem
                    key={item.id}
                    item={item}
                    originalItem={originalItemsMap.get(item.id)}
                    currencyCode={order.currency_code}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Totaalbedragen
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Huidig totaal
                  </span>
                  <span className="text-sm text-gray-900">
                    {formatAmount(order.total, order.currency_code)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Nieuw totaal
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatAmount(preview.total, order.currency_code)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {quote.status === "pending_customer" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex gap-x-3 justify-end">
                <PromptModal
                  title="Offerte afwijzen?"
                  description="Weet u zeker dat u deze offerte wilt afwijzen? Deze actie kan niet ongedaan worden gemaakt."
                  handleAction={() => {
                    setIsRejecting(true)
                    rejectQuote(quote.id)
                      .catch((e) => toast.error(e.message))
                      .finally(() => setIsRejecting(false))
                  }}
                  isLoading={isRejecting}
                >
                  <Button
                    size="small"
                    variant="secondary"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Offerte afwijzen
                  </Button>
                </PromptModal>

                <PromptModal
                  title="Offerte accepteren?"
                  description="Weet u zeker dat u deze offerte wilt accepteren? Deze actie kan niet ongedaan worden gemaakt."
                  handleAction={() => {
                    setIsAccepting(true)
                    acceptQuote(quote.id)
                      .catch((e) => toast.error(e.message))
                      .finally(() => setIsAccepting(false))
                  }}
                  isLoading={isAccepting}
                >
                  <Button
                    size="small"
                    variant="primary"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Offerte accepteren
                  </Button>
                </PromptModal>
              </div>
            </div>
          )}

          {/* Messages */}
          <QuoteMessages quote={quote} preview={preview} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quote Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Offerte informatie
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Offerte ID:
                </span>
                <span className="text-sm text-gray-900">
                  #{quote.draft_order.display_id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>
                <QuoteStatusBadge status={quote.status} />
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Klantgegevens
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  E-mail
                </span>
                <span className="text-sm text-gray-900">
                  {quote.customer?.email || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Telefoon
                </span>
                <span className="text-sm text-gray-900">
                  {quote.customer?.phone || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Bestedingslimiet
                </span>
                <span className="text-sm text-gray-900">
                  {(quote.customer?.employee?.spending_limit &&
                    formatAmount(
                      quote.customer?.employee?.spending_limit || 0,
                      order.currency_code.toUpperCase()
                    )) ||
                    "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Bedrijfsgegevens
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Bedrijfsnaam
                </span>
                <span className="text-sm text-gray-900">
                  {quote.customer?.employee?.company?.name || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuoteDetails
