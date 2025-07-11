"use client"

import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export const B2BMegaMenu = ({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get main categories (categories without parent)
  const mainCategories = categories.filter(
    (category) => !category.parent_category_id
  )

  // Get subcategories for a given parent category
  const getSubCategories = (parentId: string) => {
    return categories.filter(
      (category) => category.parent_category_id === parentId
    )
  }

  // Get the actual category object from the activeCategory ID
  const getActiveCategoryObject = () => {
    if (!activeCategory) return null
    return categories.find((category) => category.id === activeCategory)
  }

  // Handle mouse enter for main categories
  const handleCategoryEnter = (categoryId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }

    setActiveCategory(categoryId)
    setIsMenuOpen(true)
  }

  // Handle mouse leave with delay
  const handleMenuLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null)
      setIsMenuOpen(false)
    }, 200)
  }

  // Handle mouse enter for the menu area
  const handleMenuEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  // Close menu when pathname changes
  useEffect(() => {
    setIsMenuOpen(false)
    setActiveCategory(null)
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }, [pathname])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  // Calculate exact header height: top bar (40px) + main header (64px) + navigation (48px) + borders = ~154px
  const headerHeight = 154

  return (
    <div className="relative">
      {/* Main Categories */}
      <div className="flex items-center space-x-1">
        {mainCategories.map((category) => (
          <div
            key={category.id}
            className="relative"
            onMouseEnter={() => handleCategoryEnter(category.id)}
            onMouseLeave={handleMenuLeave}
          >
            <LocalizedClientLink
              href={`/categories/${category.handle}`}
              className={clx(
                "flex items-center px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200",
                activeCategory === category.id
                  ? "text-green-600 bg-green-50 shadow-sm"
                  : "text-gray-900 hover:text-green-600 hover:bg-green-50"
              )}
            >
              <span>{category.name}</span>
              {getSubCategories(category.id).length > 0 && (
                <svg
                  className={clx(
                    "ml-2 h-4 w-4 transition-all duration-200",
                    activeCategory === category.id
                      ? "rotate-180 text-green-600"
                      : "text-gray-400"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </LocalizedClientLink>
          </div>
        ))}
      </div>

      {/* Mega Menu */}
      {isMenuOpen && activeCategory && (
        <>
          {/* Hover bridge - invisible area to connect navbar to menu */}
          <div
            className="fixed left-0 right-0 h-4 z-[59]"
            style={{ top: `${headerHeight - 4}px` }}
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
          />

          <div
            className="fixed left-0 right-0 w-full bg-white z-[60] border-b border-gray-100 shadow-lg"
            style={{ top: `${headerHeight}px` }}
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
          >
            {/* Container to keep content centered */}
            <div className="content-container">
              <div className="flex min-h-[320px]">
                {/* Clean Sidebar */}
                <div className="w-72 bg-gray-50 rounded-l-lg">
                  <div className="p-6">
                    {/* Category Header */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {getActiveCategoryObject()?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Ontdek onze uitgebreide collectie
                      </p>
                    </div>

                    {/* View All Button */}
                    <LocalizedClientLink
                      href={`/categories/${getActiveCategoryObject()?.handle}`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium mb-6 hover:shadow-md"
                    >
                      Bekijk alle{" "}
                      {getActiveCategoryObject()?.name?.toLowerCase()}
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </LocalizedClientLink>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                      <LocalizedClientLink
                        href="/contact"
                        className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Contact opnemen
                      </LocalizedClientLink>
                      <LocalizedClientLink
                        href="/bulk-korting"
                        className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        Bulk korting
                      </LocalizedClientLink>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="flex-1 p-6">
                  <div className="grid grid-cols-3 gap-8 h-full">
                    {getSubCategories(activeCategory)
                      ?.slice(0, 9)
                      .map((child) => (
                        <div key={child.id} className="group">
                          <LocalizedClientLink
                            href={`/categories/${child.handle}`}
                            className="block space-y-2"
                          >
                            <h4 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                              {child.name}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {child.description ||
                                "Ontdek onze selectie van hoogwaardige producten"}
                            </p>
                          </LocalizedClientLink>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
