"use client"

import { useCart } from "@/lib/context/cart-context"
import Spinner from "@/modules/common/icons/spinner"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className = "",
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const { handleDeleteItem } = useCart()

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    await handleDeleteItem(id)
    setIsDeleting(false)
  }

  return (
    <button
      className={`text-red-600 hover:text-red-700 transition-colors ${className}`}
      onClick={() => handleDelete(id)}
      disabled={isDeleting}
    >
      {isDeleting ? <Spinner size={12} /> : children || "Verwijderen"}
    </button>
  )
}

export default DeleteButton
