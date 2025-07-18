import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const createdAt = new Date(order.created_at)
  const formattedDate = createdAt.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <div className="p-6">
      <Heading level="h3" className="mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        Ordergegevens
      </Heading>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <Text className="text-gray-600">Ordernummer</Text>
          <Text className="font-medium text-gray-900">#{order.display_id}</Text>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <Text className="text-gray-600">Orderdatum</Text>
          <Text className="font-medium text-gray-900">{formattedDate}</Text>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <Text className="text-gray-600">Status</Text>
          <Text className="font-medium text-gray-900 capitalize">
            {order.status === "pending"
              ? "In behandeling"
              : order.status === "completed"
              ? "Voltooid"
              : order.status === "canceled"
              ? "Geannuleerd"
              : order.status}
          </Text>
        </div>

        <div className="pt-2">
          <Text className="text-gray-600">
            We hebben de orderbevestiging verzonden naar{" "}
            <span className="font-medium text-gray-900">{order.email}</span>.
          </Text>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
