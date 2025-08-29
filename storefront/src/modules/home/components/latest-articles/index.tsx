import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { ChevronRight } from "@medusajs/icons"
import { Heading } from "@medusajs/ui"

// Professional cleaning & hygiene blog articles
const mockArticles = [
  {
    id: 1,
    title: "HACCP Compliance in de Schoonmaak",
    excerpt:
      "Essentiële richtlijnen voor het voldoen aan HACCP normen bij professionele schoonmaak in zorginstellingen en horeca.",
    date: "2024-12-15",
    readTime: "6 min",
    slug: "haccp-compliance-schoonmaak",
    category: "Compliance",
    author: "Sandra Hoekstra",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format&q=80",
  },
  {
    id: 2,
    title: "Duurzaam Schoonmaken: Eco-vriendelijke Alternatieven",
    excerpt:
      "Hoe u milieuvriendelijke schoonmaakproducten kunt inzetten zonder in te boeten op effectiviteit en veiligheid.",
    date: "2024-12-10",
    readTime: "5 min",
    slug: "duurzaam-schoonmaken-eco-alternatieven",
    category: "Duurzaamheid",
    author: "Mark van der Berg",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format&q=80",
  },
]

export default function LatestArticles() {
  return (
    <section className="py-6">
      <div className="content-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Heading
              level="h2"
              className="text-xl font-bold text-gray-900 mb-1"
            >
              Kennis & Inzichten
            </Heading>
            <p className="text-gray-600 text-sm">
              Blijf op de hoogte van de laatste ontwikkelingen in schoonmaak &
              hygiëne
            </p>
          </div>
          <LocalizedClientLink
            href="/blog"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors group"
          >
            Alle artikelen
            <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockArticles.map((article) => (
            <LocalizedClientLink
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group"
            >
              <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-green-300 h-full">
                {/* Article Image */}
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-4">
                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <span>
                        {new Date(article.date).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors leading-tight line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </article>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
