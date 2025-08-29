"use client"

import { checkSpendingLimit } from "@/lib/util/check-spending-limit"
import PaymentButton from "@/modules/checkout/components/payment-button"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { B2BCart, B2BCustomer } from "@/types"

const Review = ({
  cart,
  customer,
}: {
  cart: B2BCart
  customer: B2BCustomer | null
}) => {
  const spendLimitExceeded = customer
    ? checkSpendingLimit(cart, customer)
    : false

  return (
    <div className="space-y-4">
      {/* Terms Agreement */}
      <div className="text-xs text-gray-600 leading-relaxed">
        Door deze bestelling te plaatsen, ga ik akkoord met de{" "}
        <LocalizedClientLink
          href="/terms-of-sale"
          className="text-blue-600 hover:text-blue-700 underline"
          target="_blank"
        >
          Algemene Voorwaarden
        </LocalizedClientLink>{" "}
        en het{" "}
        <LocalizedClientLink
          href="/privacy-policy"
          className="text-blue-600 hover:text-blue-700 underline"
          target="_blank"
        >
          Privacybeleid
        </LocalizedClientLink>{" "}
        van Groothandel Direct.
      </div>

      {/* Spending Limit Warning or Payment Button */}
      {spendLimitExceeded ? (
        <div className="space-y-3">
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">
              Bestedingslimiet overschreden
            </p>
            <p className="text-sm text-gray-600">
              Deze bestelling overschrijdt uw bestedingslimiet. Neem contact op
              met uw manager voor goedkeuring.
            </p>
          </div>
          <Button className="w-full" disabled>
            Bestelling geblokkeerd
          </Button>
        </div>
      ) : (
        <PaymentButton cart={cart} data-testid="submit-order-button" />
      )}
    </div>
  )
}

export default Review
