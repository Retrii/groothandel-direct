import { Container, Text } from "@medusajs/ui"

import { isStripe, paymentInfoMap } from "@/lib/constants"
import { convertToLocale } from "@/lib/util/money"
import Divider from "@/modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-3">Betaling</h3>
      <div>
        {payment && (
          <div className="space-y-4">
            <div>
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Betaalmethode
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="betaling-methode"
              >
                {paymentInfoMap[payment.provider_id].title}
              </Text>
            </div>
            <div>
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Betalingsgegevens
              </Text>
              <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
                <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                  {paymentInfoMap[payment.provider_id].icon}
                </Container>
                <Text data-testid="betaling-bedrag">
                  {isStripe(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} betaald op ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleString()}`}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails
