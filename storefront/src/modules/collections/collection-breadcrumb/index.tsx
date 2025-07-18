import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const CollectionBreadcrumbItem = ({
  title,
  handle,
  isLast = false,
  isBrand = false,
}: {
  title: string
  handle?: string
  isLast?: boolean
  isBrand?: boolean
}) => {
  if (isLast) {
    return <span className="text-gray-900 font-medium">{title}</span>
  }

  // Determine the correct path based on whether it's a brand
  const href = handle
    ? isBrand
      ? `/brands/${handle}`
      : `/collections/${handle}`
    : isBrand
    ? "/brands"
    : "/store"

  return (
    <LocalizedClientLink
      className="text-gray-600 hover:text-green-600 transition-colors duration-200"
      href={href}
    >
      {title}
    </LocalizedClientLink>
  )
}

const CollectionBreadcrumb = ({
  collection,
}: {
  collection: HttpTypes.StoreCollection
}) => {
  const isBrand = collection.metadata?.is_brand === true

  return (
    <nav className="bg-white rounded-lg border border-gray-200 px-3 sm:px-4 py-2 sm:py-3 shadow-sm overflow-x-auto">
      <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm whitespace-nowrap">
        <li>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1 sm:mr-2 text-gray-400 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <LocalizedClientLink
              href="/"
              className="text-gray-600 hover:text-green-600 transition-colors duration-200"
            >
              <span className="hidden sm:inline">Home</span>
              <span className="sm:hidden">H</span>
            </LocalizedClientLink>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-gray-400 mx-1 sm:mx-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <CollectionBreadcrumbItem
              title={isBrand ? "Merken" : "Collecties"}
              isBrand={isBrand}
            />
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-gray-400 mx-1 sm:mx-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <CollectionBreadcrumbItem
              title={collection.title}
              handle={collection.handle}
              isLast={true}
              isBrand={isBrand}
            />
          </div>
        </li>
      </ol>
    </nav>
  )
}

export default CollectionBreadcrumb
