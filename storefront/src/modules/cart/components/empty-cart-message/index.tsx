import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="flex items-center justify-center py-24"
      data-testid="empty-cart-message"
    >
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-3">
          Uw winkelwagen is leeg
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm">
          Voeg artikelen toe om te beginnen met winkelen en ontdek ons
          uitgebreide assortiment
        </p>
        <LocalizedClientLink href="/store">
          <Button className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium">
            Bekijk producten
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
