import ApprovedApprovalRequestsAdminList from "@/modules/account/components/approval-requests-admin-list/approved-list"
import PendingApprovalRequestsAdminList from "@/modules/account/components/approval-requests-admin-list/pending-list"
import RejectedApprovalRequestsAdminList from "@/modules/account/components/approval-requests-admin-list/rejected-list"
import { Heading } from "@medusajs/ui"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Goedkeuringen",
  description: "Overzicht van uw goedkeuringen.",
}

export default async function Approvals({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const urlSearchParams = await searchParams

  return (
    <div className="space-y-4" data-testid="approvals-page-wrapper">
      {/* Simple Welcome Section */}
      <div className="pb-3 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Goedkeuringen</h1>
        <p className="text-gray-600 mt-1">
          Beheer goedkeuringen voor bestellingen en aanvragen
        </p>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <Heading
                level="h2"
                className="text-lg font-semibold text-gray-900"
              >
                Wachtend op goedkeuring
              </Heading>
              <p className="text-sm text-gray-600 mt-1">
                Bestellingen die wachten op uw goedkeuring
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Laden...</div>
              </div>
            }
          >
            <PendingApprovalRequestsAdminList searchParams={urlSearchParams} />
          </Suspense>
        </div>
      </div>

      {/* Approved Requests */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-green-600"
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
            </div>
            <div>
              <Heading
                level="h2"
                className="text-lg font-semibold text-gray-900"
              >
                Goedgekeurd
              </Heading>
              <p className="text-sm text-gray-600 mt-1">
                Bestellingen die zijn goedgekeurd
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Laden...</div>
              </div>
            }
          >
            <ApprovedApprovalRequestsAdminList searchParams={urlSearchParams} />
          </Suspense>
        </div>
      </div>

      {/* Rejected Requests */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                />
              </svg>
            </div>
            <div>
              <Heading
                level="h2"
                className="text-lg font-semibold text-gray-900"
              >
                Afgewezen
              </Heading>
              <p className="text-sm text-gray-600 mt-1">
                Bestellingen die zijn afgewezen
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Laden...</div>
              </div>
            }
          >
            <RejectedApprovalRequestsAdminList searchParams={urlSearchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
