import { listCartShippingMethods } from "@/lib/data/fulfillment"
import { listCartPaymentMethods } from "@/lib/data/payment"
import ApprovalStatusBanner from "@/modules/cart/components/approval-status-banner"
import BillingAddress from "@/modules/checkout/components/billing-address"
import Company from "@/modules/checkout/components/company"
import ContactDetails from "@/modules/checkout/components/contact-details"
import Payment from "@/modules/checkout/components/payment"
import Shipping from "@/modules/checkout/components/shipping"
import ShippingAddress from "@/modules/checkout/components/shipping-address"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { ApprovalStatusType, B2BCart, B2BCustomer } from "@/types"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: B2BCart | null
  customer: B2BCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")
  const requiresApproval =
    cart.company?.approval_settings?.requires_admin_approval ||
    cart.company?.approval_settings?.requires_sales_manager_approval

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Afrekenen</h1>
          <LocalizedClientLink
            href="/cart"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Terug naar winkelwagen
          </LocalizedClientLink>
        </div>

        {/* Approval Status Banner */}
        {cart.approval_status &&
          cart.approval_status.status !== ApprovalStatusType.APPROVED && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <ApprovalStatusBanner cart={cart} />
            </div>
          )}
      </div>

      {/* Checkout Form */}
      <div className="divide-y divide-gray-200">
        {/* Contact Details */}
        <ContactDetails cart={cart} customer={customer} />

        {/* Company Info */}
        {cart?.company && <Company cart={cart} />}

        {/* Shipping Address */}
        <ShippingAddress cart={cart} customer={customer} />

        {/* Billing Address */}
        <BillingAddress cart={cart} />

        {/* Shipping Method */}
        <Shipping cart={cart} availableShippingMethods={shippingMethods} />

        {/* Payment */}
        {((customer?.employee?.is_admin &&
          cart.approval_status?.status === ApprovalStatusType.APPROVED) ||
          !requiresApproval) && (
          <Payment cart={cart} availablePaymentMethods={paymentMethods} />
        )}
      </div>
    </div>
  )
}
