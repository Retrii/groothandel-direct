import { listCategories } from "@/lib/data/categories"
import { retrieveCustomer } from "@/lib/data/customer"
import { listProducts } from "@/lib/data/products"
import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@/modules/store/components/refinement-list"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import StoreBreadcrumb from "@/modules/store/components/store-breadcrumb"
import PaginatedProducts from "@/modules/store/templates/paginated-products"
import { Metadata } from "next"
import { Suspense } from "react"

export const dynamicParams = true

export const metadata: Metadata = {
  title:
    "Groothandel Direct - Professionele Groothandel voor Bedrijven | 30.000+ Artikelen",
  description:
    "Ontdek onze uitgebreide collectie van meer dan 30.000 professionele artikelen voor uw bedrijf. Van kantoorbenodigdheden tot technische producten - alles voor de zakelijke markt met scherpe groothandelsprijzen.",
  keywords:
    "groothandel, B2B, bedrijfsartikelen, kantoorbenodigdheden, professionele producten, zakelijke inkoop, groothandelsprijzen",
  openGraph: {
    title: "Groothandel Direct - 30.000+ Professionele Artikelen",
    description:
      "De grootste online groothandel van Nederland. Scherpe prijzen, snelle levering en persoonlijke service voor uw bedrijf.",
    type: "website",
    images: [
      {
        url: "/og-store.jpg",
        width: 1200,
        height: 630,
        alt: "Groothandel Direct - Professionele groothandel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Groothandel Direct - Professionele Groothandel",
    description:
      "30.000+ artikelen voor bedrijven. Scherpe prijzen en snelle levering.",
  },
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  const sort = sortBy || "created_at"
  const pageNumber = page ? parseInt(page) : 1

  const categories = await listCategories()
  const customer = await retrieveCustomer()

  // Get total product count
  const {
    response: { count: totalProductCount },
  } = await listProducts({
    countryCode: params.countryCode,
    pageParam: 1,
    queryParams: { limit: 1 },
  })

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumbs Section */}
      <div className="content-container py-4">
        <StoreBreadcrumb />
      </div>

      {/* Header Section */}
      <div className="">
        <div className="content-container py-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Alle Producten
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Ontdek meer dan 30.000 professionele artikelen voor uw bedrijf
            </p>
            <div className="flex items-center text-sm text-gray-600">
              <span>{totalProductCount.toLocaleString()} producten</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Filters
              </h2>
              <RefinementList sortBy={sort} categories={categories} />
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Suspense fallback={<SkeletonProductGrid />}>
                <PaginatedProducts
                  sortBy={sort}
                  page={pageNumber}
                  countryCode={params.countryCode}
                  customer={customer}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="content-container py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Groothandel Direct - Uw Betrouwbare Partner voor Zakelijke Inkoop
            </h2>

            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-6">
                <strong>Groothandel Direct</strong> is dé specialist in
                professionele groothandel voor bedrijven in Nederland. Met meer
                dan <strong>30.000 artikelen</strong> op voorraad bedienen wij
                uitsluitend zakelijke klanten met de scherpste
                groothandelsprijzen en uitstekende service.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Waarom Groothandel Direct?
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        <strong>Exclusief B2B prijzen</strong> - Geen
                        particuliere verkoop
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        <strong>Gratis verzending</strong> vanaf €150 (excl.
                        BTW)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        <strong>Snelle levering</strong> - Voor 15:00 besteld,
                        zelfde dag verzonden
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        <strong>Persoonlijke accountmanagers</strong> voor
                        optimale service
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Ons Productassortiment
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Van <strong>kantoorbenodigdheden</strong> en{" "}
                    <strong>technische producten</strong> tot
                    <strong> sanitaire artikelen</strong> en{" "}
                    <strong>verpakkingsmaterialen</strong> - wij hebben alles
                    wat uw bedrijf nodig heeft.
                  </p>
                  <p className="text-gray-700">
                    Onze producten komen van betrouwbare A-merken en zijn
                    speciaal geselecteerd voor professioneel gebruik. Kwaliteit
                    en betrouwbaarheid staan bij ons voorop.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Zakelijke Klanten Welkom
                </h3>
                <p className="text-gray-700 mb-0">
                  Groothandel Direct richt zich uitsluitend op{" "}
                  <strong>zakelijke klanten</strong>. Of u nu een klein bedrijf,
                  MKB onderneming of grote corporatie bent - wij bieden
                  maatwerkoplossingen met{" "}
                  <strong>scherpe groothandelsprijzen</strong>,
                  <strong>betalingsfaciliteiten</strong> en{" "}
                  <strong>persoonlijke service</strong>
                  die past bij uw bedrijfsbehoeften.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
