import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { usePathname, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const CategoryList = ({
  categories,
  currentCategory,
}: {
  categories: HttpTypes.StoreProductCategory[]
  currentCategory?: HttpTypes.StoreProductCategory
}) => {
  const getCategoriesToExpand = useCallback(
    (category: HttpTypes.StoreProductCategory) => {
      const categoriesToExpand = [category.id]
      let current = category
      while (current.parent_category_id) {
        categoriesToExpand.push(current.parent_category_id)
        current = categories.find(
          (cat) => cat.id === current.parent_category_id
        ) as HttpTypes.StoreProductCategory
      }
      return categoriesToExpand
    },
    [categories]
  )

  const [expandedCategories, setExpandedCategories] = useState<string[]>(() =>
    currentCategory ? getCategoriesToExpand(currentCategory) : []
  )

  const pathname = usePathname()

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const searchParams = useSearchParams()

  const isCurrentCategory = (handle: string) =>
    pathname.split("/").slice(2).join("/") === `categories/${handle}`

  useEffect(() => {
    if (currentCategory) {
      const categoriesToExpand = getCategoriesToExpand(currentCategory)
      setExpandedCategories((prev) => {
        const newCategories = categoriesToExpand.filter(
          (cat) => !prev.includes(cat)
        )
        return newCategories.length ? [...prev, ...newCategories] : prev
      })
    }
  }, [currentCategory, getCategoriesToExpand])

  const getCategoryMarginLeft = useCallback(
    (category: HttpTypes.StoreProductCategory) => {
      let level = 0
      let currentCategory = category
      while (currentCategory.parent_category_id) {
        level++
        currentCategory = categories.find(
          (cat) => cat.id === currentCategory.parent_category_id
        ) as HttpTypes.StoreProductCategory
      }
      return level * 20
    },
    [categories]
  )

  const renderCategory = (category: HttpTypes.StoreProductCategory) => {
    const hasChildren = category.category_children.length > 0
    const isExpanded = expandedCategories.includes(category.id)
    const paddingLeft = getCategoryMarginLeft(category)
    const isActive = isCurrentCategory(category.handle)

    return (
      <li key={category.id} className="mb-1">
        <div className="flex items-center group" style={{ paddingLeft }}>
          {hasChildren ? (
            <div className="flex items-center w-full">
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex items-center justify-center w-6 h-6 mr-3 hover:bg-emerald-50 rounded-md transition-colors duration-200 group-hover:bg-emerald-50"
              >
                {isExpanded ? (
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-emerald-600"
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
                )}
              </button>
              <LocalizedClientLink
                href={`/categories/${category.handle}${
                  searchParams.size ? `?${searchParams.toString()}` : ""
                }`}
                className={`flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-50/50 text-emerald-800 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
                }`}
              >
                <span className="flex items-center">
                  <span className="truncate">{category.name}</span>
                </span>
                <span
                  className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                    isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-200 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                  }`}
                >
                  {category.products?.length || 0}
                </span>
              </LocalizedClientLink>
            </div>
          ) : (
            <LocalizedClientLink
              href={`/categories/${category.handle}${
                searchParams.size ? `?${searchParams.toString()}` : ""
              }`}
              className={`flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-emerald-50/50 text-emerald-800 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
              }`}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "border-2 border-gray-300 group-hover:border-emerald-400"
                    }`}
                  >
                    {isActive && (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="truncate">{category.name}</span>
              </div>
              <span
                className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-200 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                }`}
              >
                {category.products?.length || 0}
              </span>
            </LocalizedClientLink>
          )}
        </div>
        {hasChildren && isExpanded && (
          <ul className="mt-2 space-y-1 border-l-2 border-emerald-100 ml-3">
            {category.category_children.map((childId) => {
              const childCategory = categories.find(
                (cat) => cat.id === childId.id
              )
              return childCategory ? renderCategory(childCategory) : null
            })}
          </ul>
        )}
      </li>
    )
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Categorieën</h3>
        {pathname.includes("/categories") && (
          <LocalizedClientLink
            href="/store"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
          >
            Wissen
          </LocalizedClientLink>
        )}
      </div>
      <ul className="space-y-1">
        {categories
          .filter((cat) => cat.parent_category_id === null)
          .map(renderCategory)}
      </ul>
    </div>
  )
}

export default CategoryList
