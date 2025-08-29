"use client"

import { useCart } from "@/lib/context/cart-context"
import AddNoteButton from "@/modules/cart/components/add-note-button"
import DeleteButton from "@/modules/common/components/delete-button"
import LineItemPrice from "@/modules/common/components/line-item-price"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Spinner from "@/modules/common/icons/spinner"
import Thumbnail from "@/modules/products/components/thumbnail"
import { HttpTypes } from "@medusajs/types"
import { clx, Input } from "@medusajs/ui"
import { startTransition, useEffect, useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  showBorders?: boolean
  currencyCode: string
  disabled?: boolean
}

const ItemFull = ({
  item,
  showBorders = true,
  currencyCode,
  disabled,
}: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [quantity, setQuantity] = useState(item.quantity.toString())

  const { handleDeleteItem, handleUpdateCartQuantity } = useCart()

  const changeQuantity = async (newQuantity: number) => {
    setError(null)
    // setUpdating(true)

    startTransition(() => {
      setQuantity(newQuantity.toString())
    })

    await handleUpdateCartQuantity(item.id, Number(newQuantity))
  }

  useEffect(() => {
    setQuantity(item.quantity.toString())
  }, [item.quantity])

  const handleBlur = (value: number) => {
    if (value === item.quantity) {
      return
    }

    if (value > maxQuantity) {
      changeQuantity(maxQuantity)
    }

    if (value < 1) {
      setUpdating(true)
      handleDeleteItem(item.id)
      setUpdating(false)
    }

    changeQuantity(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) {
      return
    }

    if (e.key === "Enter") {
      changeQuantity(Number(quantity))
    }

    if (e.key === "ArrowUp" && e.shiftKey) {
      e.preventDefault()
      setQuantity((Number(quantity) + 10).toString())
    }

    if (e.key === "ArrowDown" && e.shiftKey) {
      e.preventDefault()
      setQuantity((Number(quantity) - 10).toString())
    }
  }

  const maxQuantity = item.variant?.inventory_quantity ?? 100

  return (
    <div className="flex gap-4 w-full items-start">
      <LocalizedClientLink href={`/products/${item.product_handle}`}>
        <Thumbnail
          thumbnail={item.thumbnail}
          size="square"
          type="full"
          className="bg-gray-100 rounded-lg w-20 h-20 flex-shrink-0"
        />
      </LocalizedClientLink>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <h4 className="font-medium text-gray-900 text-sm leading-tight">
                {item.product?.title}
              </h4>
              {item.variant?.title && (
                <span className="text-gray-500 text-xs">
                  {item.variant?.title}
                </span>
              )}
            </div>

            <div className="text-right my-auto">
              <LineItemPrice
                item={item}
                currencyCode={currencyCode}
                style="default"
                className="font-semibold text-gray-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
              <button
                className={clx(
                  "w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors",
                  disabled ? "opacity-50 pointer-events-none" : "opacity-100"
                )}
                onClick={() => changeQuantity(item.quantity - 1)}
                disabled={item.quantity <= 1 || disabled}
              >
                -
              </button>
              <div className="w-12 h-8 flex items-center justify-center text-gray-900 text-sm font-medium">
                {updating ? (
                  <Spinner size="12" />
                ) : (
                  <Input
                    className={clx(
                      "w-full h-full text-center text-gray-900 text-sm font-medium bg-transparent border-0 shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                      disabled
                        ? "opacity-50 pointer-events-none"
                        : "opacity-100"
                    )}
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(e.target.value)
                    }}
                    onBlur={(e) => {
                      handleBlur(Number(e.target.value))
                    }}
                    onKeyDown={(e) => handleKeyDown(e)}
                    disabled={disabled}
                  />
                )}
              </div>
              <button
                className={clx(
                  "w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors",
                  disabled ? "opacity-50 pointer-events-none" : "opacity-100"
                )}
                onClick={() => changeQuantity(item.quantity + 1)}
                disabled={item.quantity >= maxQuantity || disabled}
              >
                +
              </button>
            </div>

            <DeleteButton id={item.id} disabled={disabled} />
          </div>

          <div className="mt-3">
            <AddNoteButton
              item={item as HttpTypes.StoreCartLineItem}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemFull
