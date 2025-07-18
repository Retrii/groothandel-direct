"use client"

import { addToCartEventBus } from "@/lib/data/cart-event-bus"
import Button from "@/modules/common/components/button"
import ShoppingBag from "@/modules/common/icons/shopping-bag"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { useState } from "react"

type SingleVariantActionProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

export default function SingleVariantAction({
  product,
  region,
}: SingleVariantActionProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const variant = product.variants?.[0]
  const inventoryQuantity = variant?.inventory_quantity ?? 0

  const handleAddToCart = async () => {
    if (!variant?.id) return

    setIsAdding(true)

    addToCartEventBus.emitCartAdd({
      lineItems: [
        {
          productVariant: {
            ...variant,
            product,
          },
          quantity,
        },
      ],
      regionId: region.id,
    })

    // Reset quantity after adding
    setTimeout(() => {
      setQuantity(1)
      setIsAdding(false)
    }, 500)
  }

  const handleQuantityChange = (value: number) => {
    if (value < 1) {
      setQuantity(1)
    } else {
      setQuantity(value)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stock warning */}
      {inventoryQuantity > 0 && inventoryQuantity <= 50 && (
        <span className="text-sm text-amber-600">
          Nog {inventoryQuantity} beschikbaar
        </span>
      )}

      {/* Quantity and Add to Cart in one row */}
      <div className="flex items-center gap-3">
        {/* Quantity Selector */}
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            className={clx(
              "p-2 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors",
              quantity <= 1 && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>

          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              handleQuantityChange(parseInt(e.target.value) || 1)
            }
            className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
            min="1"
          />

          <button
            className={clx(
              "p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
            )}
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          variant="primary"
          className="flex-1 h-[42px] text-base font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          <ShoppingBag className="text-white mr-2" fill="#fff" />
          Voeg toe aan winkelwagen
        </Button>
      </div>
    </div>
  )
}
