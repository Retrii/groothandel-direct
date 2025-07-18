import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { clx, Text } from "@medusajs/ui"

export default function ProductPrice({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  if (!cheapestPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex flex-col">
      {/* Main Price */}
      <div>
        <span
          className={clx("block", {
            "text-green-600": cheapestPrice.price_type === "sale",
          })}
        >
          <Text
            className="font-bold text-3xl text-sky-400"
            data-testid="product-price"
            data-value={cheapestPrice.calculated_price_number}
          >
            {cheapestPrice.calculated_price}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            per stuk, excl. BTW
          </Text>
        </span>

        {/* Original Price if on sale */}
        {cheapestPrice.price_type === "sale" && (
          <p
            className="line-through text-gray-500 text-lg mt-2"
            data-testid="original-product-price"
            data-value={cheapestPrice.original_price_number}
          >
            {cheapestPrice.original_price}
          </p>
        )}
      </div>
    </div>
  )
}
