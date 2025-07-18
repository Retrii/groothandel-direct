"use client"

import { currencySymbolMap } from "@/lib/constants"
import { signup } from "@/lib/data/customer"
import { LOGIN_VIEW } from "@/modules/account/templates/login-template"
import ErrorMessage from "@/modules/checkout/components/error-message"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import Input from "@/modules/common/components/input"
import { HttpTypes } from "@medusajs/types"
import { Checkbox, Label, Select, Text } from "@medusajs/ui"
import { ChangeEvent, useActionState, useState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
  regions: HttpTypes.StoreRegion[]
}

interface FormData {
  email: string
  first_name: string
  last_name: string
  company_name: string
  password: string
  company_address: string
  company_city: string
  company_state: string
  company_zip: string
  company_country: string
  currency_code: string
}

const initialFormData: FormData = {
  email: "",
  first_name: "",
  last_name: "",
  company_name: "",
  password: "",
  company_address: "",
  company_city: "",
  company_state: "",
  company_zip: "",
  company_country: "",
  currency_code: "",
}

const Register = ({ setCurrentView, regions }: Props) => {
  const [message, formAction] = useActionState(signup, null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: keyof FormData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const isValid =
    termsAccepted &&
    !!formData.email &&
    !!formData.first_name &&
    !!formData.last_name &&
    !!formData.company_name &&
    !!formData.password &&
    !!formData.company_address &&
    !!formData.company_city &&
    !!formData.company_zip &&
    !!formData.company_country &&
    !!formData.currency_code

  const countryNames = regions
    .flatMap((region) =>
      region.countries?.map((country) => country?.display_name || country?.name)
    )
    .filter((country) => country !== undefined)

  const currencies = regions.map((region) => region.currency_code)

  return (
    <div className="w-full" data-testid="register-page">
      <form className="space-y-6" action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="E-mailadres"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
            className="w-full"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label="Wachtwoord"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
            className="w-full"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Voornaam"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
            className="w-full"
            value={formData.first_name}
            onChange={handleChange}
          />
          <Input
            label="Achternaam"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
            className="w-full"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Bedrijfsinformatie
          </h3>

          <Input
            label="Bedrijfsnaam"
            name="company_name"
            required
            autoComplete="organization"
            data-testid="company-name-input"
            className="w-full"
            value={formData.company_name}
            onChange={handleChange}
          />

          <Input
            label="Adres"
            name="company_address"
            required
            autoComplete="address"
            data-testid="company-address-input"
            className="w-full"
            value={formData.company_address}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Stad"
              name="company_city"
              required
              autoComplete="city"
              data-testid="company-city-input"
              className="w-full"
              value={formData.company_city}
              onChange={handleChange}
            />
            <Input
              label="Provincie (optioneel)"
              name="company_state"
              autoComplete="state"
              data-testid="company-state-input"
              className="w-full"
              value={formData.company_state}
              onChange={handleChange}
            />
            <Input
              label="Postcode"
              name="company_zip"
              required
              autoComplete="postal-code"
              data-testid="company-zip-input"
              className="w-full"
              value={formData.company_zip}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Land *
              </Label>
              <Select
                name="company_country"
                required
                autoComplete="country"
                data-testid="company-country-input"
                value={formData.company_country}
                onValueChange={handleSelectChange("company_country")}
              >
                <Select.Trigger className="w-full h-10 px-3 border border-gray-300 rounded-lg">
                  <Select.Value placeholder="Selecteer een land" />
                </Select.Trigger>
                <Select.Content>
                  {countryNames?.map((country) => (
                    <Select.Item key={country} value={country}>
                      {country}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Valuta *
              </Label>
              <Select
                name="currency_code"
                required
                autoComplete="currency"
                data-testid="company-currency-input"
                value={formData.currency_code}
                onValueChange={handleSelectChange("currency_code")}
              >
                <Select.Trigger className="w-full h-10 px-3 border border-gray-300 rounded-lg">
                  <Select.Value placeholder="Selecteer een valuta" />
                </Select.Trigger>
                <Select.Content>
                  {[...new Set(currencies)].map((currency) => (
                    <Select.Item key={currency} value={currency}>
                      {currency.toUpperCase()} ({currencySymbolMap[currency]})
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
          </div>
        </div>

        <ErrorMessage error={message} data-testid="register-error" />

        <div className="flex items-start space-x-3">
          <Checkbox
            name="terms"
            id="terms-checkbox"
            data-testid="terms-checkbox"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(!!checked)}
            className="mt-1"
          />
          <Label
            className="text-sm text-gray-700 leading-relaxed cursor-pointer"
            htmlFor="terms-checkbox"
            data-testid="terms-label"
          >
            Ik ga akkoord met de algemene voorwaarden en het privacybeleid.
          </Label>
        </div>

        <SubmitButton
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 rounded-lg"
          data-testid="register-button"
          disabled={!isValid}
        >
          Account aanmaken
        </SubmitButton>

        <div className="text-center">
          <Text className="text-sm text-gray-600">
            Heeft u al een account?{" "}
            <button
              type="button"
              onClick={() => setCurrentView(LOGIN_VIEW.LOG_IN)}
              className="font-medium text-green-600 hover:text-green-500"
            >
              Inloggen
            </button>
          </Text>
        </div>
      </form>
    </div>
  )
}

export default Register
