import { clx, Button as MedusaButton } from "@medusajs/ui"

type ButtonProps = React.ComponentProps<typeof MedusaButton>

const Button = ({
  children,
  className: classNameProp,
  ...props
}: ButtonProps): React.ReactNode => {
  const variant = props.variant ?? "primary"

  const className = clx(classNameProp, {
    "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 hover:shadow-sm":
      variant === "secondary" || props.disabled,
    "bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white hover:shadow-lg":
      variant === "primary" && !props.disabled,
    "bg-transparent text-neutral-900 hover:bg-gray-50":
      variant === "transparent",
  })

  return (
    <MedusaButton
      className={`text-sm font-medium transition-all duration-200 rounded-lg ${className}`}
      variant={variant}
      style={{
        border: "none",
      }}
      {...props}
    >
      {children}
    </MedusaButton>
  )
}

export default Button
