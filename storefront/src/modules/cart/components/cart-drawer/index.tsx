"use client"

import { useCart } from "@/lib/context/cart-context"
import { checkSpendingLimit } from "@/lib/util/check-spending-limit"
import { formatAmount } from "@/modules/common/components/amount-cell"
import CartTotals from "@/modules/common/components/cart-totals"
import DeleteButton from "@/modules/common/components/delete-button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { PromptModal } from "@/modules/common/components/prompt-modal"
import ShoppingBag from "@/modules/common/icons/shopping-bag"
import Thumbnail from "@/modules/products/components/thumbnail"
import FreeShippingPriceNudge from "@/modules/shipping/components/free-shipping-price-nudge"
import { StoreFreeShippingPrice } from "@/types/shipping-option/http"
import { Badge, Button, Drawer, Heading } from "@medusajs/ui"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"

const CartDrawer = ({
  customer,
  freeShippingPrices,
  ...props
}: {
  customer: any
  freeShippingPrices: StoreFreeShippingPrice[]
}) => {
  const { cart, totalItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const cancelTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  const isOverSpendingLimit = useMemo(() => {
    if (!customer?.employee?.company) return false
    const { exceededAmount } = checkSpendingLimit(customer, cart)
    return exceededAmount > 0
  }, [customer, cart])

  const isApprovalRequired = useMemo(() => {
    if (!customer?.employee?.company?.approval_settings) return false

    const approvalSettings = customer.employee.company.approval_settings
    return (
      approvalSettings.is_approval_required_for_orders ||
      approvalSettings.is_approval_required_for_draft_orders
    )
  }, [customer])

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false)
    }

    // Add event listener for route changes
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  return (
    <>
      {isOpen && (
        <div className="fixed inset-[-2rem] z-10 backdrop-blur-sm p-0" />
      )}
      <Drawer
        onMouseEnter={cancelTimer}
        className="m-0 p-0 bg-none z-50"
        open={isOpen}
        onOpenChange={setIsOpen}
        {...(props as any)}
        style={{
          borderRadius: 0,
          boxShadow: "none",
          border: "none",
        }}
      >
        <Drawer.Trigger asChild>
          <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-green-600 transition-colors duration-200 hover:bg-green-50 rounded-lg">
            <div className="relative">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4"
                />
              </svg>
              {totalItems > 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-4 text-center font-medium">
                  {totalItems}
                </div>
              )}
            </div>
            <span className="hidden lg:inline font-medium">Winkelwagen</span>
          </button>
        </Drawer.Trigger>

        <Drawer.Content className="w-[440px] max-w-[440px] h-full bg-white border-l border-gray-200">
          <div className="flex h-full flex-col">
            <Drawer.Header className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <Heading level="h2" className="text-lg font-semibold">
                  Winkelwagen ({totalItems})
                </Heading>
                <Drawer.Close asChild>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </Drawer.Close>
              </div>
            </Drawer.Header>

            <div className="flex-1 overflow-auto p-6">
              {cart && cart.items && cart.items.length > 0 ? (
                <div className="space-y-4">
                  {cart.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex space-x-4 py-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-shrink-0">
                        <Thumbnail
                          thumbnail={item.thumbnail}
                          size="square"
                          className="w-16 h-16 bg-gray-100 rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.product_title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {item.variant_title}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              Aantal: {item.quantity}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {formatAmount(
                                item.total || 0,
                                cart.currency_code || "EUR"
                              )}
                            </span>
                            <DeleteButton id={item.id} className="text-xs" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Uw winkelwagen is leeg
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Begin met winkelen om producten toe te voegen.
                  </p>
                  <div className="mt-6">
                    <LocalizedClientLink
                      href="/store"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                    >
                      Start winkelen
                    </LocalizedClientLink>
                  </div>
                </div>
              )}

              {cart && freeShippingPrices && freeShippingPrices.length > 0 && (
                <div className="mt-6">
                  <FreeShippingPriceNudge
                    variant="inline"
                    cart={cart}
                    freeShippingPrices={freeShippingPrices}
                  />
                </div>
              )}
            </div>

            {cart && cart.items && cart.items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                <CartTotals totals={cart} />

                {isOverSpendingLimit && (
                  <Badge className="w-full" color="red">
                    Bestedingslimiet overschreden
                  </Badge>
                )}

                <div className="space-y-3">
                  <LocalizedClientLink
                    href="/cart"
                    className="block w-full text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    Bekijk winkelwagen
                  </LocalizedClientLink>

                  {customer ? (
                    isApprovalRequired ? (
                      <Suspense fallback={<div>Loading...</div>}>
                        <PromptModal
                          title="Approval Required"
                          description="This order requires approval before proceeding to checkout."
                          handleAction={() => {}}
                          isLoading={false}
                        >
                          <Button
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                            disabled={isOverSpendingLimit}
                          >
                            Request Approval
                          </Button>
                        </PromptModal>
                      </Suspense>
                    ) : (
                      <LocalizedClientLink
                        href="/checkout"
                        className="block w-full text-center px-4 py-3 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50"
                      >
                        Afrekenen
                      </LocalizedClientLink>
                    )
                  ) : (
                    <LocalizedClientLink
                      href="/account"
                      className="block w-full text-center px-4 py-3 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                    >
                      Inloggen voor afrekenen
                    </LocalizedClientLink>
                  )}
                </div>
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer>
    </>
  )
}

export default CartDrawer
