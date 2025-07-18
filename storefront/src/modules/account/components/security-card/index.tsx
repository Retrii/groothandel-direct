"use client"

import { changePasswordAction } from "@/lib/data/customer"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import Button from "@/modules/common/components/button"
import Input from "@/modules/common/components/input"
import { B2BCustomer } from "@/types"
import { toast } from "@medusajs/ui"
import { useActionState, useState } from "react"

const SecurityCard = ({ customer }: { customer: B2BCustomer }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formState, formAction] = useActionState(changePasswordAction, {
    success: false,
    error: null,
  })

  const handleSubmit = async (formData: FormData) => {
    await formAction(formData)
  }

  // Handle form state changes
  if (formState.success) {
    toast.success("Wachtwoord succesvol gewijzigd")
    setIsEditing(false)
    // Reset form state
    formState.success = false
  }

  if (formState.error) {
    toast.error(formState.error)
    // Reset error state
    formState.error = null
  }

  return (
    <div className="h-fit">
      <div className="overflow-hidden">
        {isEditing ? (
          <form action={handleSubmit} className="space-y-6 p-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-y-2">
                <label className="font-medium text-gray-900">
                  Huidig wachtwoord *
                </label>
                <Input
                  type="password"
                  name="currentPassword"
                  label="Huidig wachtwoord"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="flex flex-col gap-y-2">
                <label className="font-medium text-gray-900">
                  Nieuw wachtwoord *
                </label>
                <Input
                  type="password"
                  name="newPassword"
                  label="Nieuw wachtwoord"
                  required
                  autoComplete="new-password"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimaal 8 karakters
                </p>
              </div>

              <div className="flex flex-col gap-y-2">
                <label className="font-medium text-gray-900">
                  Bevestig nieuw wachtwoord *
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  label="Bevestig nieuw wachtwoord"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="secondary"
                onClick={() => setIsEditing(false)}
                type="button"
              >
                Annuleren
              </Button>
              <SubmitButton className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200">
                Wachtwoord wijzigen
              </SubmitButton>
            </div>
          </form>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="flex flex-col gap-y-2">
                <span className="font-medium text-gray-900">Wachtwoord</span>
                <span className="text-gray-500">***************</span>
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
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                Wachtwoord wijzigen
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SecurityCard
