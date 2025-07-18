import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import LineItemOptions from "@/modules/common/components/line-item-options"
import Thumbnail from "@/modules/products/components/thumbnail"
import ItemTotalPrice from "./item-total-price"

type ItemProps = {
  item: HttpTypes.StoreOrderLineItem
  order: HttpTypes.StoreOrder
}

const Item = ({ item, order }: ItemProps) => {
  return (
    <div className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
      <div className="flex-shrink-0">
        <Thumbnail thumbnail={item.thumbnail} size="square" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <Text
              className="font-medium text-gray-900 mb-1"
              data-testid="product-name"
            >
              {item.product_title}
            </Text>
            <LineItemOptions
              variant={item.variant}
              data-testid="product-variant"
            />
          </div>

          <div className="text-right">
            <Text className="text-sm text-gray-500 mb-1">{item.quantity}x</Text>
            <ItemTotalPrice item={item} currencyCode={order.currency_code} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
