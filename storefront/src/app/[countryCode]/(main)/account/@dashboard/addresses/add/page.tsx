import { retrieveCustomer } from "@/lib/data/customer"
import { getRegion } from "@/lib/data/regions"
import AddAddressForm from "@/modules/account/components/address-card/add-address-form"
import Breadcrumb from "@/modules/common/components/breadcrumb"
import PageHeader from "@/modules/common/components/page-header"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Adres toevoegen",
  description: "Voeg een nieuw adres toe aan uw adresboek",
}

export default async function AddAddress(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="space-y-4" data-testid="add-address-page-wrapper">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Account", href: "/account" },
          { label: "Adressen", href: "/account/addresses" },
          { label: "Adres toevoegen" },
        ]}
      />

      {/* Page Header */}
      <PageHeader
        title="Adres toevoegen"
        description="Voeg een nieuw verzend- of factuuradres toe"
      />

      {/* Add Address Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <AddAddressForm region={region} />
        </div>
      </div>
    </div>
  )
}
