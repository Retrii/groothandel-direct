"use client"

import { setContactDetails } from "@/lib/data/cart"
import { ApprovalStatusType, B2BCart, B2BCustomer } from "@/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState, useCallback } from "react"
import ContactDetailsForm from "../contact-details-form"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

const ContactDetails = ({
  cart,
  customer,
}: {
  cart: B2BCart | null
  customer: B2BCustomer | null
}) => {
  if (!cart) return null

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "contact-details"
  const isCompleted =
    cart.shipping_address?.address_1 &&
    cart.shipping_methods &&
    cart.shipping_methods?.length > 0 &&
    cart.billing_address?.address_1 &&
    cart.email

  const requiresApproval =
    cart.company?.approval_settings?.requires_admin_approval ||
    cart.company?.approval_settings?.requires_sales_manager_approval

  const cartApprovalStatus = cart?.approval_status?.status

  const customerIsAdmin = customer?.employee?.is_admin || false

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "contact-details"), {
      scroll: false,
    })
  }

  const [message, formAction] = useActionState(setContactDetails, null)

  const handleSubmit = (formData: FormData) => {
    formAction(formData)

    const step =
      requiresApproval &&
      (!customerIsAdmin || cartApprovalStatus !== ApprovalStatusType.APPROVED)
        ? "review"
        : "payment"

    router.push(pathname + "?" + createQueryString("step", step), {
      scroll: false,
    })
  }

  return (
    <div className="px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Contactgegevens</h2>
          <p className="text-sm text-gray-600 mt-1">
            Hoe kunnen we u bereiken?
          </p>
        </div>

        {!isOpen &&
          isCompleted &&
          cartApprovalStatus !== ApprovalStatusType.PENDING && (
            <button
              onClick={handleEdit}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              data-testid="edit-contact-details-button"
            >
              Bewerken
            </button>
          )}
      </div>

      <div className="mt-4">
        {isOpen ? (
          <form action={handleSubmit}>
            <ContactDetailsForm customer={customer} cart={cart} />
            <div className="mt-5">
              <SubmitButton
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-medium"
                data-testid="submit-address-button"
              >
                {requiresApproval &&
                cartApprovalStatus !== ApprovalStatusType.APPROVED &&
                !customerIsAdmin
                  ? "Bestelling controleren"
                  : "Volgende stap"}
              </SubmitButton>
              <ErrorMessage
                error={message}
                data-testid="address-error-message"
              />
            </div>
          </form>
        ) : (
          cart &&
          isCompleted && (
            <div className="space-y-3" data-testid="contact-details-summary">
              <div>
                <p className="text-sm font-medium text-gray-700">E-mailadres</p>
                <p className="text-sm text-gray-900">{cart.email}</p>
              </div>
              {(cart.metadata?.phone || customer?.phone) && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Telefoon</p>
                  <p className="text-sm text-gray-900">
                    {cart.metadata?.phone?.toString() || customer?.phone}
                  </p>
                </div>
              )}
              {cart.metadata?.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Opmerking</p>
                  <p className="text-sm text-gray-900">
                    {String(cart.metadata.notes)}
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

export default ContactDetails
