import { listCollections } from "@/lib/data/collections"
import { getRegion } from "@/lib/data/regions"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Button, Heading } from "@medusajs/ui"
import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

type Props = {
  params: { countryCode: string }
}

export const metadata: Metadata = {
  title: "Merken | Groothandel Direct",
  description:
    "Ontdek alle merken in onze groothandel. Professionele schoonmaakmiddelen van topmerken.",
}

export default async function BrandsPage({ params }: Props) {
  const { countryCode } = await params

  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  // Get all collections with metadata
  const { collections } = await listCollections()

  // Filter for brand collections only
  const brandCollections = collections.filter(
    (collection) => collection.metadata?.is_brand === true
  )

  if (brandCollections.length === 0) {
    return (
      <div className="content-container py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Merken</h1>
          <p className="text-gray-600">
            Er zijn momenteel geen merken beschikbaar.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="content-container py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <Heading
          level="h1"
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
        >
          Onze Merken
        </Heading>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Ontdek onze selectie van topmerken voor professionele
          schoonmaakmiddelen en industriële oplossingen. Kwaliteit die u kunt
          vertrouwen.
        </p>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {brandCollections.map((brand) => (
          <div
            key={brand.id}
            className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Brand Logo */}
            <div className="p-8 text-center border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
              {brand.metadata?.logo ? (
                <div className="w-20 h-20 mx-auto bg-white rounded-xl p-4 shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                  <Image
                    src={brand.metadata.logo ? String(brand.metadata.logo) : ""}
                    alt={brand.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl flex items-center justify-center group-hover:from-green-100 group-hover:to-green-200 transition-colors">
                  <span className="text-2xl font-bold text-green-600">
                    {brand.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Brand Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                {brand.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {brand.metadata?.description
                  ? String(brand.metadata.description)
                  : "Ontdek de hoogwaardige producten van dit merk voor al uw professionele behoeften."}
              </p>

              {/* CTA Button */}
              <LocalizedClientLink
                href={`/brands/${brand.handle}`}
                className="block"
              >
                <Button
                  variant="secondary"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 py-3 font-medium"
                >
                  <span className="flex items-center justify-center gap-2">
                    Bekijk alle producten
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </Button>
              </LocalizedClientLink>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Kwaliteit en betrouwbaarheid
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Al onze merken zijn zorgvuldig geselecteerd op basis van kwaliteit,
            betrouwbaarheid en prestaties. Perfect voor professioneel gebruik in
            elke branche.
          </p>
        </div>
      </div>
    </div>
  )
}
