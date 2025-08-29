import LocalizedClientLink from "@/modules/common/components/localized-client-link"
// Icons will be replaced with emojis

const Help = () => {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-3">
        Hulp nodig?
      </h3>

      <div className="space-y-2 mb-3">
        <LocalizedClientLink
          href="/contact"
          className="block text-sm text-blue-600 hover:text-blue-800"
        >
          Contact opnemen
        </LocalizedClientLink>

        <LocalizedClientLink
          href="/contact"
          className="block text-sm text-blue-600 hover:text-blue-800"
        >
          Retour & Omruil
        </LocalizedClientLink>
      </div>

      <div className="pt-3 border-t border-gray-200">
        <div className="space-y-1 text-xs text-gray-600">
          <div>Tel: +31 20 123 4567</div>
          <div>Email: help@groothandel.nl</div>
        </div>
      </div>
    </div>
  )
}

export default Help
