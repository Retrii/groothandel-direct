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

  // Get sub-subcategories for a given subcategory
  const getSubSubCategories = (parentId: string) => {
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
    // Only open mega menu if category has subcategories
    const hasSubCategories = getSubCategories(categoryId).length > 0
    if (!hasSubCategories) return

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
        {mainCategories.map((category) => {
          const hasSubCategories = getSubCategories(category.id).length > 0

          return (
            <div
              key={category.id}
              className="relative"
              {...(hasSubCategories && {
                onMouseEnter: () => handleCategoryEnter(category.id),
                onMouseLeave: handleMenuLeave,
              })}
            >
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className={clx(
                  "flex items-center px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200",
                  activeCategory === category.id
                    ? "text-sky-400 bg-sky-50 shadow-sm"
                    : "text-gray-900 hover:text-sky-400 hover:bg-sky-50"
                )}
              >
                <span>{category.name}</span>
                {hasSubCategories && (
                  <svg
                    className={clx(
                      "ml-2 h-4 w-4 transition-all duration-200",
                      activeCategory === category.id
                        ? "rotate-180 text-sky-400"
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
          )
        })}
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
              <div className="bg-white min-h-[400px]">
                {/* Header with Category Info */}
                <div className="my-6 bg-gradient-to-r from-sky-50 to-sky-100 border border-sky-200 rounded-xl px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {getActiveCategoryObject()?.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                        {getActiveCategoryObject()?.description ||
                          "Ontdek onze uitgebreide collectie van hoogwaardige producten"}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <LocalizedClientLink
                      href={`/categories/${getActiveCategoryObject()?.handle}`}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all duration-200 font-semibold hover:shadow-lg hover:scale-105 text-sm"
                    >
                      <span>Bekijk alle producten</span>
                      <svg
                        className="ml-3 w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </LocalizedClientLink>
                  </div>
                </div>

                {/* Subcategories Grid */}
                <div className="px-8 py-4">
                  <div className="grid grid-cols-4 gap-8">
                    {getSubCategories(activeCategory)?.map((subcategory) => {
                      const subSubCategories = getSubSubCategories(
                        subcategory.id
                      )

                      return (
                        <div key={subcategory.id} className="space-y-4">
                          {/* Subcategory Header */}
                          <LocalizedClientLink
                            href={`/categories/${subcategory.handle}`}
                            className="block group"
                          >
                            <h4 className="font-bold text-gray-900 group-hover:text-sky-400 transition-colors duration-200 text-base mb-2">
                              {subcategory.name}
                            </h4>
                            <div className="w-8 h-0.5 bg-sky-400 group-hover:w-12 transition-all duration-200"></div>
                          </LocalizedClientLink>

                          {/* Sub-subcategories List */}
                          {subSubCategories.length > 0 && (
                            <div className="space-y-2 mt-4">
                              {subSubCategories
                                .slice(0, 8)
                                .map((subSubCategory) => (
                                  <LocalizedClientLink
                                    key={subSubCategory.id}
                                    href={`/categories/${subSubCategory.handle}`}
                                    className="block text-sm text-gray-600 hover:text-sky-400 hover:translate-x-1 transition-all duration-200"
                                  >
                                    {subSubCategory.name}
                                  </LocalizedClientLink>
                                ))}
                              {subSubCategories.length > 8 && (
                                <LocalizedClientLink
                                  href={`/categories/${subcategory.handle}`}
                                  className="block text-xs text-sky-500 hover:text-sky-600 font-medium mt-3"
                                >
                                  +{subSubCategories.length - 8} meer
                                  categorieën
                                </LocalizedClientLink>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
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
