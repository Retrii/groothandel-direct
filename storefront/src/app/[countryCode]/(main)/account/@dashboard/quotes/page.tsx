import { fetchQuotes } from "@/lib/data/quotes"
import Breadcrumb from "@/modules/common/components/breadcrumb"
import PageHeader from "@/modules/common/components/page-header"
import { Heading } from "@medusajs/ui"
import QuotesOverview from "./components/quotes-overview"

export default async function Quotes() {
  const { quotes } = await fetchQuotes()

  return (
    <div className="space-y-4" data-testid="quotes-page-wrapper">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: "Account", href: "/account" }, { label: "Offertes" }]}
      />

      {/* Page Header */}
      <PageHeader
        title="Offertes"
        description="Bekijk al uw offertes en hun status"
      />

      {/* Quotes Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <div>
              <Heading
                level="h2"
                className="text-lg font-semibold text-gray-900"
              >
                Overzicht offertes
              </Heading>
              <p className="text-sm text-gray-600 mt-1">
                Al uw offertes en hun huidige status
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <QuotesOverview quotes={quotes!} />
        </div>
      </div>
    </div>
  )
}
