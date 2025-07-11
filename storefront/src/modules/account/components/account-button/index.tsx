import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { B2BCustomer } from "@/types/global"

export default async function AccountButton({
  customer,
}: {
  customer: B2BCustomer | null
}) {
  return (
    <LocalizedClientLink href="/account">
      <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-green-600 rounded-lg transition-colors duration-200 hover:bg-green-50">
        <div className="relative">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          {customer && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          )}
        </div>
        <span className="hidden lg:inline font-medium">
          {customer ? customer.first_name : "Account"}
        </span>
      </div>
    </LocalizedClientLink>
  )
}
