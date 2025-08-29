"use client"

import { isStripe as isStripeFunc, paymentInfoMap } from "@/lib/constants"
import { initiatePaymentSession } from "@/lib/data/cart"
import ErrorMessage from "@/modules/checkout/components/error-message"
import PaymentContainer from "@/modules/checkout/components/payment-container"
import { StripeContext } from "@/modules/checkout/components/payment-wrapper"
import Button from "@/modules/common/components/button"
import { ApprovalStatusType } from "@/types"
import { RadioGroup } from "@headlessui/react"
import { CreditCard } from "@medusajs/icons"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const cartApprovalStatus = cart.approval_status?.status

  const stripeReady = useContext(StripeContext)

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#424270",
          "::placeholder": {
            color: "rgb(107 114 128)",
          },
        },
      },
      classes: {
        base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out",
      },
    }
  }, [])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      if (
        !activeSession ||
        activeSession.provider_id !== selectedPaymentMethod
      ) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Betaalmethode</h2>
          <p className="text-sm text-gray-600 mt-1">Hoe wilt u betalen?</p>
        </div>

        {!isOpen &&
          paymentReady &&
          cartApprovalStatus !== ApprovalStatusType.PENDING && (
            <button
              onClick={handleEdit}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              data-testid="edit-payment-button"
            >
              Bewerken
            </button>
          )}
      </div>

      <div className="mt-4">
        {isOpen ? (
          <div>
            {!paidByGiftcard && availablePaymentMethods?.length && (
              <>
                <RadioGroup
                  value={selectedPaymentMethod}
                  onChange={(value: string) => setSelectedPaymentMethod(value)}
                >
                  <div className="space-y-3">
                    {availablePaymentMethods
                      .sort((a, b) => {
                        return a.provider_id > b.provider_id ? 1 : -1
                      })
                      .map((paymentMethod) => {
                        return (
                          <PaymentContainer
                            paymentInfoMap={paymentInfoMap}
                            paymentProviderId={paymentMethod.id}
                            key={paymentMethod.id}
                            selectedPaymentOptionId={selectedPaymentMethod}
                          />
                        )
                      })}
                  </div>
                </RadioGroup>
                {stripeReady &&
                  selectedPaymentMethod === "pp_stripe_stripe" && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 mb-3">
                        Voer uw kaartgegevens in:
                      </p>
                      <CardElement
                        options={useOptions as StripeCardElementOptions}
                        onChange={(e) => {
                          setCardBrand(
                            e.brand &&
                              e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                          )
                          setError(e.error?.message || null)
                          setCardComplete(e.complete)
                        }}
                      />
                    </div>
                  )}
              </>
            )}

            {paidByGiftcard && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 font-medium">Cadeaukaart</p>
              </div>
            )}

            <div className="mt-5">
              <ErrorMessage
                error={error}
                data-testid="payment-method-error-message"
              />
              <Button
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-medium"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={
                  (selectedPaymentMethod === "pp_stripe_stripe" &&
                    !cardComplete) ||
                  (!selectedPaymentMethod && !paidByGiftcard)
                }
                data-testid="submit-payment-button"
              >
                {!activeSession && isStripeFunc(selectedPaymentMethod)
                  ? "Kaartgegevens invoeren"
                  : "Volgende stap"}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {cart && paymentReady && activeSession ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded border flex items-center justify-center">
                  {paymentInfoMap[selectedPaymentMethod]?.icon || (
                    <CreditCard className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {paymentInfoMap[selectedPaymentMethod]?.title ||
                      selectedPaymentMethod}
                  </p>
                  {isStripeFunc(selectedPaymentMethod) && cardBrand && (
                    <p className="text-sm text-gray-700">{cardBrand}</p>
                  )}
                </div>
              </div>
            ) : paidByGiftcard ? (
              <p className="text-sm font-medium text-gray-900">Cadeaukaart</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export default Payment
