import { retrieveCustomer } from "@/lib/data/customer"
import { listRegions } from "@/lib/data/regions"
import ProfileCard from "@/modules/account/components/profile-card"
import SecurityCard from "@/modules/account/components/security-card"
import Breadcrumb from "@/modules/common/components/breadcrumb"
import PageHeader from "@/modules/common/components/page-header"
import { Heading } from "@medusajs/ui"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Profiel",
  description: "Bekijk en bewerk uw profiel.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  return (
    <div className="space-y-4" data-testid="profile-page-wrapper">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: "Account", href: "/account" }, { label: "Profiel" }]}
      />

      {/* Page Header */}
      <PageHeader
        title="Profiel"
        description="Beheer uw persoonlijke informatie en beveiligingsinstellingen"
      />

      {/* Profile Cards */}
      <div className="space-y-6">
        {/* Personal Information */}
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
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
              <div>
                <Heading
                  level="h2"
                  className="text-lg font-semibold text-gray-900"
                >
                  Persoonlijke gegevens
                </Heading>
                <p className="text-sm text-gray-600 mt-1">
                  Uw naam, contactgegevens en andere persoonlijke informatie
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 pt-0">
            <ProfileCard customer={customer} />
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
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
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </div>
              <div>
                <Heading
                  level="h2"
                  className="text-lg font-semibold text-gray-900"
                >
                  Beveiliging
                </Heading>
                <p className="text-sm text-gray-600 mt-1">
                  Wachtwoord wijzigen en beveiligingsinstellingen beheren
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 pt-0">
            <SecurityCard customer={customer} />
          </div>
        </div>
      </div>
    </div>
  )
}
