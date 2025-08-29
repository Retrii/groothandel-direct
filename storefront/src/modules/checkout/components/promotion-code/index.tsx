"use client"

import { applyPromotions, submitPromotionForm } from "@/lib/data/cart"
import { getCartApprovalStatus } from "@/lib/util/get-cart-approval-status"
import { convertToLocale } from "@/lib/util/money"
import Trash from "@/modules/common/icons/trash"
import { B2BCart } from "@/types"
import { ChevronDownMini, ChevronUpMini } from "@medusajs/icons"
import { Badge, Input } from "@medusajs/ui"
import { usePathname } from "next/navigation"
import React, { useActionState } from "react"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type PromotionCodeProps = {
  cart: B2BCart
}

const PromotionCode: React.FC<PromotionCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  const isCheckout = pathname.includes("/checkout")

  const { promotions = [] } = cart

  const { isPendingAdminApproval, isPendingSalesManagerApproval } =
    getCartApprovalStatus(cart)

  const isPendingApproval =
    isPendingAdminApproval || isPendingSalesManagerApproval

  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code === undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    const code = formData.get("code")
    if (!code) {
      return
    }

    try {
      const input = document.getElementById(
        "promotion-input"
      ) as HTMLInputElement
      const codes = promotions
        .filter((p) => p.code === undefined)
        .map((p) => p.code!)
      codes.push(code.toString())

      await applyPromotions(codes)

      if (input) {
        input.value = ""
      }
      setIsOpen(false) // Close the form on success
    } catch (error: any) {
      // Error will be handled by the form action
    }
  }

  const [message, formAction] = useActionState(submitPromotionForm, null)

  return (
    <div className="space-y-3 bg-white border border-gray-200 rounded-lg p-3">
      {!isCheckout && !isPendingApproval && (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="flex items-center justify-between w-full text-left text-sm text-gray-700 hover:text-gray-900 "
            data-testid="add-discount-button"
          >
            <span>Promotiecode toevoegen</span>
            {isOpen ? (
              <ChevronUpMini className="w-4 h-4" />
            ) : (
              <ChevronDownMini className="w-4 h-4" />
            )}
          </button>

          {isOpen && (
            <form action={formAction} className="mt-3 space-y-2">
              <Input
                className="w-full h-9 text-sm bg-white"
                id="promotion-input"
                name="code"
                type="text"
                placeholder="Voer promotiecode in"
                autoFocus={false}
                data-testid="discount-input"
              />
              <SubmitButton
                className="w-full h-9 text-sm"
                data-testid="discount-apply-button"
              >
                Toepassen
              </SubmitButton>

              <ErrorMessage
                error={message}
                data-testid="discount-error-message"
              />
            </form>
          )}
        </>
      )}

      {promotions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">
            Toegepaste promoties
          </p>
          {promotions.map((promotion) => (
            <div
              className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-2"
              key={promotion.id}
              data-testid="discount-row"
            >
              <div className="flex items-center gap-2">
                <Badge className="text-xs">{promotion.code}</Badge>
                <span className="text-xs text-gray-600">
                  (
                  {promotion.application_method?.value !== undefined &&
                    promotion.application_method.currency_code !==
                      undefined && (
                      <>
                        {promotion.application_method.type === "percentage"
                          ? `${promotion.application_method.value}%`
                          : convertToLocale({
                              amount: promotion.application_method.value,
                              currency_code:
                                promotion.application_method.currency_code,
                            })}
                      </>
                    )}
                  )
                </span>
              </div>

              {!promotion.is_automatic && !isCheckout && (
                <button
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => {
                    if (!promotion.code) {
                      return
                    }
                    removePromotionCode(promotion.code)
                  }}
                  data-testid="remove-discount-button"
                >
                  <Trash size={12} />
                  <span className="sr-only">Verwijder promotiecode</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PromotionCode
