import { VariantPrice } from "@/lib/util/get-product-price"
import { Text } from "@medusajs/ui"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  // If it's a sale, show "Markt waarde" with original price crossed out and our price in sky blue
  if (price.price_type === "sale") {
    return (
      <div className="flex flex-col space-y-2">
        {/* Market Value Row */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Marktprijs:</span>
          <span className="text-xs text-gray-500 line-through font-medium">
            {price.original_price}
          </span>
        </div>

        {/* Our Price Row */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-sky-400 font-semibold">
            Onze prijs:
          </span>
          <Text
            className="text-sky-400 font-bold text-xl"
            data-testid="our-price"
          >
            {price.calculated_price}
          </Text>
        </div>
      </div>
    )
  }

  // Regular price display (no sale)
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-sky-400 font-semibold">Prijs:</span>
      <Text className="text-sky-400 font-bold text-base" data-testid="price">
        {price.calculated_price}
      </Text>
    </div>
  )
}
