"use client"

import { HttpTypes } from "@medusajs/types"
import ProductPrice from "../product-price"
import ProductVariantsTable from "../product-variants-table"
import SingleVariantAction from "./single-variant-action"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

export default function ProductActions({
  product,
  region,
}: ProductActionsProps) {
  const hasMultipleVariants = product.variants && product.variants.length > 1

  return (
    <div className="flex flex-col gap-y-6">
      {/* Pricing Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <ProductPrice product={product} />
      </div>

      {/* Variants Section */}
      <div>
        {hasMultipleVariants ? (
          <>
            <span className="text-sm text-gray-700 font-medium block mb-4">
              Selecteer varianten en hoeveelheden
            </span>
            <ProductVariantsTable product={product} region={region} />
          </>
        ) : (
          <SingleVariantAction product={product} region={region} />
        )}
      </div>
    </div>
  )
}
