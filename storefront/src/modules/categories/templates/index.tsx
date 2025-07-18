import CategoryBreadcrumb from "@/modules/categories/category-breadcrumb"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@/modules/store/components/refinement-list"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@/modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import { Suspense } from "react"

// Helper function to get all subcategory IDs recursively
const getAllSubcategoryIds = (
  category: HttpTypes.StoreProductCategory,
  categories: HttpTypes.StoreProductCategory[]
): string[] => {
  const subcategoryIds: string[] = []

  // Add current category's ID
  subcategoryIds.push(category.id)

  // Recursively add all subcategory IDs
  if (category.category_children && category.category_children.length > 0) {
    category.category_children.forEach((child) => {
      const childCategory = categories.find((cat) => cat.id === child.id)
      if (childCategory) {
        subcategoryIds.push(...getAllSubcategoryIds(childCategory, categories))
      }
    })
  }

  return subcategoryIds
}

// Helper function to count all products including subcategories
const countAllProducts = (
  category: HttpTypes.StoreProductCategory,
  categories: HttpTypes.StoreProductCategory[]
): number => {
  let totalCount = category.products?.length || 0

  if (category.category_children && category.category_children.length > 0) {
    category.category_children.forEach((child) => {
      const childCategory = categories.find((cat) => cat.id === child.id)
      if (childCategory) {
        totalCount += countAllProducts(childCategory, categories)
      }
    })
  }

  return totalCount
}

// SEO content generator for categories
const getCategorySEOContent = (
  categoryName: string,
  categoryHandle: string
) => {
  const contentMap: Record<string, any> = {
    kantoorbenodigdheden: {
      title: "Professionele Kantoorbenodigdheden voor Uw Bedrijf",
      description:
        "Ontdek ons uitgebreide assortiment kantoorbenodigdheden speciaal voor zakelijke gebruikers. Van schrijfwaren tot bureaumeubilair - alles voor een efficiënte werkomgeving.",
      content:
        "Van premium pennen en papier tot ergonomische bureaustoelen en functionele opbergoplossingen - onze kantoorbenodigdheden zijn zorgvuldig geselecteerd voor professionele omgevingen. Wij bieden alleen A-merken die voldoen aan de hoogste kwaliteitseisen.",
      benefits: [
        "Premium schrijfwaren voor professioneel gebruik",
        "Ergonomische bureaumeubilair voor comfort",
        "Functionele opbergoplossingen voor organisatie",
        "Duurzame materialen en lange levensduur",
      ],
    },
    "technische-producten": {
      title: "Technische Producten & Professioneel Gereedschap",
      description:
        "Hoogwaardige technische producten voor professionals. Van elektrisch gereedschap tot precisie meetinstrumenten - kwaliteit die u kunt vertrouwen.",
      content:
        "Ons technische assortiment omvat uitsluitend A-merken en gecertificeerde producten. Perfect voor professionals die kwaliteit en betrouwbaarheid eisen van hun gereedschap en apparatuur.",
      benefits: [
        "Elektrisch en handgereedschap van topmerken",
        "Precisie meet- en testinstrumenten",
        "Veiligheidsuitrusting conform normen",
        "Professionele bevestigingsmaterialen",
      ],
    },
    default: {
      title: `Professionele ${categoryName} voor Uw Bedrijf`,
      description: `Ontdek ons uitgebreide assortiment ${categoryName.toLowerCase()} speciaal geselecteerd voor zakelijke gebruikers. Kwaliteitsproducten tegen scherpe groothandelsprijzen.`,
      content: `Onze ${categoryName.toLowerCase()} zijn zorgvuldig geselecteerd voor professioneel gebruik. Wij bieden alleen producten van betrouwbare merken die voldoen aan de hoogste kwaliteitseisen en geschikt zijn voor intensief zakelijk gebruik.`,
      benefits: [
        "Alleen A-merken in ons assortiment",
        "Producten geschikt voor intensief gebruik",
        "Scherpe groothandelsprijzen",
        "Snelle levering en persoonlijke service",
      ],
    },
  }

  return (
    contentMap[categoryHandle] || {
      ...contentMap.default,
      title: `Professionele ${categoryName} voor Uw Bedrijf`,
    }
  )
}

export default function CategoryTemplate({
  categories,
  currentCategory,
  sortBy,
  page,
  countryCode,
  searchParams,
  products,
  filteredProducts,
}: {
  categories: HttpTypes.StoreProductCategory[]
  currentCategory: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams?: URLSearchParams
  products?: HttpTypes.StoreProduct[]
  filteredProducts?: HttpTypes.StoreProduct[]
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!currentCategory || !countryCode) notFound()

  const productCount = countAllProducts(currentCategory, categories)
  const seoContent = getCategorySEOContent(
    currentCategory.name,
    currentCategory.handle
  )

  // Get all category IDs (current + all subcategories)
  const allCategoryIds = getAllSubcategoryIds(currentCategory, categories)

  return (
    <div className=" min-h-screen">
      {/* Breadcrumbs Section */}
      <div className="content-container py-4">
        <CategoryBreadcrumb
          categories={categories}
          category={currentCategory}
        />
      </div>

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
                categories={categories}
                currentCategory={currentCategory}
                listName={currentCategory.name}
                data-testid="sort-by-container"
                countryCode={countryCode}
                products={products}
                filteredProducts={filteredProducts}
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    {currentCategory.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {currentCategory.description ||
                      `Professionele ${currentCategory.name.toLowerCase()} voor uw bedrijf`}
                  </p>
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {filteredProducts?.length || 0} producten
                </div>
              </div>
            </div>

            {/* Subcategories - Only if there are subcategories */}
            {currentCategory.category_children &&
              currentCategory.category_children.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {currentCategory.category_children
                      .slice(0, 10)
                      .map((child) => {
                        const childCategory = categories.find(
                          (cat) => cat.id === child.id
                        )
                        if (!childCategory) return null

                        return (
                          <LocalizedClientLink
                            key={child.id}
                            href={`/categories/${childCategory.handle}`}
                            className="group"
                          >
                            <div className="bg-white rounded-lg px-3 py-2.5 border border-gray-100 hover:border-sky-200 hover:bg-sky-50/30 transition-all duration-200 shadow-sm hover:shadow-md">
                              <h3 className="font-medium text-gray-800 text-sm group-hover:text-sky-400 transition-colors duration-200 text-center leading-tight">
                                {childCategory.name}
                              </h3>
                            </div>
                          </LocalizedClientLink>
                        )
                      })}
                  </div>

                  {/* Show more button if there are more than 10 subcategories */}
                  {currentCategory.category_children.length > 10 && (
                    <div className="mt-3 text-center">
                      <LocalizedClientLink
                        href={`/categories/${currentCategory.handle}`}
                        className="inline-flex items-center px-4 py-2 text-sm text-sky-400 hover:text-sky-700 font-medium transition-colors duration-200"
                      >
                        +{currentCategory.category_children.length - 10} meer
                        categorieën
                        <svg
                          className="ml-1 w-4 h-4"
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
                      </LocalizedClientLink>
                    </div>
                  )}
                </div>
              )}

            {/* Mobile Filters */}
            <div className="lg:hidden">
              <RefinementList
                sortBy={sort}
                categories={categories}
                currentCategory={currentCategory}
                listName={currentCategory.name}
                data-testid="sort-by-container"
                countryCode={countryCode}
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
                    deze categorie. Pas je zoekcriteria aan of bekijk andere
                    producten.
                  </p>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <LocalizedClientLink
                      href={`/categories/${currentCategory.handle}`}
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
                  categoryId={currentCategory.id}
                  countryCode={countryCode}
                  customer={null}
                  searchParams={searchParams}
                  currentPath={`/categories/${currentCategory.handle}`}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="content-container py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {seoContent.title}
            </h2>

            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-8 text-center">
                {seoContent.description}
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Waarom Kiezen voor Onze {currentCategory.name}?
                  </h3>
                  <p className="text-gray-700 mb-4">{seoContent.content}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Voordelen
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {seoContent.benefits.map(
                      (benefit: string, index: number) => (
                        <li key={index} className="flex items-start">
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
                          <span>{benefit}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              <div className=" rounded-xl p-6 border border-gray-200 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Professionele Service & Ondersteuning
                </h3>
                <p className="text-gray-700">
                  Heeft u vragen over onze {currentCategory.name.toLowerCase()}?
                  Onze productspecialisten staan klaar om u te adviseren over de
                  beste keuze voor uw specifieke behoeften.
                  <strong> Gratis verzending vanaf €150</strong> en{" "}
                  <strong>persoonlijke accountbeheer</strong>
                  voor optimale service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
