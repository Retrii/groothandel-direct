"use client"

import { setBillingAddress, updateCart } from "@/lib/data/cart"
import compareAddresses from "@/lib/util/compare-addresses"
import BillingAddressForm from "@/modules/checkout/components/billing-address-form"
import ErrorMessage from "@/modules/checkout/components/error-message"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import CheckboxWithLabel from "@/modules/common/components/checkbox"
import { B2BCart } from "@/types"
import { ApprovalStatusType } from "@/types/approval"
import { useToggleState } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

const BillingAddress = ({ cart }: { cart: B2BCart | null }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [error, setError] = useState<string | null>(null)

  const isOpen = searchParams.get("step") === "billing-address"

  const cartApprovalStatus = cart?.approval_status?.status

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : false
  )

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )
  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "billing-address"), {
      scroll: false,
    })
  }

  const handleToggleSameAsBilling = async () => {
    toggleSameAsBilling()
    sameAsBilling && handleEdit()

    if (!sameAsBilling && cart?.shipping_address) {
      const { id, ...billing_address } = cart.shipping_address
      await updateCart({ billing_address })
      router.push(pathname + "?step=delivery", { scroll: false })
    }
  }

  const handleSubmit = async (formData: FormData) => {
    await setBillingAddress(formData).catch((e) => {
      setError(e.message)
      return
    })

    router.push(pathname + "?step=delivery", { scroll: false })
  }

  return (
    <div className="px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Factuuradres</h2>
          <p className="text-sm text-gray-600 mt-1">
            Waar moet de factuur naartoe?
          </p>
        </div>

        {cart?.shipping_address?.address_1 && (
          <div className="flex items-center">
            <CheckboxWithLabel
              disabled={cartApprovalStatus === ApprovalStatusType.PENDING}
              label="Zelfde als verzendadres"
              name="same_as_billing"
              checked={sameAsBilling}
              onChange={handleToggleSameAsBilling}
              data-testid="billing-address-checkbox"
            />
          </div>
        )}
      </div>

      <div className="mt-4">
        {isOpen ? (
          <form action={handleSubmit}>
            <BillingAddressForm cart={cart} />
            <div className="mt-5">
              <SubmitButton
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-medium"
                data-testid="submit-address-button"
              >
                Volgende stap
              </SubmitButton>
              <ErrorMessage error={error} data-testid="address-error-message" />
            </div>
          </form>
        ) : (
          cart &&
          cart.shipping_address?.address_1 &&
          cart.billing_address?.first_name && (
            <div data-testid="billing-address-summary">
              {sameAsBilling ? (
                <p className="text-sm text-gray-600 italic">
                  Zelfde als verzendadres
                </p>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    {cart.billing_address.first_name}{" "}
                    {cart.billing_address.last_name}
                  </p>
                  <p className="text-sm text-gray-700">
                    {cart.billing_address.address_2}{" "}
                    {cart.billing_address.address_1}
                  </p>
                  <p className="text-sm text-gray-700">
                    {cart.billing_address.postal_code},{" "}
                    {cart.billing_address.city}
                  </p>
                  <p className="text-sm text-gray-700">
                    {cart.billing_address.country_code?.toUpperCase()}
                  </p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default BillingAddress
