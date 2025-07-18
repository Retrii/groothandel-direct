import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ImageGallery from "@/modules/products/components/image-gallery"
import ProductActions from "@/modules/products/components/product-actions"
import ProductTabs from "@/modules/products/components/product-tabs"
import RelatedProducts from "@/modules/products/components/related-products"
import ProductInfo from "@/modules/products/templates/product-info"
import SkeletonRelatedProducts from "@/modules/skeletons/templates/skeleton-related-products"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import React, { Suspense } from "react"
import ProductFacts from "../components/product-facts"
import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

// Product breadcrumb component
const ProductBreadcrumb = ({
  product,
}: {
  product: HttpTypes.StoreProduct
}) => {
  const buildCategoryBreadcrumb = (
    currentCategory: HttpTypes.StoreProductCategory
  ): React.JSX.Element[] => {
    let category: HttpTypes.StoreProductCategory | null = currentCategory
    const breadcrumbs: React.JSX.Element[] = []

    while (category) {
      // Add current category
      breadcrumbs.unshift(
        <LocalizedClientLink
          key={category.id}
          href={`/categories/${category.handle}`}
          className="hover:text-sky-600 transition-colors"
        >
          {category.name}
        </LocalizedClientLink>
      )

      // Move to parent category
      category = category.parent_category || null
    }

    return breadcrumbs
  }

  // Get primary category (first one if multiple)
  const primaryCategory = product.categories?.[0]

  // Build breadcrumb items
  const breadcrumbItems: React.JSX.Element[] = []

  // Add "Alle producten" link
  breadcrumbItems.push(
    <LocalizedClientLink
      key="store"
      href="/store"
      className="hover:text-sky-600"
    >
      Alle producten
    </LocalizedClientLink>
  )

  // Add category breadcrumbs
  if (primaryCategory) {
    breadcrumbItems.push(...buildCategoryBreadcrumb(primaryCategory))
  }

  // Add current product (not clickable)
  breadcrumbItems.push(
    <span key={product.id} className="text-gray-900 font-medium break-words">
      {product.title}
    </span>
  )

  return (
    <nav className="flex items-center flex-wrap gap-x-1 gap-y-1 text-sm text-gray-600">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {item}
          {index < breadcrumbItems.length - 1 && (
            <span className="text-gray-400">/</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="flex flex-col my-4 md:my-6">
      {/* Breadcrumb */}
      <div className="content-container mb-3 md:mb-4 px-4 md:px-0">
        <ProductBreadcrumb product={product} />
      </div>

      {/* Main Product Section */}
      <div
        className="content-container grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12 px-4 md:px-0"
        data-testid="product-container"
      >
        {/* Image Gallery - Left Side */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 md:top-24">
            <ImageGallery product={product} />
          </div>
        </div>

        {/* Product Details - Right Side */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:p-6 lg:p-8">
            {/* Product Header */}
            <ProductInfo product={product} />

            {/* Price and Actions */}
            <div className="mt-6 md:mt-8">
              <Suspense
                fallback={<ProductActions product={product} region={region} />}
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>

            {/* Product Facts */}
            <div className="mt-4 md:mt-6 pt-4 border-t border-gray-200">
              <ProductFacts product={product} />
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs Section */}
      <div className="content-container mb-8 md:mb-12 px-4 md:px-0">
        <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 overflow-hidden">
          <ProductTabs product={product} />
        </div>
      </div>

      {/* Related Products */}
      <div className="py-8 md:py-12" data-testid="related-products-container">
        <div className="content-container px-4 md:px-0">
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default ProductTemplate
