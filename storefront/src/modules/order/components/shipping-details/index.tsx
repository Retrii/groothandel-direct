import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  if (!order.shipping_address) {
    return null
  }

  return (
    <div className="p-6">
      <Heading level="h3" className="mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        Verzendadres
      </Heading>

      <div className="space-y-2 text-sm">
        {order.shipping_address?.company && (
          <Text className="font-medium text-gray-900 capitalize">
            {order.shipping_address.company}
          </Text>
        )}

        <Text className="text-gray-600 capitalize">
          {order.shipping_address?.first_name}{" "}
          {order.shipping_address?.last_name}
        </Text>

        {order.shipping_address?.phone && (
          <Text className="text-gray-600">{order.shipping_address.phone}</Text>
        )}

        <Text className="text-gray-600">
          {order.shipping_address?.address_1}
          {order.shipping_address?.address_2 && (
            <span>, {order.shipping_address.address_2}</span>
          )}
        </Text>

        <Text className="text-gray-600">
          {order.shipping_address?.postal_code} {order.shipping_address?.city}
          {order.shipping_address?.province && (
            <span>, {order.shipping_address.province}</span>
          )}
        </Text>

        <Text className="text-gray-600 font-medium">
          {order.shipping_address?.country_code?.toUpperCase()}
        </Text>
      </div>

      {order.shipping_methods && order.shipping_methods.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Text className="text-sm font-medium text-gray-900 mb-2">
            Verzendmethode
          </Text>
          {order.shipping_methods.map((method, index) => (
            <Text key={index} className="text-sm text-gray-600">
              {method.name}
            </Text>
          ))}
        </div>
      )}
    </div>
  )
}

export default ShippingDetails
