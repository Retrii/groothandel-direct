import LocalizedClientLink from "@/modules/common/components/localized-client-link"

const StoreBreadcrumbItem = ({
  title,
  handle,
  isLast = false,
}: {
  title: string
  handle?: string
  isLast?: boolean
}) => {
  if (isLast) {
    return <span className="text-gray-900 font-medium text-sm">{title}</span>
  }

  return (
    <LocalizedClientLink
      className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
      href={handle ? `${handle}` : "/store"}
    >
      {title}
    </LocalizedClientLink>
  )
}

const StoreBreadcrumb = () => {
  return (
    <nav className="bg-white rounded-lg border border-gray-200 px-3 sm:px-4 py-3 shadow-sm">
      {/* Mobile: Simple back button */}
      <div className="sm:hidden">
        <LocalizedClientLink
          href="/"
          className="flex items-center text-gray-600 hover:text-green-600 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">Terug naar home</span>
        </LocalizedClientLink>
      </div>

      {/* Desktop: Full breadcrumb */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto">
          <ol className="flex items-center space-x-2 whitespace-nowrap">
            <li className="flex items-center flex-shrink-0">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <LocalizedClientLink
                  href="/"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  Home
                </LocalizedClientLink>
              </div>
            </li>
            <li className="flex items-center flex-shrink-0">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <StoreBreadcrumbItem title="Alle Producten" isLast={true} />
              </div>
            </li>
          </ol>
        </div>
      </div>
    </nav>
  )
}

export default StoreBreadcrumb
