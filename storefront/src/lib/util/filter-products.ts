import { HttpTypes } from "@medusajs/types"

export interface ProductFilters {
  price_min?: number
  price_max?: number
  tags?: string[]
  stock?: string
  brands?: string[]
  brand?: string
  category_id?: string
  options?: Record<string, string[]>
}

export function filterProducts(
  products: HttpTypes.StoreProduct[],
  filters: ProductFilters
): HttpTypes.StoreProduct[] {
  let filtered = [...products]

  // Filter by price range
  if (filters.price_min !== undefined || filters.price_max !== undefined) {
    filtered = filtered.filter((product) => {
      const productMinPrice = Math.min(
        ...(product.variants?.map(
          (v) => (v.calculated_price?.calculated_amount || Infinity) / 100
        ) || [Infinity])
      )

      if (
        filters.price_min !== undefined &&
        productMinPrice < filters.price_min
      ) {
        return false
      }

      if (
        filters.price_max !== undefined &&
        productMinPrice > filters.price_max
      ) {
        return false
      }

      return true
    })
  }

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((product) => {
      const productTags = product.tags?.map((t) => t.value) || []
      return filters.tags!.some((tag) => productTags.includes(tag))
    })
  }

  // Filter by stock status (removed as requested)

  // Filter by brands (support both single and multiple)
  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter((product) =>
      filters.brands!.includes(product.collection?.id || "")
    )
  } else if (filters.brand) {
    // Legacy single brand support
    filtered = filtered.filter(
      (product) => product.collection?.id === filters.brand
    )
  }

  // Filter by category
  if (filters.category_id) {
    filtered = filtered.filter((product) => {
      const categoryIds = product.categories?.map((c) => c.id) || []
      return categoryIds.includes(filters.category_id!)
    })
  }

  // Filter by product options
  if (filters.options && Object.keys(filters.options).length > 0) {
    filtered = filtered.filter((product) => {
      // Check each option filter
      for (const [optionKey, optionValues] of Object.entries(
        filters.options!
      )) {
        const optionTitle = optionKey.replace("option_", "").replace(/_/g, " ")

        // Find the option in the product
        const productOption = product.options?.find(
          (o) => o.title.toLowerCase() === optionTitle.toLowerCase()
        )

        if (!productOption) {
          return false // Product doesn't have this option
        }

        // Check if any variant has one of the required option values
        const hasMatchingVariant = product.variants?.some((variant) => {
          const variantOption = variant.options?.find(
            (vo) => vo.option_id === productOption.id
          )
          return variantOption && optionValues.includes(variantOption.value)
        })

        if (!hasMatchingVariant) {
          return false
        }
      }

      return true
    })
  }

  return filtered
}

export function parseFiltersFromSearchParams(
  searchParams: URLSearchParams
): ProductFilters {
  const filters: ProductFilters = {}

  const priceMin = searchParams.get("price_min")
  if (priceMin) {
    filters.price_min = parseInt(priceMin)
  }

  const priceMax = searchParams.get("price_max")
  if (priceMax) {
    filters.price_max = parseInt(priceMax)
  }

  const tags = searchParams.get("tags")
  if (tags) {
    filters.tags = tags.split(",")
  }

  const stock = searchParams.get("stock")
  if (stock) {
    filters.stock = stock
  }

  const brands = searchParams.get("brands")
  if (brands) {
    filters.brands = brands.split(",")
  }

  // Legacy single brand support
  const brand = searchParams.get("brand")
  if (brand) {
    filters.brand = brand
  }

  const categoryId = searchParams.get("category_id")
  if (categoryId) {
    filters.category_id = categoryId
  }

  // Parse option filters
  const options: Record<string, string[]> = {}
  searchParams.forEach((value, key) => {
    if (key.startsWith("option_")) {
      options[key] = value.split(",")
    }
  })

  if (Object.keys(options).length > 0) {
    filters.options = options
  }

  return filters
}
