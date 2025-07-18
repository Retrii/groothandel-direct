import { retrieveCustomer } from "@/lib/data/customer"
import { getRegion } from "@/lib/data/regions"
import AddressBook from "@/modules/account/components/address-book"
import Breadcrumb from "@/modules/common/components/breadcrumb"
import PageHeader from "@/modules/common/components/page-header"
import { Heading } from "@medusajs/ui"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Adressen",
  description: "Bekijk uw opgeslagen adressen",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  const hasAddresses = customer.addresses && customer.addresses.length > 0

  return (
    <div className="space-y-4" data-testid="addresses-page-wrapper">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: "Account", href: "/account" }, { label: "Adressen" }]}
      />

      {/* Page Header */}
      <PageHeader
        title="Adressen"
        description="Beheer uw verzend- en factuuradressen"
      />

      {/* Address Book Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
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
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </div>
              <div>
                <Heading
                  level="h2"
                  className="text-lg font-semibold text-gray-900"
                >
                  Adresboek
                </Heading>
                <p className="text-sm text-gray-600 mt-1">
                  Voeg adressen toe voor factuur- en verzendgegevens
                </p>
              </div>
            </div>
            {hasAddresses && (
              <Link
                href={`/${countryCode}/account/addresses/add`}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Adres toevoegen
              </Link>
            )}
          </div>
        </div>
        <div className="p-6 pt-0">
          <AddressBook customer={customer} region={region} />
        </div>
      </div>
    </div>
  )
}
