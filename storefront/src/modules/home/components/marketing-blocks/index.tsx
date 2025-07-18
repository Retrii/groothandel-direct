import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { ChevronRight } from "@medusajs/icons"

const MarketingBlocks = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Marketing Block 1 - Cleaning & Hygiene Specialist */}
      <div className="relative bg-gradient-to-br from-green-400 via-green-500 to-green-400 rounded-xl overflow-hidden h-56 group shadow-md hover:shadow-lg transition-all duration-300">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/hero-image.jpg')] bg-cover bg-center opacity-25 group-hover:opacity-30 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/5"></div>

        <div className="relative z-10 p-6 flex flex-col justify-between h-full">
          <div>
            <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
              SCHOONMAAK & HYGIËNE SPECIALIST
            </div>
            <h3 className="text-white text-xl font-bold mb-3 leading-tight">
              Groothandel Direct
            </h3>
            <p className="text-white/95 text-sm leading-relaxed">
              Dé leverancier voor professionele schoonmaak- en hygiëneproducten.
              Voor een schone en veilige werkomgeving.
            </p>
          </div>
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center text-white font-medium hover:text-green-100 transition-all duration-200 self-start bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20 text-sm"
          >
            Bekijk assortiment
            <ChevronRight className="ml-2 w-4 h-4" />
          </LocalizedClientLink>
        </div>
      </div>

      {/* Marketing Block 2 - Become Business Customer */}
      <div className="relative bg-gradient-to-br from-sky-400 via-sky-500 to-sky-400 rounded-xl overflow-hidden h-56 group shadow-md hover:shadow-lg transition-all duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="business-pattern"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="2" fill="white" opacity="0.4" />
                <circle cx="5" cy="5" r="1" fill="white" opacity="0.3" />
                <circle cx="15" cy="15" r="1" fill="white" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#business-pattern)" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10"></div>

        <div className="relative z-10 p-6 flex flex-col justify-between h-full">
          <div>
            <div className="inline-flex items-center bg-orange-400 text-orange-900 px-3 py-1 rounded-full text-sm font-bold mb-4">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              EXCLUSIEVE VOORDELEN
            </div>
            <h3 className="text-white text-xl font-bold mb-3 leading-tight">
              Word Zakelijke Klant
            </h3>
            <p className="text-white/95 text-sm leading-relaxed">
              Profiteer van scherpe groothandelsprijzen, persoonlijke service en
              aangepaste betalingsvoorwaarden.
            </p>
          </div>
          <LocalizedClientLink
            href="/account/register"
            className="inline-flex items-center text-white font-medium hover:text-sky-100 transition-all duration-200 self-start bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20 text-sm"
          >
            Gratis aanmelden
            <ChevronRight className="ml-2 w-4 h-4" />
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default MarketingBlocks
