"use client"

import { listApprovals } from "@/lib/data/approvals"
import { signout } from "@/lib/data/customer"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { ApprovalStatusType } from "@/types/approval"
import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"

// Custom SVG Icons
const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m2.25 12 8.25-8.25a1.125 1.125 0 0 1 1.59 0L20.25 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
)

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
    />
  </svg>
)

const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
)

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
)

const DocumentTextIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
)

const ArrowRightOnRectangleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
    />
  </svg>
)

type AccountNavProps = {
  customer: any
}

const AccountNav = ({ customer }: AccountNavProps) => {
  const route = usePathname()
  const params = useParams()
  const [numPendingApprovals, setNumPendingApprovals] = useState(0)

  const handleLogout = async () => {
    if (customer?.id && params?.countryCode) {
      await signout(params.countryCode as string, customer.id)
    }
  }

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      if (customer?.employee?.is_admin) {
        try {
          const result = await listApprovals({
            status: ApprovalStatusType.PENDING,
          })
          setNumPendingApprovals(result?.carts_with_approvals?.length || 0)
        } catch (error) {
          console.error("Error fetching pending approvals:", error)
          setNumPendingApprovals(0)
        }
      }
    }

    fetchPendingApprovals()
  }, [customer?.employee?.is_admin])

  const navigationItems = [
    {
      href: "/account",
      label: "Overzicht",
      icon: HomeIcon,
      testId: "overview-link",
    },
    {
      href: "/account/profile",
      label: "Profiel",
      icon: UserIcon,
      testId: "profile-link",
    },
    {
      href: "/account/addresses",
      label: "Adressen",
      icon: MapPinIcon,
      testId: "addresses-link",
    },
    {
      href: "/account/orders",
      label: "Bestellingen",
      icon: ShoppingBagIcon,
      testId: "orders-link",
    },
    ...(customer?.employee?.is_admin
      ? [
          {
            href: "/account/approvals",
            label: "Goedkeuringen",
            icon: CheckCircleIcon,
            testId: "approvals-link",
            badge: numPendingApprovals,
          },
        ]
      : []),
    {
      href: "/account/quotes",
      label: "Offertes",
      icon: DocumentTextIcon,
      testId: "quotes-link",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Mobile Header */}
      <div
        className="lg:hidden border-b border-gray-100 p-4"
        data-testid="mobile-account-nav"
      >
        {customer && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {customer.first_name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">
                {customer.first_name}
              </h3>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
            <Button
              variant="secondary"
              onClick={handleLogout}
              data-testid="logout-button"
              className="text-sm"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="p-6" data-testid="account-nav">
        <div className="hidden lg:block mb-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {customer?.first_name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {customer?.first_name}
              </h3>
              <p className="text-sm text-gray-500">{customer?.email}</p>
            </div>
          </div>
        </div>

        <nav>
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <AccountNavLink
                  href={item.href}
                  route={route!}
                  icon={item.icon}
                  badge={item.badge}
                  data-testid={item.testId}
                >
                  {item.label}
                </AccountNavLink>
              </li>
            ))}

            {/* Logout Button */}
            <li className="pt-4 border-t border-gray-100 mt-4">
              <button
                type="button"
                onClick={handleLogout}
                data-testid="logout-button"
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>Uitloggen</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  icon: Icon,
  badge,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href

  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
        {
          "bg-green-50 text-green-700 border-l-2 border-green-600": active,
          "text-gray-600 hover:text-gray-900 hover:bg-gray-50": !active,
        }
      )}
      data-testid={dataTestId}
    >
      <div className="flex items-center space-x-3">
        <Icon
          className={clx("w-4 h-4", {
            "text-green-600": active,
            "text-gray-400": !active,
          })}
        />
        <span>{children}</span>
      </div>
      {badge && badge > 0 && (
        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
          {badge}
        </span>
      )}
    </LocalizedClientLink>
  )
}

export default AccountNav
