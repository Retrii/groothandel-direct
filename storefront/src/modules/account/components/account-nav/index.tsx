"use client"

import { listPendingApprovals } from "@/lib/data/approvals"
import { signout } from "@/lib/data/customer"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import React from "react"

type AccountNavProps = {
  customer: any
}

const AccountNav = ({ customer }: AccountNavProps) => {
  const route = usePathname()

  const handleLogout = async () => {
    await signout()
  }

  const [pendingApprovalsResult] = React.use([
    customer?.employee?.is_admin ? listPendingApprovals() : Promise.resolve([]),
  ])

  const numPendingApprovals = pendingApprovalsResult?.length || 0

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">
        {customer ? (
          <div className="flex items-center justify-between py-4">
            <div>
              <h2 data-testid="welcome-message" className="text-xl-semi">
                Hello {customer.first_name}
              </h2>
              <p className="text-base-regular text-ui-fg-base">
                Signed in as:{" "}
                <span className="font-semibold" data-testid="customer-email">
                  {customer.email}
                </span>
              </p>
            </div>
            <div>
              <Button
                variant="secondary"
                onClick={handleLogout}
                data-testid="logout-button"
              >
                Log out
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="hidden small:block" data-testid="account-nav">
        <div>
          <div className="pb-4">
            <h3 className="text-base-semi text-neutral-950 mb-4">Account</h3>
            <div className="text-base-regular">
              <ul className="flex mb-0 justify-start items-start flex-col gap-y-4">
                <li>
                  <AccountNavLink
                    href="/account"
                    route={route!}
                    data-testid="overview-link"
                  >
                    Overview
                  </AccountNavLink>
                </li>
                <li>
                  <AccountNavLink
                    href="/account/profile"
                    route={route!}
                    data-testid="profile-link"
                  >
                    Profile
                  </AccountNavLink>
                </li>
                <li>
                  <AccountNavLink
                    href="/account/addresses"
                    route={route!}
                    data-testid="addresses-link"
                  >
                    Addresses
                  </AccountNavLink>
                </li>
                <li>
                  <AccountNavLink
                    href="/account/orders"
                    route={route!}
                    data-testid="orders-link"
                  >
                    Orders
                  </AccountNavLink>
                </li>
                {customer?.employee?.is_admin && (
                  <li>
                    <AccountNavLink
                      href="/account/approvals"
                      route={route!}
                      data-testid="approvals-link"
                    >
                      Approvals{" "}
                      {numPendingApprovals > 0 && (
                        <span className="bg-green-500 text-white text-xs px-1.5 py-px rounded-full">
                          {numPendingApprovals}
                        </span>
                      )}
                    </AccountNavLink>
                  </li>
                )}
                <li>
                  <AccountNavLink
                    href="/account/quotes"
                    route={route!}
                    data-testid="quotes-link"
                  >
                    Quotes
                  </AccountNavLink>
                </li>
                <li className="text-neutral-400 hover:text-neutral-950">
                  <button
                    type="button"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "text-neutral-400 hover:text-neutral-950 flex items-center gap-x-2 transition-colors duration-200",
        {
          "text-neutral-950 font-medium": active,
        }
      )}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
