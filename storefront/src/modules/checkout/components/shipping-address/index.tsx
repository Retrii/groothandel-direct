"use client"

import { setShippingAddress } from "@/lib/data/cart"
import ErrorMessage from "@/modules/checkout/components/error-message"
import ShippingAddressForm from "@/modules/checkout/components/shipping-address-form"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import { B2BCart, B2BCustomer } from "@/types"
import { ApprovalStatusType } from "@/types/approval"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

const ShippingAddress = ({
  cart,
  customer,
}: {
  cart: B2BCart | null
  customer: B2BCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [error, setError] = useState<string | null>(null)

  const isOpen = searchParams.get("step") === "shipping-address"

  const cartApprovalStatus = cart?.approval_status?.status

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )
  const handleEdit = () => {
    router.push(
      pathname + "?" + createQueryString("step", "shipping-address"),
      { scroll: false }
    )
  }

  const handleSubmit = async (formData: FormData) => {
    await setShippingAddress(formData).catch((e) => {
      setError(e.message)
      return
    })

    router.push(pathname + "?" + createQueryString("step", "billing-address"), {
      scroll: false,
    })
  }

  return (
    <div className="px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Verzendadres</h2>
          <p className="text-sm text-gray-600 mt-1">
            Waar moet uw bestelling naartoe?
          </p>
        </div>

        {!isOpen &&
          cart?.shipping_address &&
          cartApprovalStatus !== ApprovalStatusType.PENDING && (
            <button
              onClick={handleEdit}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              data-testid="edit-address-button"
            >
              Bewerken
            </button>
          )}
      </div>

      <div className="mt-4">
        {isOpen ? (
          <form action={handleSubmit}>
            <ShippingAddressForm customer={customer} cart={cart} />
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
          <div>
            {cart && cart.shipping_address ? (
              <div className="space-y-1" data-testid="shipping-address-summary">
                <p className="text-sm font-medium text-gray-900">
                  {cart.shipping_address.first_name}{" "}
                  {cart.shipping_address.last_name}
                </p>
                <p className="text-sm text-gray-700">
                  {cart.shipping_address.address_2}{" "}
                  {cart.shipping_address.address_1}
                </p>
                <p className="text-sm text-gray-700">
                  {cart.shipping_address.postal_code},{" "}
                  {cart.shipping_address.city}
                </p>
                <p className="text-sm text-gray-700">
                  {cart.shipping_address.country_code?.toUpperCase()}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShippingAddress
