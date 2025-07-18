import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import InteractivePriceFilter from "./interactive-price-filter"

interface ProductFiltersProps {
  products: HttpTypes.StoreProduct[]
  filteredProducts?: HttpTypes.StoreProduct[] // For accurate counts when filtering
}

interface FilterOption {
  value: string
  label: string
  count: number
}

interface Filters {
  priceRange: { min: number; max: number; currency: string }
  tags: FilterOption[]
  brands: FilterOption[]
  options: Record<string, FilterOption[]>
}

const ProductFilters = ({
  products,
  filteredProducts,
}: ProductFiltersProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [filters, setFilters] = useState<Filters>({
    priceRange: { min: 0, max: 0, currency: "EUR" },
    tags: [],
    brands: [],
    options: {},
  })

  // State for expandable lists
  const [expandedLists, setExpandedLists] = useState<Record<string, boolean>>(
    {}
  )

  // Get active filters from URL
  const activePriceMin = searchParams.get("price_min")
  const activePriceMax = searchParams.get("price_max")
  const activeTags = searchParams.get("tags")?.split(",") || []
  const activeBrands = searchParams.get("brands")?.split(",") || []
  const activeOptions: Record<string, string[]> = {}

  // Get active option filters from URL
  searchParams.forEach((value, key) => {
    if (key.startsWith("option_")) {
      activeOptions[key] = value.split(",")
    }
  })

  // Use filteredProducts for counts if available, otherwise use products
  const productsForCounts = filteredProducts || products

  useEffect(() => {
    if (!products || products.length === 0) return

    // Calculate price range from all available products (for filter options)
    const prices = products
      .flatMap(
        (p) =>
          p.variants?.map((v) => v.calculated_price?.calculated_amount || 0) ||
          []
      )
      .filter((price) => price > 0)

    let minPrice = 0
    let maxPrice = 0
    let currency = "EUR"

    if (prices.length > 0) {
      minPrice = Math.min(...prices)
      maxPrice = Math.max(...prices)

      // Convert from cents to euros (Medusa stores prices in cents)
      minPrice = Math.floor(minPrice)
      maxPrice = Math.ceil(maxPrice)

      // Get currency from first product with price
      const firstPriceVariant = products
        .find((p) => p.variants?.some((v) => v.calculated_price?.currency_code))
        ?.variants?.find((v) => v.calculated_price?.currency_code)

      if (firstPriceVariant?.calculated_price?.currency_code) {
        currency =
          firstPriceVariant.calculated_price.currency_code.toUpperCase()
      }
    }

    // Calculate tags from all available products (for filter options)
    const tagMap = new Map<string, number>()
    products.forEach((p) => {
      p.tags?.forEach((tag) => {
        tagMap.set(tag.value, (tagMap.get(tag.value) || 0) + 1)
      })
    })

    const tags = Array.from(tagMap.entries())
      .map(([value, count]) => ({
        value,
        label: value,
        count,
      }))
      .sort((a, b) => b.count - a.count)

    // Calculate brands from all available products (for filter options)
    const brandMap = new Map<string, { count: number; title: string }>()
    products.forEach((p) => {
      if (p.collection && p.collection.metadata?.is_brand) {
        const existing = brandMap.get(p.collection.id) || {
          count: 0,
          title: p.collection.title,
        }
        brandMap.set(p.collection.id, {
          ...existing,
          count: existing.count + 1,
        })
      }
    })

    const brands = Array.from(brandMap.entries())
      .map(([id, data]) => ({
        value: id,
        label: data.title,
        count: data.count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))

    // Calculate product options from all available products (for filter options)
    const optionsMap: Record<string, Map<string, number>> = {}

    products.forEach((p) => {
      p.options?.forEach((option) => {
        if (!optionsMap[option.title]) {
          optionsMap[option.title] = new Map()
        }

        // Count unique option values for this product
        const productOptionValues = new Set<string>()
        p.variants?.forEach((variant) => {
          const optionValue = variant.options?.find(
            (vo) => vo.option_id === option.id
          )?.value
          if (optionValue) {
            productOptionValues.add(optionValue)
          }
        })

        // Add each unique option value to the count (count products, not variants)
        productOptionValues.forEach((optionValue) => {
          optionsMap[option.title].set(
            optionValue,
            (optionsMap[option.title].get(optionValue) || 0) + 1
          )
        })
      })
    })

    const options: Record<string, FilterOption[]> = {}
    Object.entries(optionsMap).forEach(([title, valueMap]) => {
      options[title] = Array.from(valueMap.entries())
        .map(([value, count]) => ({
          value,
          label: value,
          count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
    })

    const newFilters = {
      priceRange: { min: minPrice, max: maxPrice, currency },
      tags,
      brands,
      options,
    }

    setFilters(newFilters)
  }, [products, activePriceMin, activePriceMax])

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams)

    if (
      filterType === "tags" ||
      filterType === "brands" ||
      filterType.startsWith("option_")
    ) {
      const paramKey = filterType
      const currentValues = params.get(paramKey)?.split(",") || []

      if (currentValues.includes(value)) {
        const newValues = currentValues.filter((v) => v !== value)
        if (newValues.length > 0) {
          params.set(paramKey, newValues.join(","))
        } else {
          params.delete(paramKey)
        }
      } else {
        params.set(paramKey, [...currentValues, value].join(","))
      }
    }

    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilter = (filterType: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete(filterType)
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleList = (list: string) => {
    setExpandedLists((prev) => ({
      ...prev,
      [list]: !prev[list],
    }))
  }

  // Calculate accurate counts from filtered products
  const getAccurateCount = (filterType: string, value: string): number => {
    if (!productsForCounts) return 0

    switch (filterType) {
      case "tags":
        return productsForCounts.filter((p) =>
          p.tags?.some((tag) => tag.value === value)
        ).length
      case "brands":
        return productsForCounts.filter(
          (p) => p.collection?.id === value && p.collection?.metadata?.is_brand
        ).length
      default:
        if (filterType.startsWith("option_")) {
          const optionTitle = filterType
            .replace("option_", "")
            .replace(/_/g, " ")
          return productsForCounts.filter((p) => {
            // Find the option in the product
            const productOption = p.options?.find(
              (opt) => opt.title.toLowerCase() === optionTitle.toLowerCase()
            )
            if (!productOption) return false

            // Check if any variant has this option value
            return p.variants?.some((variant) =>
              variant.options?.some(
                (vo) => vo.option_id === productOption.id && vo.value === value
              )
            )
          }).length
        }
        return 0
    }
  }

  return (
    <div className="space-y-6">
      {/* Price Range Filter */}
      {filters.priceRange.max > filters.priceRange.min && (
        <InteractivePriceFilter
          minPrice={filters.priceRange.min}
          maxPrice={filters.priceRange.max}
          currency={filters.priceRange.currency}
        />
      )}

      {/* Tags Filter */}
      {filters.tags.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Eigenschappen</h3>
            {activeTags.length > 0 && (
              <button
                onClick={() => clearFilter("tags")}
                className="text-sm text-green-600 hover:text-sky-400 font-medium transition-colors duration-200"
              >
                Wissen
              </button>
            )}
          </div>

          <div className="space-y-2">
            {(expandedLists.tags ? filters.tags : filters.tags.slice(0, 5)).map(
              (tag) => {
                const count = getAccurateCount("tags", tag.value)
                const isDisabled = count === 0
                const isChecked = activeTags.includes(tag.value)

                return (
                  <label
                    key={tag.value}
                    className={`flex items-center ${
                      isDisabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer group"
                    }`}
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        value={tag.value}
                        checked={isChecked}
                        onChange={() =>
                          !isDisabled && handleFilterChange("tags", tag.value)
                        }
                        disabled={isDisabled}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                          isChecked
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 bg-gray-100"
                        }`}
                      >
                        <svg
                          className={`w-3 h-3 text-white ${
                            isChecked ? "block" : "hidden"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <span
                      className={`ml-3 text-sm flex-1 ${
                        isDisabled
                          ? "text-gray-400"
                          : "text-gray-700 group-hover:text-sky-400"
                      }`}
                    >
                      {tag.label}
                    </span>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                        isChecked
                          ? " text-green-600"
                          : " text-gray-500 group-hover:text-sky-400 "
                      }`}
                    >
                      {count}
                    </span>
                  </label>
                )
              }
            )}
            {filters.tags.length > 5 && (
              <button
                onClick={() => toggleList("tags")}
                className="text-sm text-green-600 hover:text-green-700 font-medium pt-1 transition-colors"
              >
                {expandedLists.tags
                  ? "Minder tonen"
                  : `Meer tonen (+${filters.tags.length - 5})`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Brands Filter */}
      {filters.brands.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Merken</h3>
            {activeBrands.length > 0 && (
              <button
                onClick={() => clearFilter("brands")}
                className="text-sm text-green-600 hover:text-sky-400 font-medium transition-colors duration-200"
              >
                Wissen
              </button>
            )}
          </div>

          <div className="space-y-2">
            {(expandedLists.brands
              ? filters.brands
              : filters.brands.slice(0, 5)
            ).map((brand) => {
              const count = getAccurateCount("brands", brand.value)
              const isDisabled = count === 0
              const isChecked = activeBrands.includes(brand.value)

              return (
                <label
                  key={brand.value}
                  className={`flex items-center ${
                    isDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer group"
                  }`}
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      value={brand.value}
                      checked={isChecked}
                      onChange={() =>
                        !isDisabled && handleFilterChange("brands", brand.value)
                      }
                      disabled={isDisabled}
                      className="sr-only peer"
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                        isChecked
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 bg-gray-100"
                      }`}
                    >
                      <svg
                        className={`w-3 h-3 text-white ${
                          isChecked ? "block" : "hidden"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <span
                    className={`ml-3 text-sm flex-1 ${
                      isDisabled
                        ? "text-gray-400"
                        : "text-gray-700 group-hover:text-sky-400"
                    }`}
                  >
                    {brand.label}
                  </span>
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                      isChecked
                        ? " text-green-600"
                        : " text-gray-500 group-hover:text-sky-400 "
                    }`}
                  >
                    {count}
                  </span>
                </label>
              )
            })}
            {filters.brands.length > 5 && (
              <button
                onClick={() => toggleList("brands")}
                className="text-sm text-green-600 hover:text-green-700 font-medium pt-1 transition-colors"
              >
                {expandedLists.brands
                  ? "Minder tonen"
                  : `Meer tonen (+${filters.brands.length - 5})`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Product Options Filters */}
      {Object.entries(filters.options).map(([optionTitle, options]) => {
        // Only show option filters that have at least one option with count > 0
        const hasValidOptions = options.some(
          (opt) =>
            getAccurateCount(
              `option_${optionTitle.replace(/\s+/g, "_")}`,
              opt.value
            ) > 0
        )

        if (!hasValidOptions) return null

        return (
          <div key={optionTitle}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">
                {optionTitle}
              </h3>
              {activeOptions[`option_${optionTitle.replace(/\s+/g, "_")}`]
                ?.length > 0 && (
                <button
                  onClick={() =>
                    clearFilter(`option_${optionTitle.replace(/\s+/g, "_")}`)
                  }
                  className="text-sm text-green-600 hover:text-sky-400 font-medium transition-colors duration-200"
                >
                  Wissen
                </button>
              )}
            </div>

            <div className="space-y-2">
              {(expandedLists[optionTitle] ? options : options.slice(0, 5)).map(
                (option) => {
                  const count = getAccurateCount(
                    `option_${optionTitle.replace(/\s+/g, "_")}`,
                    option.value
                  )
                  const isDisabled = count === 0
                  const isChecked =
                    activeOptions[
                      `option_${optionTitle.replace(/\s+/g, "_")}`
                    ]?.includes(option.value) || false

                  return (
                    <label
                      key={option.value}
                      className={`flex items-center ${
                        isDisabled
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer group"
                      }`}
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={isChecked}
                          onChange={() =>
                            !isDisabled &&
                            handleFilterChange(
                              `option_${optionTitle.replace(/\s+/g, "_")}`,
                              option.value
                            )
                          }
                          disabled={isDisabled}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                            isChecked
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300 bg-gray-100"
                          }`}
                        >
                          <svg
                            className={`w-3 h-3 text-white ${
                              isChecked ? "block" : "hidden"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <span
                        className={`ml-3 text-sm flex-1 ${
                          isDisabled
                            ? "text-gray-400 group-hover:text-sky-400 "
                            : "text-gray-700 group-hover:text-sky-400"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                          isChecked
                            ? " text-green-600 group-hover:text-sky-400 "
                            : " text-gray-500 group-hover:text-sky-400 "
                        }`}
                      >
                        {count}
                      </span>
                    </label>
                  )
                }
              )}
              {options.length > 5 && (
                <button
                  onClick={() => toggleList(optionTitle)}
                  className="text-sm text-green-600 hover:text-green-700 font-medium pt-1 transition-colors"
                >
                  {expandedLists[optionTitle]
                    ? "Minder tonen"
                    : `Meer tonen (+${options.length - 5})`}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProductFilters
