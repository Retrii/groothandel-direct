"use client"

import { useCart } from "@/lib/context/cart-context"
import { checkSpendingLimit } from "@/lib/util/check-spending-limit"
import { getCheckoutStep } from "@/lib/util/get-checkout-step"
import { convertToLocale } from "@/lib/util/money"
import AppliedPromotions from "@/modules/cart/components/applied-promotions"
import ApprovalStatusBanner from "@/modules/cart/components/approval-status-banner"
import ItemsTemplate from "@/modules/cart/templates/items"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import FreeShippingPriceNudge from "@/modules/shipping/components/free-shipping-price-nudge"
import { B2BCustomer } from "@/types"
import { StoreFreeShippingPrice } from "@/types/shipping-option/http"
import { ExclamationCircle, LockClosedSolidMini } from "@medusajs/icons"
import { Drawer } from "@medusajs/ui"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

type CartDrawerProps = {
  customer: B2BCustomer | null
  freeShippingPrices: StoreFreeShippingPrice[]
}

const CartDrawer = ({
  customer,
  freeShippingPrices,
  ...props
}: CartDrawerProps) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  const { cart } = useCart()

  const items = cart?.items || []
  const promotions = cart?.promotions || []

  const totalItems =
    items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = useMemo(() => cart?.item_subtotal ?? 0, [cart])

  const spendLimitExceeded = useMemo(
    () => checkSpendingLimit(cart, customer),
    [cart, customer]
  )

  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    if (isOpen) {
      return
    }

    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  const cancelTimer = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }
  }

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (
      itemRef.current !== totalItems &&
      !pathname.includes("/cart") &&
      !pathname.includes("/account")
    ) {
      timedOpen()
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  //close cart drawer when navigating to a different page
  useEffect(() => {
    cancelTimer()
    close()
  }, [pathname])

  const checkoutStep = cart ? getCheckoutStep(cart) : undefined
  const checkoutPath = customer
    ? checkoutStep
      ? `/checkout?step=${checkoutStep}`
      : "/checkout"
    : "/account"

  return (
    <>
      {/* Custom overlay with high z-index */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[99998] m-0 p-0 w-screen h-screen -ml-4 -mr-4"
          onClick={close}
        />
      )}

      <Drawer
        onMouseEnter={cancelTimer}
        className="rounded-none m-0 p-0 bg-none z-[99999] "
        open={isOpen}
        onOpenChange={setIsOpen}
        overlay={false}
        {...(props as any)}
      >
        <Drawer.Trigger asChild>
          <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-green-600 rounded-lg transition-colors duration-200 hover:bg-green-50">
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
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {totalItems > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <span
                    className="text-xs text-white font-bold leading-none"
                    style={{ fontSize: "8px" }}
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                </div>
              )}
            </div>
            <span className="hidden lg:inline font-medium">
              {cart && items && items.length > 0
                ? convertToLocale({
                    amount: subtotal,
                    currency_code: cart.currency_code,
                  })
                : "Winkelwagen"}
            </span>
          </button>
        </Drawer.Trigger>
        <Drawer.Content
          className="z-[99999] rounded-none m-0 p-0 inset-y-0 right-0 bg-white"
          onMouseEnter={cancelTimer}
        >
          <Drawer.Title className="sr-only">Winkelwagen</Drawer.Title>

          {/* Clean Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Winkelwagen
              </h2>
            </div>
            <button
              onClick={close}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-600"
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
          </div>

          {/* Banners */}
          {cart?.approvals && cart.approvals.length > 0 && (
            <div className="p-6 pb-0">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <ApprovalStatusBanner cart={cart} />
              </div>
            </div>
          )}
          {promotions.length > 0 && (
            <div className="px-6 pb-0">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <AppliedPromotions promotions={promotions} />
              </div>
            </div>
          )}

          {/* Items */}
          <div className="flex-1 overflow-auto">
            {cart && cart.items && cart.items.length > 0 ? (
              <div className="px-6 py-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Artikelen ({cart.items.length})
                </h3>
                <div className="space-y-4">
                  <ItemsTemplate
                    cart={cart}
                    showBorders={false}
                    showTotal={false}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Uw winkelwagen is leeg
                  </h3>
                  <p className="text-sm text-gray-500">
                    Voeg artikelen toe om te beginnen met winkelen
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom */}
          {cart && cart.items && cart.items.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              {cart && freeShippingPrices && freeShippingPrices.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <FreeShippingPriceNudge
                    variant="inline"
                    cart={cart}
                    freeShippingPrices={freeShippingPrices}
                  />
                </div>
              )}

              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-900">
                    Subtotaal
                  </span>
                  <span className="text-base font-bold text-gray-900">
                    {convertToLocale({
                      amount: subtotal,
                      currency_code: cart?.currency_code ?? "EUR",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <LocalizedClientLink href="/cart">
                  <Button
                    variant="secondary"
                    className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 font-medium"
                    size="large"
                  >
                    Bekijk winkelwagen
                  </Button>
                </LocalizedClientLink>

                <LocalizedClientLink href={checkoutPath}>
                  <Button
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-medium shadow-sm "
                    size="large"
                    disabled={totalItems === 0 || spendLimitExceeded}
                  >
                    <LockClosedSolidMini className="w-4 h-4 mr-2" />
                    {customer
                      ? spendLimitExceeded
                        ? "Bestedingslimiet overschreden"
                        : "Veilig afrekenen"
                      : "Log in om af te rekenen"}
                  </Button>
                </LocalizedClientLink>

                {spendLimitExceeded && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <ExclamationCircle className="text-amber-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-amber-800 mb-1">
                          Bestedingslimiet overschreden
                        </h4>
                        <p className="text-sm text-amber-700">
                          Deze bestelling overschrijdt uw bestedingslimiet. Neem
                          contact op met uw manager voor goedkeuring.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Drawer.Content>
      </Drawer>
    </>
  )
}

export default CartDrawer
