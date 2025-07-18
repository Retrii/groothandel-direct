"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Funnel, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useSearchParams } from "next/navigation"
import { Fragment, useState } from "react"
import CategoryList from "./category-list"
import ProductFilters from "./product-filters"
import SortProducts, { SortOptions } from "./sort-products"

type MobileRefinementProps = {
  sortBy: SortOptions
  listName?: string
  "data-testid"?: string
  categories?: HttpTypes.StoreProductCategory[]
  currentCategory?: HttpTypes.StoreProductCategory
  setQueryParams: (name: string, value: string) => void
  products?: HttpTypes.StoreProduct[]
  isLoading?: boolean
}

const MobileRefinement = ({
  sortBy,
  listName,
  "data-testid": dataTestId,
  categories,
  currentCategory,
  setQueryParams,
  products = [],
  isLoading = false,
}: MobileRefinementProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()

  // Count active filters
  const activeFiltersCount = Array.from(searchParams.keys()).filter(
    (key) => key !== "page" && key !== "sortBy"
  ).length

  return (
    <>
      {/* Fixed Filter Button - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 font-medium shadow-lg"
        >
          <Funnel className="w-5 h-5" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-white text-green-600 px-2 py-0.5 rounded-full text-sm font-semibold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Full Screen Filter Dialog - Mobile Only */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[9999] lg:hidden"
          onClose={setIsOpen}
        >
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" />
          </Transition.Child>

          {/* Full screen panel */}
          <div className="fixed inset-0 z-[9999]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel className="h-full w-full bg-white">
                <div className="flex h-full flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <Dialog.Title className="text-xl font-semibold text-gray-900">
                      Filters
                    </Dialog.Title>
                    <button
                      type="button"
                      className="relative rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex items-center justify-center">
                        <XMark className="h-6 w-6" />
                      </span>
                    </button>
                  </div>

                  {/* Filter Content - Scrollable */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-8">
                      {/* Sort */}
                      <SortProducts
                        sortBy={sortBy}
                        setQueryParams={setQueryParams}
                        data-testid={dataTestId}
                      />

                      {/* Categories */}
                      {categories && (
                        <CategoryList
                          categories={categories}
                          currentCategory={currentCategory}
                        />
                      )}

                      {/* Product Filters */}
                      {!isLoading && products.length > 0 && (
                        <ProductFilters products={products} />
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 p-6">
                    <button
                      type="button"
                      className="w-full rounded-lg bg-gradient-to-r from-green-400 to-green-500 px-6 py-3 text-white font-medium hover:from-green-500 hover:to-green-600 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Toon resultaten
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileRefinement
