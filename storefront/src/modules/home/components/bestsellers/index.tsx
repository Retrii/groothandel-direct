import { sdk } from "@/lib/config"
import { listCollections } from "@/lib/data/collections"
import { getAuthHeaders } from "@/lib/data/cookies"
import { getProductsById } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ProductPreview from "@/modules/products/components/product-preview"
import { ChevronRight } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"

export default async function Bestsellers({
  countryCode,
}: {
  countryCode: string
}) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  try {
    let products: HttpTypes.StoreProduct[] = []

    // First try: Get products from collections
    try {
      const { collections } = await listCollections({
        limit: "5",
        fields: "*products",
      })

      if (collections && collections.length > 0) {
        const allProductIds: string[] = []
        collections.forEach((collection) => {
          if (collection?.products) {
            collection.products.slice(0, 2).forEach((product) => {
              if (product.id && !allProductIds.includes(product.id)) {
                allProductIds.push(product.id)
              }
            })
          }
        })

        if (allProductIds.length > 0) {
          products = await getProductsById({
            ids: allProductIds.slice(0, 5),
            regionId: region.id,
          })
        }
      }
    } catch (collectionsError) {
      console.warn(
        "Collections failed, trying direct product fetch:",
        collectionsError
      )
    }

    // Fallback: Direct product fetch if collections failed
    if (!products || products.length === 0) {
      try {
        const headers = await getAuthHeaders()
        const response = await sdk.client.fetch<{
          products: HttpTypes.StoreProduct[]
        }>(`/store/products`, {
          credentials: "include",
          method: "GET",
          query: {
            region_id: region.id,
            limit: 5,
            fields:
              "*variants.calculated_price,*variants.inventory_quantity,*collection",
          },
          headers,
          cache: "force-cache",
        })
        products = response.products || []
      } catch (directFetchError) {
        console.error("Direct product fetch also failed:", directFetchError)
        return null
      }
    }

    if (!products || products.length === 0) {
      return null
    }

    return (
      <section className="py-6">
        <div className="content-container">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Heading level="h2" className="text-lg font-bold text-gray-900">
                Populaire Schoonmaakproducten
              </Heading>
            </div>
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors group"
            >
              Alle producten
              <ChevronRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </LocalizedClientLink>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {products.slice(0, 5).map((product, index) => (
              <div key={product.id} className="relative group">
                <ProductPreview
                  product={product}
                  region={region}
                  isFeatured={false}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error("Error loading bestsellers:", error)
    return null
  }
}
