import { listApprovals } from "@/lib/data/approvals"
import { retrieveCompany } from "@/lib/data/companies"
import { retrieveCustomer } from "@/lib/data/customer"
import { listOrders } from "@/lib/data/orders"
import OrderOverview from "@/modules/account/components/order-overview"
import PendingCustomerApprovals from "@/modules/account/components/pending-customer-approvals"
import Breadcrumb from "@/modules/common/components/breadcrumb"
import PageHeader from "@/modules/common/components/page-header"
import { ApprovalStatusType } from "@/types/approval"
import { Heading } from "@medusajs/ui"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bestellingen",
  description: "Overzicht van uw vorige bestellingen.",
}

export default async function Orders() {
  const customer = await retrieveCustomer()
  const orders = await listOrders()

  const { approval_settings } =
    (await retrieveCompany(customer?.employee?.company_id!)) || {}

  const approval_required =
    approval_settings?.requires_admin_approval ||
    approval_settings?.requires_sales_manager_approval

  const { carts_with_approvals } = await listApprovals({
    status: ApprovalStatusType.PENDING,
  })

  return (
    <div className="space-y-4" data-testid="orders-page-wrapper">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Account", href: "/account" },
          { label: "Bestellingen" },
        ]}
      />

      {/* Page Header */}
      <PageHeader
        title="Bestellingen"
        description="Bekijk al uw bestellingen en hun status"
      />

      {/* Simple Stats Row */}
      {(orders?.length || carts_with_approvals?.length) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Voltooid</h3>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {orders?.length || "-"}
            </p>
          </div>

          {approval_required && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Wachtend</h3>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {carts_with_approvals?.length || "-"}
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Laatste</h3>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {orders?.length
                ? new Date(orders[0].created_at).toLocaleDateString("nl-NL", {
                    month: "short",
                  })
                : "-"}
            </p>
          </div>
        </div>
      )}

      {/* Pending Approvals Section */}
      {approval_required &&
        carts_with_approvals &&
        carts_with_approvals.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <Heading
                    level="h2"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Wachtend op goedkeuring
                  </Heading>
                  <p className="text-sm text-gray-600 mt-1">
                    Deze bestellingen wachten op goedkeuring van uw manager
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <PendingCustomerApprovals
                cartsWithApprovals={carts_with_approvals}
              />
            </div>
          </div>
        )}

      {/* Completed Orders Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119.993Z"
                />
              </svg>
            </div>
            <div>
              <Heading
                level="h2"
                className="text-lg font-semibold text-gray-900"
              >
                Voltooide bestellingen
              </Heading>
              <p className="text-sm text-gray-600 mt-1">
                Overzicht van al uw afgeronde bestellingen
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <OrderOverview orders={orders} />
        </div>
      </div>
    </div>
  )
}
