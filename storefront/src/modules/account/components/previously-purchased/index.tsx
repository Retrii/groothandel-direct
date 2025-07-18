import PreviouslyPurchasedProduct from "@/modules/account/components/previously-purchased/product"
import { HttpTypes } from "@medusajs/types"

type PreviouslyPurchasedProps = {
  orders: HttpTypes.StoreOrder[]
}

const PreviouslyPurchasedProducts = ({ orders }: PreviouslyPurchasedProps) => {
  const variants = Array.from(
    new Map(
      orders.flatMap(
        (order) => order.items?.map((item) => [item.variant_id, item]) ?? []
      )
    ).values()
  )

  if (!variants.length) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-100">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Geen eerdere aankopen
        </h3>
        <p className="text-gray-600">U heeft nog geen producten gekocht.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {variants.slice(0, 8).map((variant) => (
        <PreviouslyPurchasedProduct
          variant={variant}
          key={variant.variant_id}
        />
      ))}
    </div>
  )
}

export default PreviouslyPurchasedProducts
