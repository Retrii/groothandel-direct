import { isManual } from "@/lib/constants"
import PaymentTest from "@/modules/checkout/components/payment-test"
import Radio from "@/modules/common/components/radio"
import { RadioGroup } from "@headlessui/react"
import { clx } from "@medusajs/ui"
import React, { type JSX } from "react"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <RadioGroup.Option
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "flex items-center justify-between p-4 border rounded cursor-pointer transition-colors",
        {
          "border-gray-900 bg-gray-50":
            selectedPaymentOptionId === paymentProviderId,
          "border-gray-200 hover:border-gray-300":
            selectedPaymentOptionId !== paymentProviderId,
        }
      )}
    >
      <div className="flex items-center gap-4">
        <Radio checked={selectedPaymentOptionId === paymentProviderId} />
        <span className="font-medium text-gray-900">
          {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
        </span>
        {isManual(paymentProviderId) && isDevelopment && (
          <PaymentTest className="hidden sm:block" />
        )}
      </div>
      <div className="flex items-center gap-2">
        {paymentInfoMap[paymentProviderId]?.icon}
        {isManual(paymentProviderId) && isDevelopment && (
          <PaymentTest className="sm:hidden text-xs" />
        )}
      </div>
    </RadioGroup.Option>
  )
}

export default PaymentContainer
