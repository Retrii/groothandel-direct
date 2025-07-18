import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-3 md:gap-y-4">
        {/* SKU and Brand */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            {product.collection &&
              product.collection.metadata?.is_brand === true && (
                <LocalizedClientLink
                  href={`/brands/${product.collection.handle}`}
                  className="text-green-600 hover:text-green-700 font-semibold text-sm md:text-base transition-colors"
                >
                  {product.collection.title}
                </LocalizedClientLink>
              )}
            <span className="text-gray-500 text-xs md:text-sm">
              Art. nr:{" "}
              {product.variants?.[0]?.sku ||
                product.id?.slice(-8).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Product Title */}
        <Heading
          level="h1"
          className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        {/* Subtitle/Short Description */}
        {product.subtitle && (
          <Text
            className="text-base md:text-lg text-gray-600 leading-relaxed"
            data-testid="product-description"
          >
            {product.subtitle}
          </Text>
        )}

        {/* Professional Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2.5 md:px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800"
              >
                {tag.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
