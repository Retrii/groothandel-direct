import { convertToLocale } from "@/lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return "€0,00"
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <div className="p-6">
      <Heading level="h3" className="mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        Orderoverzicht
      </Heading>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Subtotaal</span>
          <span className="font-medium text-gray-900">
            {getAmount(order.subtotal)}
          </span>
        </div>

        {order.discount_total > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Korting</span>
            <span className="font-medium text-red-600">
              - {getAmount(order.discount_total)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Verzendkosten</span>
          <span className="font-medium text-gray-900">
            {getAmount(order.shipping_total)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">BTW</span>
          <span className="font-medium text-gray-900">
            {getAmount(order.tax_total)}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-t-2 border-gray-200">
          <span className="text-base font-semibold text-gray-900">Totaal</span>
          <span className="text-base font-semibold text-gray-900">
            {getAmount(order.total)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
