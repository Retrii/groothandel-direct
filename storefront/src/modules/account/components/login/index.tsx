import { login } from "@/lib/data/customer"
import { LOGIN_VIEW } from "@/modules/account/templates/login-template"
import ErrorMessage from "@/modules/checkout/components/error-message"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import Input from "@/modules/common/components/input"
import { Checkbox, Text } from "@medusajs/ui"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div className="w-full" data-testid="login-page">
      <form className="space-y-6" action={formAction}>
        <div className="space-y-4">
          <Input
            label="E-mailadres"
            name="email"
            type="email"
            title="Voer een geldig e-mailadres in."
            autoComplete="email"
            required
            data-testid="email-input"
            className="w-full"
          />
          <Input
            label="Wachtwoord"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
            className="w-full"
          />
        </div>

        <div className="flex items-center">
          <Checkbox
            name="remember_me"
            data-testid="remember-me-checkbox"
            id="remember-me"
          />
          <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
            Onthoud mij
          </label>
        </div>

        <ErrorMessage error={message} data-testid="login-error-message" />

        <div className="space-y-3">
          <SubmitButton
            data-testid="sign-in-button"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 rounded-lg"
          >
            Inloggen
          </SubmitButton>

          <div className="text-center">
            <Text className="text-sm text-gray-600">
              Nog geen account?{" "}
              <button
                type="button"
                onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
                className="font-medium text-green-600 hover:text-green-500"
                data-testid="register-button"
              >
                Registreren
              </button>
            </Text>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login
