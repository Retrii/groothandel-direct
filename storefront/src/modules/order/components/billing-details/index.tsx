import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

type BillingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const BillingDetails = ({ order }: BillingDetailsProps) => {
  if (!order.billing_address) {
    return null
  }

  return (
    <div className="p-6">
      <Heading level="h3" className="mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        Factuuradres
      </Heading>

      <div className="space-y-2 text-sm">
        {order.billing_address?.company && (
          <Text className="font-medium text-gray-900 capitalize">
            {order.billing_address.company}
          </Text>
        )}

        <Text className="text-gray-600 capitalize">
          {order.billing_address?.first_name} {order.billing_address?.last_name}
        </Text>

        {order.billing_address?.phone && (
          <Text className="text-gray-600">{order.billing_address.phone}</Text>
        )}

        <Text className="text-gray-600">
          {order.billing_address?.address_1}
          {order.billing_address?.address_2 && (
            <span>, {order.billing_address.address_2}</span>
          )}
        </Text>

        <Text className="text-gray-600">
          {order.billing_address?.postal_code} {order.billing_address?.city}
          {order.billing_address?.province && (
            <span>, {order.billing_address.province}</span>
          )}
        </Text>

        <Text className="text-gray-600 font-medium">
          {order.billing_address?.country_code?.toUpperCase()}
        </Text>
      </div>
    </div>
  )
}

export default BillingDetails
