import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Heading, Text } from "@medusajs/ui"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 - Pagina niet gevonden | Groothandel Direct",
  description:
    "De pagina die u zoekt bestaat niet. Ga terug naar uw winkelwagen of de winkel.",
}

export default async function NotFound() {
  return (
    <div className="min-h-screen  flex items-center justify-center py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-7xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
            404
          </h1>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <Heading level="h2" className="text-2xl font-bold text-gray-900 mb-4">
            Deze pagina bestaat niet
          </Heading>
          <Text className="text-lg text-gray-600 mb-8">
            De checkout-pagina die u zoekt is niet beschikbaar. Ga terug naar uw
            winkelwagen om door te gaan met bestellen.
          </Text>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <LocalizedClientLink
            href="/cart"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium hover:shadow-lg"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
            Terug naar winkelwagen
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Verder winkelen
          </LocalizedClientLink>
        </div>

        {/* Help Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <Text className="text-sm text-gray-600">
            Heeft u problemen met het afrekenen? Neem contact met ons op via{" "}
            <a
              href="tel:+31857920137"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              +31 (0)85-7920137
            </a>
          </Text>
        </div>
      </div>
    </div>
  )
}
