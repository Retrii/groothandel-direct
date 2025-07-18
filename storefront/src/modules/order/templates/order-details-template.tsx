import React from "react"

import Breadcrumb from "@/modules/common/components/breadcrumb"
import PageHeader from "@/modules/common/components/page-header"
import BillingDetails from "@/modules/order/components/billing-details"
import Item from "@/modules/order/components/item"
import OrderDetails from "@/modules/order/components/order-details"
import OrderSummary from "@/modules/order/components/order-summary"
import ShippingDetails from "@/modules/order/components/shipping-details"
import { HttpTypes } from "@medusajs/types"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  const breadcrumbItems = [
    { label: "Account", href: "/account" },
    { label: "Bestellingen", href: "/account/orders" },
    { label: `Order #${order.display_id}`, href: "#" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Order #${order.display_id}`}
        description="Bekijk de details van je bestelling"
      />

      <Breadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Producten
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <Item key={item.id} item={item} order={order} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <OrderSummary order={order} />
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <OrderDetails order={order} />
          </div>

          {(!!order.shipping_address || !!order.shipping_methods?.length) && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <ShippingDetails order={order} />
            </div>
          )}

          {!!order.billing_address && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <BillingDetails order={order} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
