import { retrieveCustomer } from "@/lib/data/customer"
import ItemsPreviewTemplate from "@/modules/cart/templates/preview"
import CheckoutTotals from "@/modules/checkout/components/checkout-totals"
import PromotionCode from "@/modules/checkout/components/promotion-code"
import Review from "@/modules/checkout/components/review"
import { B2BCart } from "@/types"

const CheckoutSummary = async ({ cart }: { cart: B2BCart }) => {
  const customer = await retrieveCustomer()

  return (
    <div className="bg-white rounded border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Bestelling overzicht
        </h2>
        <p className="text-sm text-gray-600">
          {cart?.items?.length || 0}{" "}
          {cart?.items?.length === 1 ? "artikel" : "artikelen"}
        </p>
      </div>

      {/* Items */}
      <div className="p-6">
        <ItemsPreviewTemplate
          items={cart?.items}
          currencyCode={cart.currency_code}
        />
      </div>

      {/* Totals */}
      <div className="p-6 border-t border-gray-200">
        <CheckoutTotals cartOrOrder={cart} />
      </div>

      {/* Promotion Code */}
      <div className="p-6 border-t border-gray-200">
        <PromotionCode cart={cart} />
      </div>

      {/* Review */}
      <div className="p-6 border-t border-gray-200">
        <Review cart={cart} customer={customer} />
      </div>
    </div>
  )
}

export default CheckoutSummary
