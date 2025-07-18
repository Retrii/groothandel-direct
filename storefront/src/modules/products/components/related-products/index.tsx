import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: any = {
    limit: 8,
  }

  // Get products from the same collection
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products
      .filter((responseProduct) => responseProduct.id !== product.id)
      .slice(0, 8)
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-6">
      <Heading level="h2" className="text-2xl text-gray-900 font-bold">
        Gerelateerde producten
      </Heading>
      <ul className="grid grid-cols-1 sm:grid-cols-2 medium:grid-cols-3 large:grid-cols-4 gap-6">
        {products.map((product) => (
          <li key={product.id}>
            <Product region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
