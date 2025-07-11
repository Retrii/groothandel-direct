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
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 rounded-lg transition-colors duration-200"
      >
        <svg
          className="w-5 h-5 mr-2"
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
        <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    <div className="flex items-center justify-between">
                      <span>Categorieën</span>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <XMark className="h-6 w-6" />
                      </button>
                    </div>
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="space-y-2">
                      <LocalizedClientLink
                        href="/store"
                        className="block text-base font-semibold text-gray-900 hover:text-green-600 transition-colors duration-200 pb-2 border-b border-gray-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Alle producten
                      </LocalizedClientLink>
                      {mainCategories.map((category) => {
                        const subCategories = getSubCategories(category.id)
                        const isExpanded = expandedCategory === category.id

                        return (
                          <div key={category.id} className="space-y-1">
                            {subCategories.length > 0 ? (
                              <button
                                onClick={() => toggleCategory(category.id)}
                                className="flex items-center justify-between w-full text-left text-base font-medium text-gray-900 hover:text-green-600 transition-colors duration-200 py-2"
                              >
                                <span>{category.name}</span>
                                <svg
                                  className={clx(
                                    "w-4 h-4 transition-transform duration-200",
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
                                className="block text-base font-medium text-gray-900 hover:text-green-600 transition-colors duration-200 py-2"
                                onClick={() => setIsOpen(false)}
                              >
                                {category.name}
                              </LocalizedClientLink>
                            )}
                            {isExpanded && subCategories.length > 0 && (
                              <div className="pl-4 space-y-1">
                                {subCategories.map((subCategory) => (
                                  <LocalizedClientLink
                                    key={subCategory.id}
                                    href={`/categories/${subCategory.handle}`}
                                    className="block text-sm text-gray-600 hover:text-green-600 transition-colors duration-200 py-1"
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

                  <div className="mt-4">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Sluiten
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
