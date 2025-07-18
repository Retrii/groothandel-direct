import { listProductsWithSort } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { parseFiltersFromSearchParams } from "@/lib/util/filter-products"
import ProductPreview from "@/modules/products/components/product-preview"
import { Pagination } from "@/modules/store/components/pagination"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import { B2BCustomer } from "@/types"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  customer_group_id?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  categoryIds,
  productsIds,
  countryCode,
  customer,
  searchParams,
  onProductsLoaded,
  currentPath,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  categoryIds?: string[]
  productsIds?: string[]
  countryCode: string
  customer?: B2BCustomer | null
  searchParams?: URLSearchParams
  onProductsLoaded?: (products: any[]) => void
  currentPath?: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  } else if (categoryIds && categoryIds.length > 0) {
    queryParams["category_id"] = categoryIds
  } else if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Parse filters from search params
  const filters = searchParams
    ? parseFiltersFromSearchParams(searchParams)
    : undefined

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
    filters,
  })

  // Call the callback with the filtered products for filter options
  if (onProductsLoaded) {
    onProductsLoaded(products)
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 medium:grid-cols-3 large:grid-cols-4 gap-6"
        data-testid="products-list"
      >
        {products.length > 0 ? (
          products.map((p) => {
            return (
              <li key={p.id}>
                <ProductPreview product={p} region={region} />
              </li>
            )
          })
        ) : (
          <div className="col-span-full w-full">
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
                  Er zijn geen producten die voldoen aan de huidige filters. Pas
                  je zoekcriteria aan of bekijk ons volledige assortiment.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={currentPath || "/store"}
                    className="btn-primary px-6 py-3 text-base"
                  >
                    Filters wissen
                  </a>
                  <a
                    href="/store"
                    className="btn-secondary px-6 py-3 text-base"
                  >
                    Alle producten bekijken
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
