import { listRegions } from "@/lib/data/regions"
import Bestsellers from "@/modules/home/components/bestsellers"
import FeaturedBrands from "@/modules/home/components/featured-brands"
import FeaturedCategories from "@/modules/home/components/featured-categories"
import LatestArticles from "@/modules/home/components/latest-articles"
import MarketingBlocks from "@/modules/home/components/marketing-blocks"
import PlatformBrands from "@/modules/home/components/platform-brands"
import SeoCtaSection from "@/modules/home/components/seo-cta-section"
import SpecialOffers from "@/modules/home/components/special-offers"
import { Metadata } from "next"
import { Suspense } from "react"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "Groothandel Direct - B2B Producten voor Professionals",
  description:
    "Groothandel Direct is uw betrouwbare partner voor B2B producten. Scherpe groothandelsprijzen, uitgebreid assortiment en persoonlijke service voor zakelijke klanten.",
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then(
    (regions) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )
  return countryCodes.map((countryCode) => ({ countryCode }))
}

// Enhanced loading components
const LoadingSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
)

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  return (
    <div className="flex flex-col">
      {/* Marketing Blocks (replaces Hero) */}
      <section className="py-6">
        <div className="content-container">
          <MarketingBlocks />
        </div>
      </section>

      {/* Featured Categories */}
      <Suspense
        fallback={
          <section className="py-6">
            <div className="content-container">
              <div className="mb-4">
                <LoadingSkeleton className="h-6 w-48 mb-1" />
                <LoadingSkeleton className="h-3 w-72" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[...Array(6)].map((_, i) => (
                  <LoadingSkeleton
                    key={i}
                    className="aspect-[4/3] rounded-lg"
                  />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <FeaturedCategories />
      </Suspense>

      {/* Special Offers */}
      <SpecialOffers />

      {/* Bestsellers */}
      <Suspense
        fallback={
          <section className="py-6">
            <div className="content-container">
              <div className="text-center mb-4">
                <LoadingSkeleton className="h-6 w-32 mx-auto mb-1" />
                <LoadingSkeleton className="h-3 w-48 mx-auto" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg">
                    <LoadingSkeleton className="aspect-square rounded-t-lg" />
                    <div className="p-2">
                      <LoadingSkeleton className="h-3 w-full mb-1" />
                      <LoadingSkeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        }
      >
        <Bestsellers countryCode={countryCode} />
      </Suspense>

      {/* Featured Brands */}
      <Suspense
        fallback={
          <section className="py-6">
            <div className="content-container">
              <div className="text-center mb-4">
                <LoadingSkeleton className="h-6 w-32 mx-auto mb-1" />
                <LoadingSkeleton className="h-3 w-48 mx-auto" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <LoadingSkeleton
                    key={i}
                    className="aspect-square rounded-lg"
                  />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <FeaturedBrands />
      </Suspense>

      {/* Platform Brands */}
      <Suspense
        fallback={
          <section className="py-8 bg-gradient-to-r from-gray-50 to-white">
            <div className="content-container">
              <div className="text-center mb-8">
                <LoadingSkeleton className="h-6 w-48 mx-auto mb-4" />
                <LoadingSkeleton className="h-8 w-64 mx-auto mb-2" />
                <LoadingSkeleton className="h-4 w-96 mx-auto" />
              </div>
              <div className="flex gap-6 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <LoadingSkeleton
                    key={i}
                    className="w-40 h-32 rounded-xl flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <PlatformBrands />
      </Suspense>

      {/* Latest Articles */}
      <LatestArticles />

      {/* SEO Content & CTA */}
      <SeoCtaSection />
    </div>
  )
}
