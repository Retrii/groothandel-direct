import { useCart } from "@/lib/context/cart-context"
import { getCheckoutStep } from "@/lib/util/get-checkout-step"
import CartTotals from "@/modules/cart/components/cart-totals"
import PromotionCode from "@/modules/checkout/components/promotion-code"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { B2BCustomer } from "@/types"
import { ApprovalStatusType } from "@/types/approval"
import { ExclamationCircle } from "@medusajs/icons"

type SummaryProps = {
  customer: B2BCustomer | null
  spendLimitExceeded: boolean
}

const Summary = ({ customer, spendLimitExceeded }: SummaryProps) => {
  const { cart } = useCart()

  const checkoutStep = cart ? getCheckoutStep(cart) : undefined
  const checkoutButtonLink = checkoutStep
    ? `/checkout?step=${checkoutStep}`
    : "/checkout"

  const isPendingApproval = cart?.approvals?.some(
    (approval) => approval?.status === ApprovalStatusType.PENDING
  )

  return (
    <div className="space-y-4">
      {/* Totals */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Overzicht</h3>
        <CartTotals />
      </div>

      {/* Promotion Code */}
      <PromotionCode cart={cart} />

      {/* Warning */}
      {spendLimitExceeded && (
        <div className="bg-amber-50 border border-amber-200 rounded p-3">
          <div className="flex items-start gap-2">
            <ExclamationCircle className="text-amber-600 w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Bestedingslimiet overschreden
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Neem contact op met uw manager voor goedkeuring.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <div className="pt-2">
        <LocalizedClientLink
          href={checkoutButtonLink}
          data-testid="checkout-button"
        >
          <Button
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-medium"
            disabled={spendLimitExceeded}
          >
            {spendLimitExceeded ? "Bestedingslimiet overschreden" : "Afrekenen"}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Summary
