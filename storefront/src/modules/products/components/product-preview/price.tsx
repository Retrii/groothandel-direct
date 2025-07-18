import { VariantPrice } from "@/lib/util/get-product-price"
import { Text } from "@medusajs/ui"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  // If it's a sale, show current price with original price crossed out
  if (price.price_type === "sale") {
    return (
      <div className="flex items-baseline gap-2">
        <Text
          className="text-sky-400 font-bold text-lg"
          data-testid="sale-price"
        >
          {price.calculated_price}
        </Text>
        <Text
          className="text-gray-500 line-through text-sm font-medium"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      </div>
    )
  }

  // Regular price display (no sale)
  return (
    <Text className="text-sky-400 font-bold text-lg" data-testid="price">
      {price.calculated_price}
    </Text>
  )
}
