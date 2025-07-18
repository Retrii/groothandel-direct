"use client"

import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Dialog, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { Fragment, useState } from "react"

export const MobileB2BMenu = ({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const mainCategories = categories.filter(
    (category) => !category.parent_category_id
  )

  const getSubCategories = (parentId: string) => {
    return categories.filter(
      (category) => category.parent_category_id === parentId
    )
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-sky-400 hover:bg-sky-50 rounded-lg transition-all duration-200 active:scale-95"
      >
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        Menu
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={setIsOpen}>
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
            <div className="fixed inset-0 bg-black bg-opacity-25 z-[9998]" />
          </Transition.Child>

          {/* Full screen overlay */}
          <div className="fixed inset-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="h-full w-full bg-white z-[9999]">
                <div className="flex h-full flex-col">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-sky-400 to-sky-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-xl font-bold text-white">
                        Categorieën
                      </Dialog.Title>
                      <button
                        type="button"
                        className="rounded-full p-2 text-white hover:bg-white/20 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <XMark className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  {/* Content - Scrollable */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                      {/* All Products Link */}
                      <LocalizedClientLink
                        href="/store"
                        className="block w-full rounded-lg bg-gradient-to-r from-green-400 to-green-500 px-6 py-4 text-center font-semibold text-white hover:from-green-500 hover:to-green-600 transition-all duration-200 mb-6"
                        onClick={() => setIsOpen(false)}
                      >
                        Alle producten bekijken
                      </LocalizedClientLink>

                      {/* Categories */}
                      <div className="space-y-2">
                        {mainCategories.map((category) => {
                          const subCategories = getSubCategories(category.id)
                          const isExpanded = expandedCategory === category.id

                          return (
                            <div
                              key={category.id}
                              className="border-b border-gray-100 pb-2"
                            >
                              {subCategories.length > 0 ? (
                                <button
                                  onClick={() => toggleCategory(category.id)}
                                  className="flex items-center justify-between w-full text-left px-4 py-4 text-lg font-semibold text-gray-900 hover:bg-sky-50 hover:text-sky-400 rounded-lg transition-all duration-200"
                                >
                                  <span>{category.name}</span>
                                  <svg
                                    className={clx(
                                      "w-5 h-5 transition-transform duration-200 text-gray-400",
                                      isExpanded ? "rotate-180" : ""
                                    )}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>
                              ) : (
                                <LocalizedClientLink
                                  href={`/categories/${category.handle}`}
                                  className="block px-4 py-4 text-lg font-semibold text-gray-900 hover:bg-sky-50 hover:text-sky-400 rounded-lg transition-all duration-200"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {category.name}
                                </LocalizedClientLink>
                              )}

                              {/* Subcategories */}
                              {isExpanded && subCategories.length > 0 && (
                                <div className="mt-2 ml-4 space-y-1">
                                  {subCategories.map((subCategory) => (
                                    <LocalizedClientLink
                                      key={subCategory.id}
                                      href={`/categories/${subCategory.handle}`}
                                      className="block px-4 py-3 text-base text-gray-600 hover:bg-sky-50 hover:text-sky-400 rounded-lg transition-all duration-200"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      {subCategory.name}
                                    </LocalizedClientLink>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 p-6">
                    <button
                      type="button"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Sluiten
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
