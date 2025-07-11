import { Eye } from "@medusajs/icons"
import { Label } from "@medusajs/ui"
import React, { useEffect, useImperativeHandle, useRef, useState } from "react"

import { clx } from "@medusajs/ui"

export interface InputProps
  extends Omit<
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    "placeholder"
  > {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
  colSpan?: number
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      name,
      label,
      touched,
      required,
      topLabel,
      colSpan = 1,
      className,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    return (
      <div className={clx("w-full", `col-span-${colSpan}`)}>
        {topLabel && (
          <Label className="mb-2 txt-compact-medium-plus">{topLabel}</Label>
        )}
        <div className="flex relative z-0 w-full txt-compact-medium">
          <input
            type={inputType}
            name={name}
            placeholder=" "
            required={required}
            className={clx(
              "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-gray-50 appearance-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all duration-200 rounded-lg",
              className
            )}
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={name}
            onClick={() => inputRef.current?.focus()}
            className="flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 top-2 -z-1 origin-0 text-neutral-400"
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-ui-fg-subtle px-4 focus:outline-none transition-all duration-150 outline-none focus:text-ui-fg-base absolute right-0 top-2"
            >
              {showPassword ? <Eye /> : <Eye />}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
