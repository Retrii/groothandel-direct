"use client"

import { useCart } from "@/lib/context/cart-context"
import { checkSpendingLimit } from "@/lib/util/check-spending-limit"
import ApprovalStatusBanner from "@/modules/cart/components/approval-status-banner"
import EmptyCartMessage from "@/modules/cart/components/empty-cart-message"
import ItemsTemplate from "@/modules/cart/templates/items"
import Summary from "@/modules/cart/templates/summary"
import { B2BCustomer } from "@/types/global"
import { Heading } from "@medusajs/ui"
import { useMemo } from "react"

const CartTemplate = ({ customer }: { customer: B2BCustomer | null }) => {
  const { cart } = useCart()

  const spendLimitExceeded = useMemo(
    () => checkSpendingLimit(cart, customer),
    [cart, customer]
  )

  const totalItems = useMemo(
    () => cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0,
    [cart?.items]
  )

  return (
    <div className="bg-white py-6">
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        data-testid="cart-container"
      >
        {cart?.items?.length ? (
          <div>
            {/* Simple Header */}
            <div className="mb-6">
              <Heading className="text-2xl font-medium text-gray-900 mb-1">
                Winkelwagen
              </Heading>
              <p className="text-gray-600 text-sm">
                {totalItems} {totalItems === 1 ? "artikel" : "artikelen"}
              </p>
            </div>

            {/* Alert Banners - Only if needed */}
            {(!customer || (cart?.approvals && cart.approvals.length > 0)) && (
              <div className="space-y-3 mb-6">
                {cart?.approvals && cart.approvals.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <ApprovalStatusBanner cart={cart} />
                  </div>
                )}
              </div>
            )}

            {/* Main Content - Clean 2 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items Column - 2/3 width */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded p-4">
                  <ItemsTemplate
                    cart={cart}
                    showBorders={false}
                    showTotal={false}
                  />
                </div>
              </div>

              {/* Summary Column - 1/3 width */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <div className="bg-gray-50 border border-gray-200 rounded p-4">
                    {cart && cart.region && (
                      <Summary
                        customer={customer}
                        spendLimitExceeded={spendLimitExceeded}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
