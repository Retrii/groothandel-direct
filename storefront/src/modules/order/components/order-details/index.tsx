import { HttpTypes } from "@medusajs/types"
import { Badge } from "@medusajs/ui"

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

  const formattedTime = createdAt.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "In behandeling",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        }
      case "completed":
        return {
          label: "Voltooid",
          color: "bg-green-100 text-green-800 border-green-200",
        }
      case "canceled":
        return {
          label: "Geannuleerd",
          color: "bg-red-100 text-red-800 border-red-200",
        }
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-800 border-gray-200",
        }
    }
  }

  const statusInfo = getStatusInfo(order.status)

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-3">
        Orderdetails
      </h3>

      <div className="space-y-2">
        <div className="flex justify-between py-1 border-b">
          <span className="text-sm text-gray-600">Ordernummer</span>
          <span className="text-sm font-semibold">#{order.display_id}</span>
        </div>

        <div className="flex justify-between py-1 border-b">
          <span className="text-sm text-gray-600">Datum</span>
          <div className="text-right">
            <div className="text-sm font-semibold">{formattedDate}</div>
            <div className="text-xs text-gray-500">{formattedTime}</div>
          </div>
        </div>

        <div className="flex justify-between py-1 border-b">
          <span className="text-sm text-gray-600">Status</span>
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
