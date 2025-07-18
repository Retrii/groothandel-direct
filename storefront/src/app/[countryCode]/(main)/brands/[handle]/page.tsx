import { getCollectionByHandle, listCollections } from "@/lib/data/collections"
import {
  getAllProductsForFilterOptions,
  getFilteredProductsForCounts,
} from "@/lib/data/products"
import { listRegions } from "@/lib/data/regions"
import { parseFiltersFromSearchParams } from "@/lib/util/filter-products"
import CollectionTemplate from "@/modules/collections/templates"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const dynamicParams = true

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export const PRODUCT_LIMIT = 12

export async function generateStaticParams() {
  const { collections } = await listCollections()

  // Only generate static params for brand collections
  const brandCollections = collections.filter(
    (collection: StoreCollection) => collection.metadata?.is_brand === true
  )

  if (!brandCollections?.length) {
    return []
  }

  const countryCodes = await listRegions().then((regions) =>
    regions
      ?.map((r: StoreRegion) => r.countries?.map((c) => c.iso_2))
      .flat()
      .filter(Boolean)
  )

  if (!countryCodes) {
    return []
  }

  const staticParams = countryCodes
    ?.map((countryCode) =>
      brandCollections?.map((collection) => ({
        countryCode,
        handle: collection.handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection || collection.metadata?.is_brand !== true) {
    notFound()
  }

  return {
    title: `${collection.title} producten | Groothandel Direct`,
    description: `Bekijk alle ${collection.title} producten in onze groothandel. Professionele schoonmaakmiddelen en meer.`,
  }
}

export default async function BrandPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  // Ensure this is actually a brand collection
  if (collection.metadata?.is_brand !== true) {
    notFound()
  }

  // Parse current filters from search params
  const currentFilters = searchParams
    ? parseFiltersFromSearchParams(new URLSearchParams(searchParams))
    : undefined

  // Fetch all products for filter options (all products in this brand)
  const filterProducts = await getAllProductsForFilterOptions({
    countryCode: params.countryCode,
    collectionId: collection.id,
  })

  // Fetch filtered products for accurate counts
  const filteredProducts = await getFilteredProductsForCounts({
    countryCode: params.countryCode,
    collectionId: collection.id,
    filters: currentFilters,
  })

  return (
    <CollectionTemplate
      collection={collection}
      page={page}
      sortBy={sortBy}
      countryCode={params.countryCode}
      products={filterProducts}
      filteredProducts={filteredProducts}
    />
  )
}
