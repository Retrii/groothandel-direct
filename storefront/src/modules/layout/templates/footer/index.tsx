import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import LogoIcon from "@/modules/common/icons/logo"
import { CheckCircle, MapPin, Phone } from "@medusajs/icons"

// Language Selector Component
function LanguageSelector() {
  return (
    <div className="flex items-center space-x-2">
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      <select
        className="bg-transparent text-gray-400 text-sm outline-none cursor-pointer hover:text-sky-200 transition-colors duration-200"
        style={{ border: "none" }}
      >
        <option value="nl">Nederlands</option>
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="fr">Français</option>
      </select>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-sky-400 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-sky-300">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-sky-300/20 border border-sky-100/30 rounded-lg px-4 py-2 mb-4">
                <svg
                  className="w-4 h-4 text-sky-100"
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
                <span className="text-sky-100 text-sm font-medium">
                  Nieuwsbrief
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">
                Blijf op de hoogte van aanbiedingen
              </h2>
              <p className="text-sky-50 mb-8 text-lg max-w-2xl mx-auto">
                Ontvang maandelijks de beste deals, nieuwe producten en
                exclusieve kortingen voor groothandel
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="uw@bedrijfsemail.nl"
                  className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-200 rounded-lg transition-all duration-200"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 transition-all duration-200 font-medium rounded-lg">
                  Aanmelden
                </button>
              </div>
              <p className="text-sky-100 text-sm mt-3">
                Gratis aanmelden • Uitschrijven wanneer u wilt • Geen spam
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <LogoIcon className="h-8 w-8 text-sky-100" />
                <div>
                  <span className="text-xl font-bold">Groothandel Direct</span>
                  <p className="text-sky-100 text-sm">Sinds 2019</p>
                </div>
              </div>
              <p className="text-sky-50 text-sm leading-relaxed">
                Betrouwbare partner voor non-food groothandel. Wij leveren aan
                winkels en bedrijven door heel Nederland & België.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <svg
                    className="h-4 w-4 text-sky-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <span className="text-sky-50">
                    Gratis verzending vanaf €150
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  <span className="text-sky-50">
                    4.8/5 sterren (2400+ reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact</h3>
              <div className="space-y-3">
                <a
                  href="tel:+31857920137"
                  className="flex items-center space-x-3 text-sky-50 hover:text-sky-100 transition-colors duration-200"
                >
                  <Phone className="h-4 w-4 text-sky-100" />
                  <div>
                    <span>+31 (0)85-7920137</span>
                    <p className="text-xs text-sky-100">Ma-Vr 8:30-17:30</p>
                  </div>
                </a>
                <a
                  href="mailto:info@groothandeldirect.nl"
                  className="flex items-center space-x-3 text-sky-50 hover:text-sky-100 transition-colors duration-200"
                >
                  <svg
                    className="h-4 w-4 text-sky-100"
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
                  <div>
                    <span>info@groothandeldirect.nl</span>
                    <p className="text-xs text-sky-100">Snel antwoord</p>
                  </div>
                </a>
                <div className="flex items-center space-x-3 text-sky-50">
                  <MapPin className="h-4 w-4 text-sky-100" />
                  <div>
                    <span>Nederland & België</span>
                    <p className="text-xs text-sky-100">Snelle levering</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Service</h3>
              <div className="space-y-2">
                <LocalizedClientLink
                  href="/klantenservice"
                  className="block text-sky-50 hover:text-sky-100 transition-colors duration-200"
                >
                  Klantenservice
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/verzending"
                  className="block text-sky-50 hover:text-sky-100 transition-colors duration-200"
                >
                  Verzending & Retour
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/offerte"
                  className="block text-sky-50 hover:text-sky-100 transition-colors duration-200"
                >
                  Offerte Aanvragen
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/bulk"
                  className="block text-sky-50 hover:text-sky-100 transition-colors duration-200"
                >
                  Bulk Bestellingen
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/betaling"
                  className="block text-sky-50 hover:text-sky-100 transition-colors duration-200"
                >
                  Betaalmethoden
                </LocalizedClientLink>
              </div>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Bedrijf</h3>
              <div className="space-y-2">
                <LocalizedClientLink
                  href="/over-ons"
                  className="block text-sky-50 hover:text-sky-100 transition-colors duration-200"
                >
                  Over Ons
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/werken-bij"
                  className="block text-sky-50 hover:text-sky-100 transition-colors duration-200"
                >
                  Werken bij ons
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/sustainability"
                  className="block text-sky-50 hover:text-sky-100 transition-colors duration-200"
                >
                  Duurzaamheid
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/partners"
                  className="block text-sky-50 hover:text-sky-100 transition-colors duration-200"
                >
                  Partners
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/locaties"
                  className="block text-sky-50 hover:text-sky-100 transition-colors duration-200"
                >
                  Locaties
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-sky-300 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center space-x-6 text-sm text-sky-100">
              <LocalizedClientLink
                href="/algemene-voorwaarden"
                className="hover:text-sky-50 transition-colors duration-200"
              >
                Algemene Voorwaarden
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/privacy"
                className="hover:text-sky-50 transition-colors duration-200"
              >
                Privacy
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/cookies"
                className="hover:text-sky-50 transition-colors duration-200"
              >
                Cookies
              </LocalizedClientLink>
              <LanguageSelector />
            </div>
            <div className="text-sm text-sky-100">
              © {new Date().getFullYear()} Groothandel Direct. Alle rechten
              voorbehouden.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
