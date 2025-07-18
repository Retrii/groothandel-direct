import { listCollections } from "@/lib/data/collections"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { ChevronRight, Star } from "@medusajs/icons"
import { Heading } from "@medusajs/ui"

export default async function FeaturedBrands() {
  try {
    // Fetch collections marked as brands
    const { collections } = await listCollections({
      limit: "16",
      fields: "*metadata",
    }).catch(() => ({ collections: [] }))

    // Filter to only show collections marked as brands
    const brands = collections
      ?.filter((collection) => collection?.metadata?.is_brand === true)
      .slice(0, 8) // Show max 8 brands

    if (!brands || brands.length === 0) {
      return null
    }

    return (
      <section className="py-6">
        <div className="content-container">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="inline-flex items-center bg-sky-100 text-sky-700 px-2 py-1 rounded-full text-xs font-semibold mb-2">
                <Star className="w-3 h-3 mr-1" />
                PREMIUM MERKEN
              </div>
              <Heading level="h2" className="text-lg font-bold text-gray-900">
                Vertrouwde Merken
              </Heading>
            </div>
            <LocalizedClientLink
              href="/brands"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors group"
            >
              Alle merken
              <ChevronRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </LocalizedClientLink>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {brands.map((brand, index) => (
              <LocalizedClientLink
                key={brand.id}
                href={`/brands/${brand.handle}`}
                className="group"
              >
                <div className="bg-white rounded-lg p-4 hover:bg-gray-50 hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-green-300 aspect-square flex flex-col items-center justify-center text-center">
                  {/* Brand Logo */}
                  {brand.metadata?.logo ? (
                    <div className="w-12 h-12 mb-2 flex items-center justify-center">
                      <img
                        src={String(brand.metadata.logo)}
                        alt={brand.title}
                        className="max-w-full max-h-full object-contain filter group-hover:brightness-110 transition-all duration-200"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 mb-2 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200">
                      <span className="text-lg font-bold text-green-600">
                        {brand.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 leading-tight">
                    {brand.title}
                  </h3>
                </div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error("Error loading featured brands:", error)
    return null
  }
}
