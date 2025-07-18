"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { listProducts } from "@/lib/data/products"
import { HttpTypes } from "@medusajs/types"
import CategoryList from "./category-list"
import MobileRefinement from "./mobile-refinement"
import ProductFilters from "./product-filters"
import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  listName?: string
  "data-testid"?: string
  categories?: HttpTypes.StoreProductCategory[]
  currentCategory?: HttpTypes.StoreProductCategory
  collectionId?: string
  countryCode?: string
  products?: HttpTypes.StoreProduct[] // For filter options (initial products from the page)
  filteredProducts?: HttpTypes.StoreProduct[] // For accurate counts when filtering
}

const RefinementList = ({
  sortBy,
  listName,
  "data-testid": dataTestId,
  categories,
  currentCategory,
  collectionId,
  countryCode,
  products: initialProducts,
  filteredProducts,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>(
    initialProducts || []
  )
  const [isLoading, setIsLoading] = useState(!initialProducts)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  // Update products when initialProducts change (from server-side)
  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts)
      setIsLoading(false)
    }
  }, [initialProducts])

  // Use server-side products if available, otherwise fetch client-side
  useEffect(() => {
    if (initialProducts) {
      return
    }

    // Only fetch if no server-side products and countryCode is available
    if (!countryCode) return

    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const queryParams: any = {
          limit: 1000, // Get many products for accurate filter calculation
          fields:
            "*variants.calculated_price,*variants.inventory_quantity,*variants.options,*tags,*categories,*collection,*options",
        }

        // Add collection filter if on collection/brand page
        if (collectionId) {
          queryParams.collection_id = [collectionId]
        }

        // Add category filter if on category page
        if (currentCategory) {
          queryParams.category_id = [currentCategory.id]
        }

        const result = await listProducts({
          pageParam: 1,
          queryParams,
          countryCode,
        })

        setProducts(result.response.products)
      } catch (error) {
        console.error("Error fetching products for filters:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [countryCode, collectionId, currentCategory?.id, initialProducts])

  return (
    <>
      {/* Mobile Filter Button and Dialog */}
      <MobileRefinement
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
        categories={categories}
        currentCategory={currentCategory}
        listName={listName}
        products={products}
        isLoading={isLoading}
      />

      {/* Desktop Filters - Hidden on Mobile */}
      <div className="hidden lg:block space-y-6">
        {/* Sort */}
        <SortProducts
          sortBy={sortBy}
          setQueryParams={setQueryParams}
          data-testid={dataTestId}
        />

        {/* Categories */}
        {categories && (
          <CategoryList
            categories={categories}
            currentCategory={currentCategory}
          />
        )}

        {/* Product Filters */}
        {!isLoading && products.length > 0 && (
          <ProductFilters
            products={products}
            filteredProducts={filteredProducts}
          />
        )}
      </div>
    </>
  )
}

export default RefinementList
