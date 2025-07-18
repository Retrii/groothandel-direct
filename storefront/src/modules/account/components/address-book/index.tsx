import EditAddress from "@/modules/account/components/address-card/edit-address-modal"
import { B2BCustomer } from "@/types/global"
import { HttpTypes } from "@medusajs/types"
import Link from "next/link"

type AddressBookProps = {
  customer: B2BCustomer
  region: HttpTypes.StoreRegion
}

const AddressBook: React.FC<AddressBookProps> = ({ customer, region }) => {
  if (customer.addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Geen adressen gevonden
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          U heeft nog geen adressen toegevoegd aan uw adresboek. Voeg uw eerste
          adres toe om te beginnen.
        </p>
        <Link
          href={`/nl/account/addresses/add`}
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
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
          Eerste adres toevoegen
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {customer.addresses.map((address) => {
          return (
            <EditAddress
              region={region}
              address={address}
              key={address.id}
              customer={customer}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AddressBook
