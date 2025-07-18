import { retrieveCart } from "@/lib/data/cart"
import { listCategories } from "@/lib/data/categories"
import { retrieveCustomer } from "@/lib/data/customer"
import AccountButton from "@/modules/account/components/account-button"
import CartButton from "@/modules/cart/components/cart-button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import LogoIcon from "@/modules/common/icons/logo"
import { B2BMegaMenu } from "@/modules/layout/components/b2b-mega-menu/b2b-mega-menu"
import { MobileB2BMenu } from "@/modules/layout/components/b2b-mega-menu/mobile-menu"
import SkeletonAccountButton from "@/modules/skeletons/components/skeleton-account-button"
import SkeletonCartButton from "@/modules/skeletons/components/skeleton-cart-button"
import { Suspense } from "react"

// BTW Toggle Component
function BTWToggle() {
  return (
    <div className="flex items-center space-x-2 text-xs">
      <span className="text-sky-50">Prijzen:</span>
      <div className="flex items-center bg-sky-300/20 rounded-full p-1 border border-sky-200/30">
        <button className="flex items-center space-x-1 bg-green-400 px-3 py-1 hover:bg-green-500 transition-colors duration-200 rounded-full">
          <span className="text-white font-medium">Excl.</span>
          <span className="text-green-50 text-xs">BTW</span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-1 hover:bg-sky-200/20 transition-colors duration-200 rounded-full">
          <span className="text-sky-100 font-medium">Incl.</span>
          <span className="text-sky-200 text-xs">BTW</span>
        </button>
      </div>
    </div>
  )
}

export async function NavigationHeader() {
  const customer = await retrieveCustomer().catch(() => null)
  const cart = await retrieveCart()
  const categories = await listCategories().catch(() => [])

  return (
    <header className="sticky top-0 inset-x-0 bg-white z-[56]">
      {/* Top Bar */}
      <div className="bg-sky-400 text-white">
        <div className="content-container">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★★★★★</span>
                <span className="font-semibold text-white">4.8</span>
              </div>
              <span className="text-sky-50">(2.4k reviews)</span>
            </div>
            <div className="flex items-center space-x-6">
              <BTWToggle />
              <span className="text-sky-50 hover:text-white transition-colors duration-200">
                Voor 15u besteld, zelfde dag verzonden
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="content-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <LocalizedClientLink className="flex items-center group" href="/">
                <div className="relative">
                  <LogoIcon className="h-9 w-9 text-sky-400 group-hover:text-sky-500 transition-colors duration-200" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-300 rounded-full opacity-75"></div>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900 group-hover:text-sky-400 transition-colors duration-200">
                    Groothandel Direct
                  </h1>
                  <p className="text-sm text-gray-600 -mt-0.5 font-medium">
                    Professionele groothandel sinds 2019
                  </p>
                </div>
              </LocalizedClientLink>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Zoek binnen onze 30.000+ artikelen"
                  className="w-full h-11 pl-4 pr-12 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-300 transition-all duration-200 rounded-lg"
                />
                <button className="absolute right-0 top-0 h-11 w-12 flex items-center justify-center text-gray-400 hover:text-sky-400 transition-colors duration-200 rounded-r-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Suspense fallback={<SkeletonAccountButton />}>
                  <AccountButton customer={customer} />
                </Suspense>
                <Suspense fallback={<SkeletonCartButton />}>
                  <CartButton />
                </Suspense>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <MobileB2BMenu categories={categories} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Mega Menu */}
      <div className="hidden md:block">
        <div className="bg-white border-t border-gray-200">
          <div className="content-container">
            <div className="h-12 flex items-center">
              <B2BMegaMenu categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
