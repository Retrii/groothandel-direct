"use client"

import { addCustomerAddress } from "@/lib/data/customer"
import CountrySelect from "@/modules/checkout/components/country-select"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import Input from "@/modules/common/components/input"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useState } from "react"

const AddAddressForm = ({ region }: { region: HttpTypes.StoreRegion }) => {
  const [isDefaultBilling, setIsDefaultBilling] = useState(false)
  const [formState, formAction] = useActionState(addCustomerAddress, {
    success: false,
    error: null,
  })
  const router = useRouter()

  useEffect(() => {
    if (formState.success) {
      // Redirect back to addresses page after successful addition
      router.push("/nl/account/addresses")
    }
  }, [formState.success, router])

  const handleSubmit = async (formData: FormData) => {
    // Add default billing flag to form data
    if (isDefaultBilling) {
      formData.append("is_default_billing", "true")
    }
    await formAction(formData)
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Personal Information Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
          Persoonlijke gegevens
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Voornaam"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Achternaam"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
        </div>
        <div className="mt-4">
          <Input
            label="Bedrijf (optioneel)"
            name="company"
            autoComplete="organization"
            data-testid="company-input"
          />
        </div>
      </div>

      {/* Address Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
          Adresgegevens
        </h3>
        <div className="space-y-4">
          <Input
            label="Straatnaam en huisnummer"
            name="address_1"
            required
            autoComplete="address-line1"
            data-testid="address-1-input"
          />
          <Input
            label="Appartement, suite, etc. (optioneel)"
            name="address_2"
            autoComplete="address-line2"
            data-testid="address-2-input"
          />
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
            <Input
              label="Postcode"
              name="postal_code"
              required
              autoComplete="postal-code"
              data-testid="postal-code-input"
            />
            <Input
              label="Plaats"
              name="city"
              required
              autoComplete="locality"
              data-testid="city-input"
            />
          </div>
          <Input
            label="Provincie (optioneel)"
            name="province"
            autoComplete="address-level1"
            data-testid="state-input"
          />
          <CountrySelect
            region={region}
            name="country_code"
            required
            autoComplete="country"
            data-testid="country-select"
          />
        </div>
      </div>

      {/* Contact Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
          Contactgegevens
        </h3>
        <Input
          label="Telefoonnummer (optioneel)"
          name="phone"
          autoComplete="phone"
          data-testid="phone-input"
        />
      </div>

      {/* Address Type Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
          Adres instellingen
        </h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={isDefaultBilling}
              onChange={(e) => setIsDefaultBilling(e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              data-testid="default-billing-checkbox"
            />
            <span className="text-sm text-gray-700 font-medium">
              Dit adres instellen als standaard factuuradres
            </span>
          </label>
          <p className="text-xs text-gray-500 ml-7">
            Dit adres wordt gebruikt voor facturen en administratieve doeleinden
          </p>
        </div>
      </div>

      {/* Error Display */}
      {formState.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Er is een fout opgetreden
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{formState.error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Annuleren
        </button>
        <SubmitButton className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200">
          Adres toevoegen
        </SubmitButton>
      </div>
    </form>
  )
}

export default AddAddressForm
