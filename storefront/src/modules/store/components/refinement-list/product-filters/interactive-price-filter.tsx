"use client"

import * as Slider from "@radix-ui/react-slider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface InteractivePriceFilterProps {
  minPrice: number
  maxPrice: number
  currency: string
}

const InteractivePriceFilter = ({
  minPrice,
  maxPrice,
  currency,
}: InteractivePriceFilterProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // State for price range
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ])

  // Get active filters from URL
  const activePriceMin = searchParams.get("price_min")
  const activePriceMax = searchParams.get("price_max")

  useEffect(() => {
    // Initialize price range from URL or defaults
    if (activePriceMin || activePriceMax) {
      setLocalPriceRange([
        activePriceMin ? parseInt(activePriceMin) : minPrice,
        activePriceMax ? parseInt(activePriceMax) : maxPrice,
      ])
    } else {
      setLocalPriceRange([minPrice, maxPrice])
    }
  }, [activePriceMin, activePriceMax, minPrice, maxPrice])

  const handlePriceChange = (newRange: [number, number]) => {
    const params = new URLSearchParams(searchParams)

    // Set price_min if it's different from the minimum
    if (newRange[0] > minPrice) {
      params.set("price_min", newRange[0].toString())
    } else {
      params.delete("price_min")
    }

    // Set price_max if it's different from the maximum
    if (newRange[1] < maxPrice) {
      params.set("price_max", newRange[1].toString())
    } else {
      params.delete("price_max")
    }

    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilter = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("price_min")
    params.delete("price_max")
    // Reset to full range
    setLocalPriceRange([minPrice, maxPrice])
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const isPriceFiltered = activePriceMin || activePriceMax

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Prijs</h3>
        {isPriceFiltered && (
          <button
            onClick={clearFilter}
            className="text-sm text-green-600 hover:text-sky-400 font-medium transition-colors duration-200"
          >
            Wissen
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Price Input Fields */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Min prijs
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                €
              </span>
              <input
                type="number"
                min={minPrice}
                max={localPriceRange[1]}
                value={localPriceRange[0]}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || minPrice
                  const clampedValue = Math.max(
                    minPrice,
                    Math.min(value, localPriceRange[1])
                  )
                  setLocalPriceRange([clampedValue, localPriceRange[1]])
                }}
                onBlur={() => handlePriceChange(localPriceRange)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                placeholder={minPrice.toString()}
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Max prijs
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                €
              </span>
              <input
                type="number"
                min={localPriceRange[0]}
                max={maxPrice}
                value={localPriceRange[1]}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || maxPrice
                  const clampedValue = Math.max(
                    localPriceRange[0],
                    Math.min(value, maxPrice)
                  )
                  setLocalPriceRange([localPriceRange[0], clampedValue])
                }}
                onBlur={() => handlePriceChange(localPriceRange)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                placeholder={maxPrice.toString()}
              />
            </div>
          </div>
        </div>

        {/* Radix UI Range Slider */}
        <div className="px-1 pt-2 pb-3">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={localPriceRange}
            onValueChange={(value: number[]) => {
              setLocalPriceRange([value[0], value[1]])
            }}
            onValueCommit={(value: number[]) => {
              handlePriceChange([value[0], value[1]])
            }}
            max={maxPrice}
            min={minPrice}
            step={1}
            minStepsBetweenThumbs={1}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-sky-400/80 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-green-500 border-2 border-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg"
              aria-label="Minimum prijs"
            />
            <Slider.Thumb
              className="block w-5 h-5 bg-green-500 border-2 border-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg"
              aria-label="Maximum prijs"
            />
          </Slider.Root>
        </div>
      </div>
    </div>
  )
}

export default InteractivePriceFilter
