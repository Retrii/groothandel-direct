import { retrieveCompany } from "@/lib/data/companies"
import { retrieveCustomer } from "@/lib/data/customer"
import { listRegions } from "@/lib/data/regions"
import ApprovalSettingsCard from "@/modules/account/components/approval-settings-card"
import CompanyCard from "@/modules/account/components/company-card"
import EmployeesCard from "@/modules/account/components/employees-card"
import InviteEmployeeCard from "@/modules/account/components/invite-employee-card"
import { Heading } from "@medusajs/ui"
import { notFound } from "next/navigation"

export default async function Company() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !customer?.employee?.company) return notFound()

  const company = await retrieveCompany(customer.employee.company.id)

  return (
    <div className="space-y-4" data-testid="company-page-wrapper">
      {/* Simple Welcome Section */}
      <div className="pb-3 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Bedrijfsgegevens</h1>
        <p className="text-gray-600 mt-1">
          Beheer uw bedrijfsinformatie en instellingen
        </p>
      </div>

      {/* Company Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
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
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                />
              </svg>
            </div>
            <div>
              <Heading
                level="h2"
                className="text-lg font-semibold text-gray-900"
              >
                Bedrijfsgegevens
              </Heading>
              <p className="text-sm text-gray-600 mt-1">
                Uw bedrijfsinformatie en contactgegevens
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <CompanyCard company={company} regions={regions} />
        </div>
      </div>

      {/* Approval Settings */}
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
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div>
              <Heading
                level="h2"
                className="text-lg font-semibold text-gray-900"
              >
                Goedkeuringsinstellingen
              </Heading>
              <p className="text-sm text-gray-600 mt-1">
                Configureer wanneer goedkeuring vereist is voor bestellingen
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <ApprovalSettingsCard company={company} customer={customer} />
        </div>
      </div>

      {/* Employees */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </div>
            <div>
              <Heading
                level="h2"
                className="text-lg font-semibold text-gray-900"
              >
                Medewerkers
              </Heading>
              <p className="text-sm text-gray-600 mt-1">
                Beheer medewerkers en hun toegangsrechten
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <EmployeesCard company={company} />
        </div>
      </div>

      {/* Invite Employees */}
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
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"
                />
              </svg>
            </div>
            <div>
              <Heading
                level="h2"
                className="text-lg font-semibold text-gray-900"
              >
                Nodig medewerkers uit
              </Heading>
              <p className="text-sm text-gray-600 mt-1">
                Voeg nieuwe medewerkers toe aan uw bedrijf
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <InviteEmployeeCard company={company} />
        </div>
      </div>
    </div>
  )
}
