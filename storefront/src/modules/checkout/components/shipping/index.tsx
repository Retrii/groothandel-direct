"use client"

import { setShippingMethod } from "@/lib/data/cart"
import { convertToLocale } from "@/lib/util/money"
import ErrorMessage from "@/modules/checkout/components/error-message"
import Button from "@/modules/common/components/button"
import Radio from "@/modules/common/components/radio"
import { ApprovalStatusType, B2BCart } from "@/types"
import { RadioGroup, Radio as RadioGroupOption } from "@headlessui/react"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type ShippingProps = {
  cart: B2BCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const cartApprovalStatus = cart?.approval_status?.status

  const selectedShippingMethod = availableShippingMethods?.find(
    (method) => method.id === cart.shipping_methods?.at(-1)?.shipping_option_id
  )

  const selectedMethodId = selectedShippingMethod?.id || ""

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=contact-details", { scroll: false })
  }

  const set = async (id: string) => {
    setIsLoading(true)
    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Verzendmethode</h2>
          <p className="text-sm text-gray-600 mt-1">
            Hoe wilt u uw bestelling ontvangen?
          </p>
        </div>

        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email &&
          cartApprovalStatus !== ApprovalStatusType.PENDING && (
            <button
              onClick={handleEdit}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              data-testid="edit-delivery-button"
            >
              Bewerken
            </button>
          )}
      </div>

      <div className="mt-4">
        {isOpen ? (
          <div data-testid="delivery-options-container">
            <RadioGroup value={selectedMethodId} onChange={set}>
              <div className="space-y-3">
                {availableShippingMethods?.map((option) => (
                  <RadioGroupOption
                    key={option.id}
                    value={option.id}
                    data-testid="delivery-option-radio"
                    className={clx(
                      "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors",
                      {
                        "border-blue-500 bg-blue-50":
                          option.id === selectedShippingMethod?.id,
                        "border-gray-200 hover:border-gray-300":
                          option.id !== selectedShippingMethod?.id,
                      }
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <Radio
                        checked={option.id === selectedShippingMethod?.id}
                      />
                      <span className="font-medium text-gray-900">
                        {option.name}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {convertToLocale({
                        amount: option.amount!,
                        currency_code: cart?.currency_code,
                      })}
                    </span>
                  </RadioGroupOption>
                ))}
              </div>
            </RadioGroup>

            <div className="mt-5">
              <ErrorMessage
                error={error}
                data-testid="delivery-option-error-message"
              />
              <Button
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-medium"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={!cart.shipping_methods?.[0]}
                data-testid="submit-delivery-option-button"
              >
                Volgende stap
              </Button>
            </div>
          </div>
        ) : (
          cart.shipping_methods &&
          cart.shipping_methods?.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">
                {selectedShippingMethod?.name}
              </p>
              <p className="text-sm text-gray-700">
                {convertToLocale({
                  amount: selectedShippingMethod?.amount!,
                  currency_code: cart?.currency_code,
                })}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default Shipping
