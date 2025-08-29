import { listCollections } from "@/lib/data/collections"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { ChevronRight } from "@medusajs/icons"
import { Heading } from "@medusajs/ui"
import Image from "next/image"

export default async function PlatformBrands() {
  try {
    // Get all collections with metadata (same as brands page)
    const { collections } = await listCollections()

    if (!collections || collections.length === 0) {
      return null
    }

    // Filter for brand collections only (same as brands page)
    const brandCollections = collections.filter(
      (collection) => collection.metadata?.is_brand === true
    )

    // Use first 12 brand collections, fallback to regular collections if no brands
    const brands =
      brandCollections.length > 0
        ? brandCollections.slice(0, 12)
        : collections.slice(0, 12)

    if (!brands || brands.length === 0) {
      return null
    }

    return (
      <section className="py-6">
        <div className="content-container">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold mb-2">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                ONZE MERKEN
              </div>
              <Heading level="h2" className="text-lg font-bold text-gray-900">
                Vertrouwde Merken op Ons Platform
              </Heading>
            </div>
            <LocalizedClientLink
              href="/brands"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors group"
            >
              {brandCollections.length > 0 ? "Alle merken" : "Alle collecties"}
              <ChevronRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </LocalizedClientLink>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {brands
              .map((brand, index) => {
                // Additional safety check
                if (!brand || !brand.handle) {
                  return null
                }

                return (
                  <LocalizedClientLink
                    key={brand.id}
                    href={`/brands/${brand.handle}`}
                    className="group"
                  >
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col items-center text-center aspect-square">
                      {/* Brand Logo - Real logo or fallback to initials */}
                      {brand.metadata?.logo ? (
                        <div className="w-8 h-8 mb-2 bg-white rounded p-1 shadow-sm border border-gray-100">
                          <Image
                            src={String(brand.metadata.logo)}
                            alt={brand.title || "Brand logo"}
                            width={24}
                            height={24}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 mb-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded flex items-center justify-center">
                          <span className="text-sm font-bold text-emerald-600">
                            {brand.title?.charAt(0).toUpperCase() || "B"}
                          </span>
                        </div>
                      )}

                      <h3 className="text-sm font-medium text-gray-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
                        {brand.title || "Unnamed Brand"}
                      </h3>
                    </div>
                  </LocalizedClientLink>
                )
              })
              .filter(Boolean)}
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error("Error loading platform brands:", error)
    return null
  }
}
