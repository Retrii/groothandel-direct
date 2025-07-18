import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Thumbnail from "@/modules/products/components/thumbnail"
import { HttpTypes } from "@medusajs/types"

const PreviouslyPurchasedProduct = ({
  variant,
}: {
  variant: HttpTypes.StoreOrderLineItem
}) => {
  const { thumbnail, product_title, product_handle, title } = variant

  return (
    <LocalizedClientLink href={`/products/${product_handle}`} className="group">
      <div className="flex flex-col bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:shadow-lg hover:border-gray-500 transition-all duration-200 overflow-hidden h-full relative">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <div className="absolute inset-0 p-3 group-hover:opacity-80 transition-opacity duration-300">
            <Thumbnail thumbnail={thumbnail} size="square" />
          </div>

          {/* Previously Purchased Badge */}
          <div className="absolute top-3 left-3">
            <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/90 text-white border border-green-400/50 shadow-lg">
              Eerder gekocht
            </div>
          </div>

          {/* Quick Buy Button */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Button
              variant="secondary"
              className="w-full h-10 text-green-700 border-green-200 hover:bg-green-50 hover:border-green-300 font-medium transition-all duration-200 shadow-lg"
              onClick={(e) => e.preventDefault()}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Opnieuw kopen
            </Button>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 flex flex-col justify-between flex-1">
          {/* Product Info Row */}
          <div className="flex items-center justify-between mb-2">
            {/* Brand Badge - Show collection title if available, otherwise show nothing */}
            {variant.product?.collection?.title && (
              <span className="text-green-600 text-xs font-semibold">
                {variant.product.collection.title}
              </span>
            )}
            <span className="text-xs text-gray-500 font-medium">
              {variant.variant_sku || variant.id?.slice(-8).toUpperCase() || ""}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-sm mb-3 line-clamp-2 flex-1 transition-colors duration-300 leading-relaxed text-gray-900 group-hover:text-sky-400">
            {product_title}
          </h3>

          {/* Variant Title */}
          <p className="text-xs text-gray-500 mb-3">{title}</p>

          {/* Price Display */}
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-sky-400">
                €{variant.unit_price / 100}
              </span>
              <span className="text-xs text-gray-500">
                {variant.quantity}x gekocht
              </span>
            </div>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default PreviouslyPurchasedProduct
