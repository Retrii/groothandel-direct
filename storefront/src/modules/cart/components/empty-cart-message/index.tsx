import InteractiveLink from "@/modules/common/components/interactive-link"
import { Heading, Text } from "@medusajs/ui"

const EmptyCartMessage = () => {
  return (
    <div
      className="py-48 px-2 flex flex-col justify-center items-start"
      data-testid="empty-cart-message"
    >
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        Winkelwagen
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        Uw winkelwagen is leeg. Laten we daar verandering in brengen! Gebruik de
        onderstaande link om onze producten te bekijken.
      </Text>
      <div>
        <InteractiveLink href="/store">Bekijk producten</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
