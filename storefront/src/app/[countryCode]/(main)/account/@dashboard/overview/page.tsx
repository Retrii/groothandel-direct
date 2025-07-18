import { listApprovals } from "@/lib/data/approvals"
import { retrieveCompany } from "@/lib/data/companies"
import { getProfileCompletionData, retrieveCustomer } from "@/lib/data/customer"
import { listOrders } from "@/lib/data/orders"
import Overview from "@/modules/account/components/overview"
import Breadcrumb from "@/modules/common/components/breadcrumb"
import { ApprovalStatusType } from "@/types/approval"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Overzicht",
  description: "Bekijk uw account overzicht en recente activiteiten.",
}

export default async function OverviewPage() {
  const customer = await retrieveCustomer()
  const orders = await listOrders()
  const company = customer?.employee?.company_id
    ? await retrieveCompany(customer.employee.company_id)
    : null

  if (!customer) {
    notFound()
  }

  const { approval_settings } = company || {}

  const approval_required =
    approval_settings?.requires_admin_approval ||
    approval_settings?.requires_sales_manager_approval

  const { carts_with_approvals } = await listApprovals({
    status: ApprovalStatusType.PENDING,
  })

  // Calculate profile completion server-side
  let profileCompletion
  try {
    profileCompletion = await getProfileCompletionData(customer)
  } catch (error) {
    console.error("Error getting profile completion:", error)
    profileCompletion = { percentage: 0, steps: [] }
  }

  return (
    <div className="space-y-4" data-testid="overview-page-wrapper">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: "Account", href: "/account" }, { label: "Overzicht" }]}
      />

      {/* Main Overview Component */}
      <Overview
        customer={customer}
        orders={orders}
        profileCompletion={profileCompletion}
      />
    </div>
  )
}
