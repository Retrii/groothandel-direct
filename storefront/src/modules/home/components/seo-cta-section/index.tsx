import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { ChevronRight } from "@medusajs/icons"
import { Heading } from "@medusajs/ui"

export default function SeoCtaSection() {
  return (
    <section className="py-8">
      <div className="content-container">
        {/* CTA Section */}
        <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-500 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden shadow-lg">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="enhanced-cta-pattern"
                  x="0"
                  y="0"
                  width="25"
                  height="25"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="12.5"
                    cy="12.5"
                    r="1.5"
                    fill="white"
                    opacity="0.4"
                  />
                  <circle cx="6" cy="6" r="0.8" fill="white" opacity="0.3" />
                  <circle cx="19" cy="19" r="0.8" fill="white" opacity="0.3" />
                  <circle cx="6" cy="19" r="0.5" fill="white" opacity="0.2" />
                  <circle cx="19" cy="6" r="0.5" fill="white" opacity="0.2" />
                </pattern>
              </defs>
              <rect
                width="100"
                height="100"
                fill="url(#enhanced-cta-pattern)"
              />
            </svg>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            {/* Success indicator */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              2500+ TEVREDEN ZAKELIJKE KLANTEN
            </div>

            <Heading
              level="h2"
              className="text-2xl lg:text-4xl font-bold mb-4 text-white leading-tight"
            >
              Start vandaag nog met
              <br />
              <span className="font-black">groothandelsprijzen</span>
            </Heading>

            <p className="text-lg mb-2 text-green-50 leading-relaxed max-w-2xl mx-auto">
              Bespaar tot <strong className="font-black">35%</strong> op uw
              schoonmaakkosten.
            </p>
            <p className="text-base mb-8 text-green-100 leading-relaxed max-w-2xl mx-auto">
              Gratis aanmelden • Geen verplichtingen • Direct toegang tot
              professionele prijzen
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <LocalizedClientLink
                href="/account/register"
                className="inline-flex items-center px-6 py-3 bg-white text-green-500 font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Gratis Zakelijke Account
                <ChevronRight className="ml-2 w-4 h-4" />
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors duration-200"
              >
                Ons Assortiment
                <ChevronRight className="ml-2 w-4 h-4" />
              </LocalizedClientLink>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-black text-white mb-1">
                  Gratis
                </div>
                <div className="text-sm text-green-100">
                  Aanmelden & Account
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-white mb-1">
                  24-48u
                </div>
                <div className="text-sm text-green-100">Snelle Levering</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-white mb-1">
                  15+ Jaar
                </div>
                <div className="text-sm text-green-100">Ervaring & Service</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
