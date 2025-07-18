"use client"

import { HttpTypes } from "@medusajs/types"
import { Table } from "@medusajs/ui"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  // Check what content we have
  const hasDescription = !!product.description
  const hasSpecs =
    product.variants?.[0]?.sku ||
    product.weight ||
    product.height ||
    product.width ||
    product.length ||
    (product.metadata && Object.keys(product.metadata).length > 0)

  // Check if product has brand information (collection marked as brand)
  const hasBrand = !!(
    product.collection && product.collection.metadata?.is_brand
  )

  // If no content, don't show anything
  if (!hasDescription && !hasSpecs && !hasBrand) {
    return null
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Top section with description and specs side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Product Description - Left */}
        {hasDescription && (
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Productomschrijving
              </h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="prose prose-base max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </div>
            </div>
          </div>
        )}

        {/* Technical Specifications - Right */}
        {hasSpecs && (
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                Technische specificaties
              </h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <Table className="w-full">
                <Table.Body>
                  {/* SKU */}
                  {product.variants?.[0]?.sku && (
                    <Table.Row className="hover:bg-gray-50">
                      <Table.Cell className="font-semibold text-gray-900 w-2/5 py-3 px-4 bg-gray-50">
                        Artikelnummer
                      </Table.Cell>
                      <Table.Cell className="text-gray-700 py-3 px-4">
                        {product.variants[0].sku}
                      </Table.Cell>
                    </Table.Row>
                  )}

                  {/* Weight */}
                  {product.weight && (
                    <Table.Row className="hover:bg-gray-50">
                      <Table.Cell className="font-semibold text-gray-900 w-2/5 py-3 px-4 bg-gray-50">
                        Gewicht
                      </Table.Cell>
                      <Table.Cell className="text-gray-700 py-3 px-4">
                        {(product.weight / 1000).toFixed(2)} kg
                      </Table.Cell>
                    </Table.Row>
                  )}

                  {/* Dimensions */}
                  {(product.height || product.width || product.length) && (
                    <Table.Row className="hover:bg-gray-50">
                      <Table.Cell className="font-semibold text-gray-900 w-2/5 py-3 px-4 bg-gray-50">
                        Afmetingen (H×B×L)
                      </Table.Cell>
                      <Table.Cell className="text-gray-700 py-3 px-4">
                        {[product.height, product.width, product.length]
                          .filter(Boolean)
                          .map(String)
                          .join(" × ")}{" "}
                        cm
                      </Table.Cell>
                    </Table.Row>
                  )}

                  {/* Material from metadata */}
                  {product.metadata?.material && (
                    <Table.Row className="hover:bg-gray-50">
                      <Table.Cell className="font-semibold text-gray-900 w-2/5 py-3 px-4 bg-gray-50">
                        Materiaal
                      </Table.Cell>
                      <Table.Cell className="text-gray-700 py-3 px-4">
                        {String(product.metadata.material)}
                      </Table.Cell>
                    </Table.Row>
                  )}

                  {/* pH Value */}
                  {product.metadata?.ph_value && (
                    <Table.Row className="hover:bg-gray-50">
                      <Table.Cell className="font-semibold text-gray-900 w-2/5 py-3 px-4 bg-gray-50">
                        pH waarde
                      </Table.Cell>
                      <Table.Cell className="text-gray-700 py-3 px-4">
                        {String(product.metadata.ph_value)}
                      </Table.Cell>
                    </Table.Row>
                  )}

                  {/* Concentration */}
                  {product.metadata?.concentration && (
                    <Table.Row className="hover:bg-gray-50">
                      <Table.Cell className="font-semibold text-gray-900 w-2/5 py-3 px-4 bg-gray-50">
                        Concentratie
                      </Table.Cell>
                      <Table.Cell className="text-gray-700 py-3 px-4">
                        {String(product.metadata.concentration)}
                      </Table.Cell>
                    </Table.Row>
                  )}

                  {/* Application Method */}
                  {product.metadata?.application_method && (
                    <Table.Row className="hover:bg-gray-50">
                      <Table.Cell className="font-semibold text-gray-900 w-2/5 py-3 px-4 bg-gray-50">
                        Toepassing methode
                      </Table.Cell>
                      <Table.Cell className="text-gray-700 py-3 px-4">
                        {String(product.metadata.application_method)}
                      </Table.Cell>
                    </Table.Row>
                  )}

                  {/* Packaging */}
                  {product.metadata?.packaging && (
                    <Table.Row className="hover:bg-gray-50">
                      <Table.Cell className="font-semibold text-gray-900 w-2/5 py-3 px-4 bg-gray-50">
                        Verpakking
                      </Table.Cell>
                      <Table.Cell className="text-gray-700 py-3 px-4">
                        {String(product.metadata.packaging)}
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Brand Section */}
      {hasBrand && (
        <div className="border-t border-gray-200 pt-8">
          <div className="border-b border-gray-200 pb-3 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-sky-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              {product.collection.title}
            </h2>
          </div>

          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-lg p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Brand Logo */}
              {product.collection.metadata?.logo ? (
                <div className="w-20 h-20 bg-white rounded-lg p-3 flex items-center justify-center shadow-sm">
                  <img
                    src={String(product.collection.metadata.logo)}
                    alt={product.collection.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-white rounded-lg p-3 flex items-center justify-center shadow-sm">
                  <span className="text-2xl font-bold text-sky-400">
                    {product.collection.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.collection.title}
                </h3>

                {product.collection.metadata?.description && (
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {String(product.collection.metadata.description)}
                  </p>
                )}

                <a
                  href={`/brands/${product.collection.handle}`}
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Bekijk alle {product.collection.title} producten
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductTabs
