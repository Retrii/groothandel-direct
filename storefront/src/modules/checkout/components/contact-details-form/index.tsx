import Input from "@/modules/common/components/input"
import { B2BCart, B2BCustomer } from "@/types"
import React, { useEffect, useMemo, useState } from "react"

const ContactDetailsForm = ({
  customer,
  cart,
}: {
  customer: B2BCustomer | null
  cart: B2BCart | null
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    email: "",
    phone: "",
    invoice_recipient: "",
    cost_center: "",
    requisition_number: "",
    door_code: "",
    notes: "",
  })

  const countriesInRegion = useMemo(
    () => cart?.region?.countries?.map((c) => c.iso_2),
    [cart?.region]
  )

  useEffect(() => {
    if (cart && cart.email) {
      setFormData((prevState) => ({
        ...prevState,
        email: cart.email || "",
        phone: cart.metadata?.phone?.toString() || customer?.phone || "",
        invoice_recipient: cart.metadata?.invoice_recipient?.toString() || "",
        cost_center: cart.metadata?.cost_center?.toString() || "",
        requisition_number: cart.metadata?.requisition_number?.toString() || "",
        door_code: cart.metadata?.door_code?.toString() || "",
        notes: cart.metadata?.notes?.toString() || "",
      }))
    }
  }, [cart, customer])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="E-mailadres"
          name="email"
          type="email"
          autoComplete="email"
          value={formData["email"]}
          onChange={handleChange}
          required
          data-testid="email-input"
        />
        <Input
          label="Telefoonnummer (optioneel)"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={formData["phone"]}
          onChange={handleChange}
          data-testid="phone-input"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Factuur ontvanger"
          name="invoice_recipient"
          autoComplete="name"
          value={formData["invoice_recipient"]}
          onChange={handleChange}
          data-testid="invoice-recipient-input"
        />
        <Input
          label="Kostenplaats"
          name="cost_center"
          value={formData["cost_center"]}
          onChange={handleChange}
          data-testid="cost-center-input"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Bestelnummer"
          name="requisition_number"
          value={formData["requisition_number"]}
          onChange={handleChange}
          data-testid="requisition-number-input"
        />
        <Input
          label="Deurcode/goederenmarkering"
          name="door_code"
          value={formData["door_code"]}
          onChange={handleChange}
          data-testid="door-code-input"
        />
      </div>

      <div>
        <Input
          label="Opmerkingen"
          name="notes"
          value={formData["notes"]}
          onChange={handleChange}
          data-testid="notes-input"
        />
        <p className="text-xs text-gray-500 mt-1">
          Deze opmerking verschijnt alleen op de factuur en orderbevestiging.
        </p>
      </div>
    </div>
  )
}

export default ContactDetailsForm
