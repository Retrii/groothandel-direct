import { listCollections } from "@/lib/data/collections"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { ShoppingCart } from "@medusajs/icons"
import { Badge, Heading } from "@medusajs/ui"

export default async function SpecialOffers() {
  try {
    // Fetch collections marked as on sale
    const { collections } = await listCollections({
      limit: "10",
      fields: "*metadata",
    }).catch(() => ({ collections: [] }))

    // Filter to only show collections marked as on sale
    const saleCollections = collections
      ?.filter((collection) => collection?.metadata?.on_sale === true)
      .slice(0, 5) // Show max 5 offers

    if (!saleCollections || saleCollections.length === 0) {
      return null
    }

    return (
      <section className="py-6 bg-white">
        <div className="content-container">
          {/* Header */}
          <div className="text-center mb-6">
            <Heading
              level="h2"
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Huidige Aanbiedingen
            </Heading>
            <p className="text-gray-600">
              Profiteer van onze scherpe aanbiedingen op schoonmaak & hygiëne
              producten
            </p>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {saleCollections.map((collection) => (
              <LocalizedClientLink
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group"
              >
                <div className="bg-white rounded-lg border border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md transition-all duration-300">
                  {/* Collection Image */}
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={
                        (collection.metadata?.image_url as string) ||
                        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&auto=format&q=80"
                      }
                      alt={collection.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Discount Badge */}
                    {collection.metadata?.discount && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-red-500 text-white font-semibold text-xs px-2 py-1">
                          -{String(collection.metadata.discount || "")}
                        </Badge>
                      </div>
                    )}

                    {/* In Stock Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                        Op voorraad
                      </Badge>
                    </div>
                  </div>

                  {/* Collection Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                      {collection.title}
                    </h3>

                    {/* Pricing */}
                    <div className="flex items-center gap-2 mb-3">
                      {collection.metadata?.sale_price && (
                        <span className="text-green-600 font-bold text-lg">
                          {collection.metadata.sale_price as string}
                        </span>
                      )}
                      {collection.metadata?.original_price && (
                        <span className="text-gray-400 line-through text-sm">
                          {collection.metadata.original_price as string}
                        </span>
                      )}
                    </div>

                    {/* View Collection Button */}
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1">
                      <ShoppingCart className="w-4 h-4" />
                      Bekijk collectie
                    </button>
                  </div>
                </div>
              </LocalizedClientLink>
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mt-6">
            <LocalizedClientLink
              href="/store?filter=sale"
              className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Alle aanbiedingen bekijken
            </LocalizedClientLink>
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error("Error loading special offers:", error)
    return null
  }
}
