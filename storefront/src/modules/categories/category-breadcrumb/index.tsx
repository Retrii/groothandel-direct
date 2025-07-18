import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import type { JSX } from "react"

const CategoryBreadcrumbItem = ({
  title,
  handle,
  isLast = false,
}: {
  title: string
  handle?: string
  isLast?: boolean
}) => {
  if (isLast) {
    return <span className="text-gray-900 font-medium text-sm">{title}</span>
  }

  return (
    <LocalizedClientLink
      className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
      href={handle ? `/categories/${handle}` : "/store"}
    >
      {title}
    </LocalizedClientLink>
  )
}

const CategoryBreadcrumb = ({
  categories,
  category,
}: {
  categories: HttpTypes.StoreProductCategory[]
  category: HttpTypes.StoreProductCategory
}) => {
  // Find parent category for mobile back button
  const parentCategory = category.parent_category_id
    ? categories.find((c) => c.id === category.parent_category_id)
    : null

  const generateBreadcrumbs = (
    category: HttpTypes.StoreProductCategory
  ): JSX.Element[] => {
    let currentCategory: HttpTypes.StoreProductCategory | null = category
    const breadcrumbs: JSX.Element[] = []

    // Add current category as last item
    breadcrumbs.unshift(
      <li key={currentCategory.id} className="flex items-center">
        <CategoryBreadcrumbItem
          title={currentCategory.name}
          handle={currentCategory.handle}
          isLast={true}
        />
      </li>
    )

    currentCategory =
      categories.find((c) => c.id === currentCategory?.parent_category_id) ||
      null

    while (currentCategory) {
      // Add separator
      breadcrumbs.unshift(
        <li
          key={`separator-parent-${currentCategory.id}`}
          className="flex items-center"
        >
          <svg
            className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </li>
      )

      // Add parent category
      breadcrumbs.unshift(
        <li key={currentCategory.id} className="flex items-center">
          <CategoryBreadcrumbItem
            title={currentCategory.name}
            handle={currentCategory.handle}
          />
        </li>
      )

      currentCategory =
        categories.find((c) => c.id === currentCategory?.parent_category_id) ||
        null
    }

    // Add separator before all products
    breadcrumbs.unshift(
      <li key="separator-parent-base" className="flex items-center">
        <svg
          className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </li>
    )

    // Add "All Products" as base
    breadcrumbs.unshift(
      <li key="base" className="flex items-center">
        <CategoryBreadcrumbItem title="Alle Producten" />
      </li>
    )

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs(category)

  return (
    <nav className="bg-white rounded-lg border border-gray-200 px-3 sm:px-4 py-3 shadow-sm">
      {/* Mobile: Simple back button */}
      <div className="sm:hidden">
        <LocalizedClientLink
          href={
            parentCategory ? `/categories/${parentCategory.handle}` : "/store"
          }
          className="flex items-center text-gray-600 hover:text-green-600 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">
            {parentCategory
              ? `Terug naar ${parentCategory.name}`
              : "Terug naar alle producten"}
          </span>
        </LocalizedClientLink>
      </div>

      {/* Desktop: Full breadcrumb */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto">
          <ol className="flex items-center space-x-2 whitespace-nowrap">
            <li className="flex items-center flex-shrink-0">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <LocalizedClientLink
                  href="/"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  Home
                </LocalizedClientLink>
              </div>
            </li>
            <li className="flex items-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            {breadcrumbs}
          </ol>
        </div>
      </div>
    </nav>
  )
}

export default CategoryBreadcrumb
