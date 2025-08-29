import { getCartApprovalStatus } from "@/lib/util/get-cart-approval-status"
import { convertToLocale } from "@/lib/util/money"
import ItemFull from "@/modules/cart/components/item-full"
import { B2BCart } from "@/types/global"
import { StoreCartLineItem } from "@medusajs/types"
import { Container, Text } from "@medusajs/ui"
import { useMemo } from "react"

type ItemsTemplateProps = {
  cart: B2BCart
  showBorders?: boolean
  showTotal?: boolean
}

const ItemsTemplate = ({
  cart,
  showBorders = true,
  showTotal = true,
}: ItemsTemplateProps) => {
  const items = cart?.items
  const totalQuantity = useMemo(
    () => cart?.items?.reduce((acc, item) => acc + item.quantity, 0),
    [cart?.items]
  )

  const { isPendingAdminApproval, isPendingSalesManagerApproval } =
    getCartApprovalStatus(cart)

  const isPendingApproval =
    isPendingAdminApproval || isPendingSalesManagerApproval

  return (
    <div className="w-full">
      <div className="space-y-4">
        {items &&
          items.map((item: StoreCartLineItem) => {
            return (
              <div
                key={item.id}
                className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
              >
                <ItemFull
                  disabled={isPendingApproval}
                  currencyCode={cart?.currency_code}
                  showBorders={false}
                  key={item.id}
                  item={
                    item as StoreCartLineItem & {
                      metadata?: { note?: string }
                    }
                  }
                />
              </div>
            )
          })}
      </div>
      {showTotal && (
        <Container>
          <div className="flex items-start justify-between h-full self-stretch">
            <Text>
              Totaal: {totalQuantity}{" "}
              {totalQuantity === 1 ? "artikel" : "artikelen"}
            </Text>
            <Text>
              {convertToLocale({
                amount: cart?.item_total,
                currency_code: cart?.currency_code,
              })}
            </Text>
          </div>
        </Container>
      )}
    </div>
  )
}

export default ItemsTemplate
