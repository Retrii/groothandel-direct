import { Star, StarSolid } from "@medusajs/icons"
import { Heading, Text } from "@medusajs/ui"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Klantrecensies - Groothandel Direct",
  description: "Bekijk wat onze klanten zeggen over onze producten en service",
}

// Mock review data - in real implementation, this would come from a database
const mockReviews = [
  {
    id: 1,
    customerName: "Jan van der Berg",
    company: "ElektroStore B.V.",
    rating: 5,
    date: "2024-01-15",
    title: "Uitstekende service en snelle levering",
    content:
      "Al jaren een tevreden klant. Bestellingen worden altijd snel verwerkt en de kwaliteit is top. Zeker een aanrader voor andere retailers.",
    verified: true,
  },
  {
    id: 2,
    customerName: "Maria Janssen",
    company: "TechPoint",
    rating: 4,
    date: "2024-01-10",
    title: "Goede producten, fijne samenwerking",
    content:
      "Brede assortiment en competitieve prijzen. Klantenservice is altijd bereikbaar en denkt mee in oplossingen.",
    verified: true,
  },
  {
    id: 3,
    customerName: "Peter de Vries",
    company: "Gadget Palace",
    rating: 5,
    date: "2024-01-08",
    title: "Betrouwbare partner voor onze winkel",
    content:
      "Groothandel Direct is onze vaste leverancier geworden. Consistent hoge kwaliteit en geen verrassingen. Precies wat je wilt als ondernemer.",
    verified: true,
  },
  {
    id: 4,
    customerName: "Lisa Vermeer",
    company: "E-Commerce Solutions",
    rating: 4,
    date: "2024-01-05",
    title: "Professionele aanpak",
    content:
      "Goede communicatie en duidelijke afspraken. Leveringen komen altijd op tijd aan. Kleine verbeterpunten zijn er altijd, maar over het algemeen zeer tevreden.",
    verified: true,
  },
  {
    id: 5,
    customerName: "Robert Bakker",
    company: "TechWorld",
    rating: 5,
    date: "2024-01-02",
    title: "Topkwaliteit en service",
    content:
      "Vooral de persoonlijke benadering waardeer ik. Je voelt je als klant echt gehoord en gewaardeerd. Producten zijn altijd van hoge kwaliteit.",
    verified: true,
  },
]

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star}>
          {star <= rating ? (
            <StarSolid className="h-5 w-5 text-yellow-400" />
          ) : (
            <Star className="h-5 w-5 text-gray-300" />
          )}
        </div>
      ))}
    </div>
  )
}

const ReviewCard = ({ review }: { review: (typeof mockReviews)[0] }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {review.customerName.charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {review.customerName}
            </h4>
            <p className="text-sm text-gray-600">{review.company}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StarRating rating={review.rating} />
          {review.verified && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Geverifieerd
            </span>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {review.title}
      </h3>
      <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {new Date(review.date).toLocaleDateString("nl-NL", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  const averageRating =
    mockReviews.reduce((sum, review) => sum + review.rating, 0) /
    mockReviews.length

  return (
    <div className=" min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Heading level="h1" className="text-4xl font-bold mb-4">
              Klantrecensies
            </Heading>
            <Text className="text-xl text-green-100 mb-8">
              Ontdek wat onze klanten zeggen over onze producten en service
            </Text>

            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <StarRating rating={Math.round(averageRating)} />
                <span className="text-2xl font-semibold">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <div className="text-green-100">
                Gebaseerd op {mockReviews.length} reviews
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <Heading level="h2" className="text-2xl font-bold text-gray-900">
              Wat onze klanten zeggen
            </Heading>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sorteer op:</span>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option>Nieuwste eerst</option>
                <option>Hoogste beoordeling</option>
                <option>Laagste beoordeling</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {mockReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Heading
            level="h3"
            className="text-xl font-semibold text-gray-900 mb-4"
          >
            Bent u ook klant bij ons?
          </Heading>
          <Text className="text-gray-600 mb-6">
            Deel uw ervaring en help andere ondernemers bij het maken van de
            juiste keuze.
          </Text>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 font-medium hover:shadow-lg">
            <Star className="mr-2 h-5 w-5" />
            Schrijf een review
          </button>
        </div>
      </div>
    </div>
  )
}
