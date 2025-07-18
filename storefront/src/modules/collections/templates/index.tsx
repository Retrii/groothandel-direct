import { listCategories } from "@/lib/data/categories"
import CollectionBreadcrumb from "@/modules/collections/collection-breadcrumb"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@/modules/store/components/refinement-list"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@/modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { Suspense } from "react"

export default async function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  searchParams,
  products,
  filteredProducts,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  searchParams?: URLSearchParams
  products?: HttpTypes.StoreProduct[]
  filteredProducts?: HttpTypes.StoreProduct[]
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const productCount = collection.products?.length || 0
  const isBrand = collection.metadata?.is_brand === true

  // Get categories for brand products
  let categories: HttpTypes.StoreProductCategory[] = []
  if (isBrand && collection.id) {
    try {
      // Get all categories
      const allCategories = await listCategories()

      // Filter categories that have products from this collection
      // Since we can't easily filter by collection from the frontend,
      // we'll show all categories but PaginatedProducts will handle
      // the actual filtering when category is selected
      categories = allCategories
    } catch (error) {
      console.error("Failed to fetch categories for brand:", error)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs Section */}
      <div className="content-container py-4">
        <CollectionBreadcrumb collection={collection} />
      </div>

      {/* Brand Header Section - Only for brands */}
      {isBrand && (
        <div className="content-container mb-8">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Brand Logo */}
              <div className="flex-shrink-0">
                {collection.metadata?.logo ? (
                  <div className="w-24 h-24 bg-white rounded-lg p-4 flex items-center justify-center shadow-sm">
                    <img
                      src={String(collection.metadata.logo)}
                      alt={collection.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-white rounded-lg p-4 flex items-center justify-center shadow-sm">
                    <span className="text-3xl font-bold text-sky-400">
                      {collection.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Brand Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {collection.title}
                </h1>

                {(collection.metadata?.description as string) && (
                  <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg">
                    {collection.metadata?.description as string}
                  </p>
                )}

                <p className="text-sm md:text-base text-gray-600">
                  {filteredProducts?.length || 0}{" "}
                  {(filteredProducts?.length || 0) === 1
                    ? "product"
                    : "producten"}{" "}
                  beschikbaar
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="content-container pt-0 sm:pt-6 pb-24 lg:pb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar - Hidden on Mobile */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Filters
              </h2>
              <RefinementList
                sortBy={sort}
                listName={collection.title}
                data-testid="sort-by-container"
                categories={isBrand ? categories : undefined}
                countryCode={countryCode}
                collectionId={collection.id}
                products={products}
                filteredProducts={filteredProducts}
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Header - Only for non-brand collections */}
            {!isBrand && (
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      {collection.title}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {(collection.metadata?.description as string) ||
                        `Ontdek onze ${collection.title?.toLowerCase()} collectie`}
                    </p>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {filteredProducts?.length || 0} producten
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Filters */}
            <div className="lg:hidden">
              <RefinementList
                sortBy={sort}
                listName={collection.title}
                data-testid="sort-by-container"
                categories={isBrand ? categories : undefined}
                countryCode={countryCode}
                collectionId={collection.id}
                products={products}
                filteredProducts={filteredProducts}
              />
            </div>

            {/* Products */}
            {(filteredProducts?.length || 0) === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-center max-w-lg">
                  {/* Icon */}
                  <div className="mb-6">
                    <svg
                      className="w-24 h-24 mx-auto text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Geen producten gevonden
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-8 text-base">
                    Er zijn geen producten die voldoen aan de huidige filters in
                    deze collectie. Pas je zoekcriteria aan of bekijk andere
                    producten.
                  </p>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <LocalizedClientLink
                      href={`/collections/${collection.handle}`}
                      className="btn-primary px-6 py-3 text-base inline-block"
                    >
                      Filters wissen
                    </LocalizedClientLink>
                    <LocalizedClientLink
                      href="/store"
                      className="btn-secondary px-6 py-3 text-base inline-block"
                    >
                      Alle producten bekijken
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            ) : (
              <Suspense fallback={<SkeletonProductGrid />}>
                <PaginatedProducts
                  sortBy={sortBy || "created_at"}
                  page={pageNumber}
                  collectionId={collection.id}
                  countryCode={countryCode}
                  customer={null}
                  searchParams={searchParams}
                  currentPath={`/collections/${collection.handle}`}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>

      {/* SEO Content Section - Optioneel */}
      {(collection.metadata?.long_description as string) && (
        <div className="bg-white border-t border-gray-200">
          <div className="content-container py-12">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-lg leading-relaxed">
                  {collection.metadata?.long_description as string}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
