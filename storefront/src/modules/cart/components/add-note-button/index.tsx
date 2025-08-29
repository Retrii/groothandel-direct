import { updateLineItem } from "@/lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Input, clx } from "@medusajs/ui"
import { useEffect, useRef, useState } from "react"

const AddNoteButton = ({
  item,
  disabled,
}: {
  item: HttpTypes.StoreCartLineItem
  disabled?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [note, setNote] = useState((item.metadata?.note as string) || "")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const setNoteMetadata = async (newNote: string) => {
    setIsOpen(false)
    await updateLineItem({
      lineId: item.id,
      data: { quantity: item.quantity, metadata: { note: newNote?.trim() } },
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setNoteMetadata(note)
    }
  }

  const handleBlur = () => {
    setNoteMetadata(note)
    setIsOpen(false)
  }

  const deleteNote = () => {
    setNote("")
    setNoteMetadata("")
    setIsOpen(false)
  }

  return (
    <div className="w-full">
      {!note && !isOpen && (
        <button
          className={clx(
            "w-full text-left text-xs text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 transition-all duration-200 flex items-center gap-2",
            disabled ? "opacity-50 pointer-events-none" : "opacity-100"
          )}
          onClick={() => setIsOpen(true)}
          disabled={disabled}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Notitie toevoegen
        </button>
      )}

      {note?.length > 0 && !isOpen && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <svg
                  className="w-3 h-3 text-sky-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="text-xs font-medium text-sky-700">
                  Notitie
                </span>
              </div>
              <p
                className="text-xs text-sky-600 cursor-pointer hover:text-sky-700 break-words"
                onClick={() => setIsOpen(true)}
              >
                {note}
              </p>
            </div>
            <button
              className="text-sky-500 hover:text-sky-700 p-1 hover:bg-sky-100 rounded transition-colors flex-shrink-0"
              onClick={deleteNote}
              title="Notitie verwijderen"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-3 h-3 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="text-xs font-medium text-gray-700">
              Notitie bewerken
            </span>
          </div>
          <Input
            ref={inputRef}
            className="w-full text-xs bg-white border-gray-300 rounded-lg"
            type="text"
            placeholder="Voeg een notitie toe..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
            onBlur={() => handleBlur()}
          />
        </div>
      )}
    </div>
  )
}

export default AddNoteButton
