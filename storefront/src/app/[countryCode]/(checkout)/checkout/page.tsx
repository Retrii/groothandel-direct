import { retrieveCart } from "@/lib/data/cart"
import { retrieveCustomer } from "@/lib/data/customer"
import Wrapper from "@/modules/checkout/components/payment-wrapper"
import CheckoutForm from "@/modules/checkout/templates/checkout-form"
import CheckoutSummary from "@/modules/checkout/templates/checkout-summary"
import { B2BCart } from "@/types/global"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Afrekenen | Groothandel Direct",
  description:
    "Vul uw gegevens in om uw bestelling veilig af te ronden bij Groothandel Direct.",
}

export default async function Checkout({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const cartId = searchParams?.cartId as string
  const cart = (await retrieveCart(cartId)) as B2BCart

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <Wrapper cart={cart}>
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <CheckoutForm cart={cart} customer={customer} />
            </div>

            {/* Order Summary - Takes 1 column */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <CheckoutSummary cart={cart} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
