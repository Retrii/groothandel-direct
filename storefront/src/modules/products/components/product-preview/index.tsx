import { HttpTypes } from "@medusajs/types"

import { getProductPrice } from "@/lib/util/get-product-price"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { clx } from "@medusajs/ui"
import Thumbnail from "../thumbnail"
import PreviewAddToCart from "./preview-add-to-cart"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  if (!product) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  const inventoryQuantity = product.variants?.[0]?.inventory_quantity

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div
        data-testid="product-wrapper"
        className="flex flex-col bg-white border border-gray-300 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:border-sky-100 overflow-hidden h-full relative backdrop-blur-sm"
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <div className="absolute inset-0 p-3 group-hover:opacity-80 transition-opacity duration-300">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="square"
              isFeatured={isFeatured}
            />
          </div>

          {/* Elegant Stock Badge */}
          <div className="absolute top-3 left-3">
            <div
              className={clx(
                "px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg border transition-all duration-300",
                {
                  "bg-emerald-400/90 text-white border-emerald-300/50 shadow-emerald-400/25":
                    inventoryQuantity && inventoryQuantity > 50,
                  "bg-amber-500/90 text-white border-amber-400/50 shadow-amber-500/25":
                    inventoryQuantity &&
                    inventoryQuantity <= 50 &&
                    inventoryQuantity > 0,
                  "bg-red-500/90 text-white border-red-400/50 shadow-red-500/25":
                    inventoryQuantity === 0,
                }
              )}
            >
              {inventoryQuantity && inventoryQuantity > 50
                ? "✓ Op voorraad"
                : inventoryQuantity && inventoryQuantity > 0
                ? `${inventoryQuantity} beschikbaar`
                : "Uitverkocht"}
            </div>
          </div>

          {/* Quick Add to Cart Button */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <PreviewAddToCart product={product} region={region} />
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 flex flex-col justify-between">
          {/* Product Info Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex w-full items-center justify-between space-x-2">
              {/* Brand Badge - sky blue primary */}
              {product.collection?.title && (
                <span className="text-sky-400 text-xs font-semibold">
                  {product.collection?.title}
                </span>
              )}

              {/* Article Number  */}
              <span className="text-xs text-gray-500 font-medium">
                {product.id?.slice(-8).toUpperCase() || ""}
              </span>
            </div>

            {/* Quantity - only show if in stock */}
            {inventoryQuantity && inventoryQuantity > 0 && (
              <div className="text-xs text-gray-600 font-medium">
                <span className="flex items-center">
                  <div
                    className={clx("w-2 h-2 rounded-full mr-1", {
                      "bg-emerald-400": inventoryQuantity > 50,
                      "bg-amber-500": inventoryQuantity <= 50,
                    })}
                  />
                  {inventoryQuantity} stuks
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Title - smaller text */}
          <h3
            className="text-gray-900 font-medium text-sm mb-3 line-clamp-2 flex-1 group-hover:text-sky-400 transition-colors duration-300 leading-relaxed"
            data-testid="product-title"
          >
            {product.title}
          </h3>

          {/* Price Display */}
          <div className="mt-auto">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
