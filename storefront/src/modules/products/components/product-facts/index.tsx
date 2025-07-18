import {
  CheckCircleSolid,
  ExclamationCircleSolid,
  InformationCircleSolid,
} from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"

const ProductFacts = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const inventoryQuantity =
    product.variants?.reduce(
      (acc, variant) => acc + (variant.inventory_quantity ?? 0),
      0
    ) || 0

  // Determine background color based on stock status
  const getBackgroundColor = () => {
    if (inventoryQuantity > 10) return "bg-green-50"
    if (inventoryQuantity > 0) return "bg-amber-50"
    return "bg-red-50"
  }

  return (
    <div
      className={`flex flex-col gap-y-3 ${getBackgroundColor()} rounded-lg p-4`}
    >
      {/* Stock Status */}
      {inventoryQuantity > 50 ? (
        <span className="flex items-center gap-x-2 text-gray-700 text-sm font-medium">
          <CheckCircleSolid className="text-green-500 w-5 h-5" />
          Direct leverbaar ({inventoryQuantity} stuks op voorraad)
        </span>
      ) : inventoryQuantity > 10 ? (
        <span className="flex items-center gap-x-2 text-gray-700 text-sm font-medium">
          <CheckCircleSolid className="text-green-500 w-5 h-5" />
          Op voorraad ({inventoryQuantity} stuks)
        </span>
      ) : inventoryQuantity > 0 ? (
        <span className="flex items-center gap-x-2 text-amber-700 text-sm font-medium">
          <ExclamationCircleSolid className="text-amber-500 w-5 h-5" />
          Beperkte voorraad ({inventoryQuantity} stuks)
        </span>
      ) : (
        <span className="flex items-center gap-x-2 text-red-700 text-sm font-medium">
          <ExclamationCircleSolid className="text-red-500 w-5 h-5" />
          Tijdelijk uitverkocht - bestelbaar op aanvraag
        </span>
      )}

      {/* MID Code if available */}
      {product.mid_code && (
        <span className="flex items-center gap-x-2 text-gray-700 text-sm">
          <InformationCircleSolid className="w-5 h-5 text-sky-400" />
          MID: {product.mid_code}
        </span>
      )}
    </div>
  )
}

export default ProductFacts
