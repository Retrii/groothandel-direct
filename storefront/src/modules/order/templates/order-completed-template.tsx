"use client"

import CheckoutTotals from "@/modules/checkout/components/checkout-totals"
import Help from "@/modules/order/components/help"
import Items from "@/modules/order/components/items"
import OrderDetails from "@/modules/order/components/order-details"
import PaymentDetails from "@/modules/order/components/payment-details"
import ShippingDetails from "@/modules/order/components/shipping-details"
import { B2BOrder } from "@/types/global"
import { Heading } from "@medusajs/ui"

type OrderCompletedTemplateProps = {
  order: B2BOrder
}

export default function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="content-container py-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <Heading
              level="h1"
              className="text-2xl font-semibold text-gray-900 mb-1"
            >
              Bestelling bevestigd
            </Heading>
            <p className="text-gray-600 mb-2">
              Bedankt voor je bestelling. We gaan direct aan de slag.
            </p>
            <p className="text-sm text-gray-500">
              Ordernummer:{" "}
              <span className="font-semibold">#{order.display_id}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Order Details */}
          <div className="bg-white rounded border p-4">
            <OrderDetails order={order} />
          </div>

          {/* Order Items */}
          <div className="bg-white rounded border p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Bestelde artikelen
            </h2>
            <Items items={order.items} order={order} />
            <div className="mt-4 pt-4 border-t">
              <CheckoutTotals cartOrOrder={order} />
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded border p-4">
              <ShippingDetails order={order} />
            </div>
            <div className="bg-white rounded border p-4">
              <PaymentDetails order={order} />
            </div>
          </div>

          {/* Help */}
          <div className="bg-white rounded border p-4">
            <Help />
          </div>
        </div>
      </div>
    </div>
  )
}
