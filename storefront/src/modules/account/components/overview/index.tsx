"use client"

import OrderCard from "@/modules/account/components/order-card"
import PreviouslyPurchasedProducts from "@/modules/account/components/previously-purchased"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { B2BCustomer } from "@/types/global"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"

type OverviewProps = {
  customer: B2BCustomer | null
  orders: HttpTypes.StoreOrder[] | null
  region?: HttpTypes.StoreRegion | null
  profileCompletion: {
    percentage: number
    steps: Array<{
      label: string
      href: string
      completed: boolean
    }>
  }
}

const Overview = ({ customer, orders, profileCompletion }: OverviewProps) => {
  const [showProfileSection, setShowProfileSection] = useState(true)

  // Fallback for when profileCompletion is undefined
  const completionData = profileCompletion || { percentage: 0, steps: [] }

  // Hide profile section when 100% complete
  if (completionData.percentage === 100 && showProfileSection) {
    setTimeout(() => setShowProfileSection(false), 3000)
  }

  return (
    <div className="space-y-4" data-testid="overview-page-wrapper">
      {/* Simple Welcome Section */}
      <div className="pb-3 border-b border-gray-200">
        <h1
          className="text-2xl font-bold text-gray-900"
          data-testid="welcome-message"
          data-value={customer?.first_name}
        >
          Welkom terug, {customer?.first_name}
        </h1>
        <p className="text-gray-600 mt-1">
          Hier is een overzicht van uw account
        </p>
      </div>

      {/* Profile Completion Section - Full Width */}
      {showProfileSection && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Profiel Voltooiing
                </h3>
                <p className="text-sm text-gray-600">
                  Voltooi uw profiel voor een betere ervaring
                </p>
              </div>
            </div>
            {completionData.percentage === 100 && (
              <button
                onClick={() => setShowProfileSection(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Verberg profiel sectie"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Section */}
            <div className="space-y-4">
              <div className="flex items-end gap-x-2">
                <span
                  className="text-3xl font-bold text-gray-900"
                  data-testid="customer-profile-completion"
                  data-value={completionData.percentage}
                >
                  {completionData.percentage}%
                </span>
                <span className="text-sm text-gray-500 mb-1">voltooid</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    completionData.percentage === 100
                      ? "bg-green-500"
                      : "bg-green-600"
                  }`}
                  style={{ width: `${completionData.percentage}%` }}
                ></div>
              </div>
              {completionData.percentage === 100 && (
                <div className="flex items-center space-x-2 text-green-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Profiel volledig voltooid!
                  </span>
                </div>
              )}
            </div>

            {/* Completion Steps */}
            {completionData.percentage < 100 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Voltooi uw profiel:
                </p>
                <div className="space-y-2">
                  {completionData.steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          step.completed ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <LocalizedClientLink
                        href={step.href}
                        className={`text-sm flex-1 ${
                          step.completed
                            ? "text-gray-500 line-through"
                            : "text-green-600 hover:text-green-700 font-medium hover:underline"
                        }`}
                      >
                        {step.label}
                      </LocalizedClientLink>
                      {step.completed && (
                        <svg
                          className="w-4 h-4 text-green-500 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-sky-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119.993Z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Recente Bestellingen
              </h3>
              <p className="text-sm text-gray-600">Uw laatste bestellingen</p>
            </div>
          </div>
          <LocalizedClientLink
            href="/account/orders"
            className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
          >
            Bekijk alle bestellingen →
          </LocalizedClientLink>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
            {orders.length > 3 && (
              <div className="text-center pt-4">
                <LocalizedClientLink
                  href="/account/orders"
                  className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                >
                  Bekijk nog {orders.length - 3} bestellingen →
                </LocalizedClientLink>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119.993Z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nog geen bestellingen
            </h4>
            <p className="text-gray-600 mb-4">
              U heeft nog geen bestellingen geplaatst
            </p>
            <LocalizedClientLink
              href="/"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Start met winkelen
            </LocalizedClientLink>
          </div>
        )}
      </div>

      {/* Previously Purchased Products Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Eerder Gekochte Producten
              </h3>
              <p className="text-sm text-gray-600">
                Producten die u eerder heeft gekocht
              </p>
            </div>
          </div>
        </div>

        <PreviouslyPurchasedProducts orders={orders || []} />
      </div>
    </div>
  )
}

export default Overview
