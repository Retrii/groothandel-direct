"use client"

import { updateCustomer } from "@/lib/data/customer"
import Button from "@/modules/common/components/button"
import Input from "@/modules/common/components/input"
import { B2BCustomer } from "@/types/global"
import { HttpTypes } from "@medusajs/types"
import { toast } from "@medusajs/ui"
import { useState } from "react"

const ProfileCard = ({ customer }: { customer: B2BCustomer }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { first_name, last_name, phone } = customer

  const [customerData, setCustomerData] = useState({
    first_name: first_name || "",
    last_name: last_name || "",
    phone: phone || "",
  } as HttpTypes.StoreUpdateCustomer)

  const handleSave = async () => {
    // Basic validation
    if (!customerData.first_name?.trim()) {
      toast.error("Voornaam is verplicht")
      return
    }
    if (!customerData.last_name?.trim()) {
      toast.error("Achternaam is verplicht")
      return
    }

    // Phone validation (optional but if provided, should be valid)
    if (customerData.phone && !isValidPhoneNumber(customerData.phone)) {
      toast.error("Voer een geldig telefoonnummer in")
      return
    }

    setIsSaving(true)
    try {
      await updateCustomer(customerData)
      toast.success("Profiel succesvol bijgewerkt")
      setIsEditing(false)
    } catch (error) {
      toast.error("Fout bij het bijwerken van profiel")
    }
    setIsSaving(false)
  }

  const isValidPhoneNumber = (phone: string): boolean => {
    // Basic phone validation - allows various formats
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/
    return phoneRegex.test(phone.trim())
  }

  return (
    <div className="h-fit">
      <div className="overflow-hidden">
        {isEditing ? (
          <form
            className="grid grid-cols-2 gap-4 p-4"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSave()
              }
            }}
          >
            <div className="flex flex-col gap-y-2">
              <label className="font-medium text-gray-900">Voornaam *</label>
              <Input
                label="Voornaam"
                name="first_name"
                value={customerData.first_name}
                onChange={(e) =>
                  setCustomerData({
                    ...customerData,
                    first_name: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="font-medium text-gray-900">Achternaam *</label>
              <Input
                label="Achternaam"
                name="last_name"
                value={customerData.last_name}
                onChange={(e) =>
                  setCustomerData({
                    ...customerData,
                    last_name: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="font-medium text-gray-900">E-mailadres</label>
              <div className="text-gray-500 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                {customer.email}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                E-mailadres kan niet worden gewijzigd
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="font-medium text-gray-900">
                Telefoonnummer
              </label>
              <Input
                label="Telefoonnummer"
                name="phone"
                value={customerData.phone || ""}
                onChange={(e) =>
                  setCustomerData({ ...customerData, phone: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Optioneel - wordt gebruikt voor bestellingen en support
              </p>
            </div>

            {/* Action buttons in form */}
            <div className="col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false)
                  // Reset form data
                  setCustomerData({
                    first_name: first_name || "",
                    last_name: last_name || "",
                    phone: phone || "",
                  })
                }}
                disabled={isSaving}
              >
                Annuleren
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                isLoading={isSaving}
              >
                Opslaan
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="flex flex-col gap-y-2">
                <span className="font-medium text-gray-900">Voornaam</span>
                <span className="text-gray-500">
                  {customer.first_name ?? "-"}
                </span>
              </div>
              <div className="flex flex-col gap-y-2">
                <span className="font-medium text-gray-900">Achternaam</span>
                <span className="text-gray-500">
                  {customer.last_name ?? "-"}
                </span>
              </div>
              <div className="flex flex-col gap-y-2">
                <span className="font-medium text-gray-900">E-mailadres</span>
                <span className="text-gray-500">{customer.email}</span>
              </div>
              <div className="flex flex-col gap-y-2">
                <span className="font-medium text-gray-900">
                  Telefoonnummer
                </span>
                <span className="text-gray-500">{customer.phone ?? "-"}</span>
              </div>
            </div>

            {/* Edit button */}
            <div className="px-4 pb-4">
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 text-green-700 border-green-200 hover:bg-green-50 hover:border-green-300 font-medium transition-colors duration-200"
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                Bewerk profiel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileCard
