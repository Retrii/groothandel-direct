"use client"

import { addCustomerAddress } from "@/lib/data/customer"
import CountrySelect from "@/modules/checkout/components/country-select"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import Input from "@/modules/common/components/input"
import { HttpTypes } from "@medusajs/types"
import { useActionState, useEffect, useState } from "react"

const AddAddress = ({ region }: { region: HttpTypes.StoreRegion }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDefaultBilling, setIsDefaultBilling] = useState(false)
  const [formState, formAction] = useActionState(addCustomerAddress, {
    success: false,
    error: null,
  })

  useEffect(() => {
    if (formState.success) {
      setIsExpanded(false)
      setIsDefaultBilling(false)
      // Reset form state
      formState.success = false
    }
  }, [formState])

  const handleSubmit = async (formData: FormData) => {
    // Add default billing flag to form data
    if (isDefaultBilling) {
      formData.append("is_default_billing", "true")
    }
    await formAction(formData)
  }

  if (!isExpanded) {
    return (
      <div className="relative group">
        <button
          className="w-full h-full min-h-[220px] bg-gradient-to-br from-green-50 to-green-50 border-2 border-dashed border-green-300 rounded-lg p-8 flex flex-col items-center justify-center hover:border-green-400 hover:from-green-100 hover:to-green-100 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
          onClick={() => setIsExpanded(true)}
          data-testid="add-address-button"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
            <svg
              className="w-10 h-10 text-green-600"
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
          </div>
          <span className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
            Nieuw adres toevoegen
          </span>
          <span className="text-sm text-gray-600 text-center max-w-xs leading-relaxed">
            Voeg een nieuw factuur- of verzendadres toe aan uw adresboek
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[220px] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg
                className="w-4 h-4 text-white"
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
              <h3 className="text-lg font-semibold text-white">
                Nieuw adres toevoegen
              </h3>
              <p className="text-sm text-green-100">
                Vul de gegevens in voor uw nieuwe adres
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
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
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <form action={handleSubmit}>
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Persoonlijke gegevens
              </h4>
              <div className="grid grid-cols-2 gap-4">
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
              <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Adresgegevens
              </h4>
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
                <div className="grid grid-cols-[1fr_2fr] gap-4">
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
              <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Contactgegevens
              </h4>
              <Input
                label="Telefoonnummer (optioneel)"
                name="phone"
                autoComplete="phone"
                data-testid="phone-input"
              />
            </div>

            {/* Address Type Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Adres instellingen
              </h4>
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
                  Dit adres wordt gebruikt voor facturen en administratieve
                  doeleinden
                </p>
              </div>
            </div>
          </div>

          {formState.error && (
            <div
              className="text-red-600 text-sm py-4 px-4 bg-red-50 border border-red-200 rounded-lg mt-6 flex items-center"
              data-testid="address-error"
            >
              <svg
                className="w-5 h-5 mr-3 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              {formState.error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex-1"
              data-testid="cancel-button"
            >
              Annuleren
            </button>
            <SubmitButton
              data-testid="save-button"
              className="flex-1 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
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
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Adres opslaan
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAddress
