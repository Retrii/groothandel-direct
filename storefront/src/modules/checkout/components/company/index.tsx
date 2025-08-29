"use client"

import CompanyForm from "@/modules/checkout/components/company-form"
import { B2BCart } from "@/types"

const Company = ({ cart }: { cart: B2BCart }) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Bedrijfsgegevens
        </h2>
        <p className="text-sm text-gray-600">
          Uw bedrijfsinformatie voor deze bestelling
        </p>
      </div>

      <form>
        <CompanyForm cart={cart} />
      </form>
    </div>
  )
}

export default Company
