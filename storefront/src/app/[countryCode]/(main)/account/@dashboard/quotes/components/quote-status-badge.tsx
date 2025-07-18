"use client"

const StatusTitles: Record<string, string> = {
  accepted: "Geaccepteerd",
  customer_rejected: "Afgewezen door klant",
  merchant_rejected: "Afgewezen door verkoper",
  pending_merchant: "Wachtend op verkoper",
  pending_customer: "Wachtend op klant",
}

const StatusStyles: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  accepted: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  customer_rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  merchant_rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  pending_merchant: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  pending_customer: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
}

export default function QuoteStatusBadge({ status }: { status: string }) {
  const styles = StatusStyles[status] || StatusStyles.pending_customer

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles.bg} ${styles.text} ${styles.border}`}
    >
      {StatusTitles[status]}
    </span>
  )
}
