import CategoryBreadcrumb from "@/modules/categories/category-breadcrumb"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@/modules/store/components/refinement-list"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@/modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import { Suspense } from "react"

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
}: {
  categories: HttpTypes.StoreProductCategory[]
  currentCategory: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!currentCategory || !countryCode) notFound()

  const productCount = currentCategory.products?.length || 0
  const seoContent = getCategorySEOContent(
    currentCategory.name,
    currentCategory.handle
  )

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumbs Section */}
      <div className="content-container py-4">
        <CategoryBreadcrumb
          categories={categories}
          category={currentCategory}
        />
      </div>

      {/* Header Section */}
      <div className="">
        <div className="content-container py-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentCategory.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {currentCategory.description ||
                `Professionele ${currentCategory.name.toLowerCase()} voor uw bedrijf`}
            </p>
            <div className="flex items-center text-sm text-gray-600">
              <span>{productCount} producten</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
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
              />
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            {productCount === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-4xl mb-3">📦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Geen producten gevonden
                </h3>
                <p className="text-gray-600 mb-4">
                  Er zijn momenteel geen producten beschikbaar in deze
                  categorie.
                </p>
                <LocalizedClientLink href="/store">
                  <Button>Bekijk alle producten</Button>
                </LocalizedClientLink>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <Suspense
                  fallback={
                    <SkeletonProductGrid
                      count={currentCategory.products?.length}
                    />
                  }
                >
                  <PaginatedProducts
                    sortBy={sort}
                    page={pageNumber}
                    categoryId={currentCategory.id}
                    countryCode={countryCode}
                  />
                </Suspense>
              </div>
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

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
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

      {/* Related Categories - Only if there are subcategories */}
      {currentCategory.category_children &&
        currentCategory.category_children.length > 0 && (
          <div className="bg-gray-50 border-t border-gray-200">
            <div className="content-container py-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Subcategorieën
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentCategory.category_children.slice(0, 6).map((child) => {
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
                      <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all duration-200">
                        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-green-600 transition-colors duration-200">
                          {childCategory.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {childCategory.products?.length || 0} producten
                        </p>
                      </div>
                    </LocalizedClientLink>
                  )
                })}
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
