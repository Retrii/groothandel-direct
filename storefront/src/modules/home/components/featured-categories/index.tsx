import { listCategories } from "@/lib/data/categories"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { ChevronRight } from "@medusajs/icons"
import { Heading } from "@medusajs/ui"

// Professional cleaning & hygiene category images
const getCategoryImage = (handle: string) => {
  const categoryImages: Record<string, string> = {
    schoonmaakmiddelen:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format&q=80",
    "hygiene-artikelen":
      "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&h=300&fit=crop&auto=format&q=80",
    desinfectie:
      "https://images.unsplash.com/photo-1585559700398-b4cb50fe4737?w=400&h=300&fit=crop&auto=format&q=80",
    poetsmaterialen:
      "https://images.unsplash.com/photo-1581578949510-fa7315a4b8db?w=400&h=300&fit=crop&auto=format&q=80",
    disposables:
      "https://images.unsplash.com/photo-1584744982967-1d1bb8e90903?w=400&h=300&fit=crop&auto=format&q=80",
    papierproducten:
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop&auto=format&q=80",
  }

  return (
    categoryImages[handle] ||
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format&q=80"
  )
}

// Professional cleaning categories for B2B market
const cleaningCategories = [
  { id: "1", name: "Schoonmaakmiddelen", handle: "schoonmaakmiddelen" },
  { id: "2", name: "Hygiëne Artikelen", handle: "hygiene-artikelen" },
  { id: "3", name: "Desinfectie", handle: "desinfectie" },
  { id: "4", name: "Poetsmaterialen", handle: "poetsmaterialen" },
  { id: "5", name: "Disposables", handle: "disposables" },
  { id: "6", name: "Papierproducten", handle: "papierproducten" },
]

export default async function FeaturedCategories() {
  // Use our predefined cleaning categories, but also try to get real categories
  const categories = await listCategories().catch(() => [])

  // Get main categories (no parent) or fall back to our cleaning categories
  const mainCategories =
    categories.length > 0
      ? categories
          .filter((category) => !category.parent_category_id)
          .slice(0, 6)
      : cleaningCategories

  if (mainCategories.length === 0) {
    return null
  }

  return (
    <section className="py-6">
      <div className="content-container">
        {/* Compact header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <Heading level="h2" className="text-lg font-bold text-gray-900">
              Ons Assortiment
            </Heading>
          </div>
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors group"
          >
            Heel Assortiment
            <ChevronRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {mainCategories.map((category) => (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="group"
            >
              <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-sky-200 hover:border-sky-400">
                {/* Category Image */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={getCategoryImage(category.handle)}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-600/60 via-sky-600/20 to-transparent"></div>
                  <div className="absolute inset-0 bg-sky-600/10 group-hover:bg-sky-400/20 transition-all duration-300"></div>

                  {/* Category Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <h3 className="text-white text-sm font-semibold leading-tight group-hover:text-sky-100 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
