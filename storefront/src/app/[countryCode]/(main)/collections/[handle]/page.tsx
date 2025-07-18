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
  const { collections } = await listCollections({
    offset: "0",
    limit: "100",
  })

  if (!collections) {
    return []
  }

  const countryCodes = await listRegions().then(
    (regions: StoreRegion[]) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )

  const collectionHandles = collections.map(
    (collection: StoreCollection) => collection.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string) =>
      collectionHandles.map((handle: string | undefined) => ({
        countryCode,
        handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  const productCount = collection.products?.length || 0

  const metadata = {
    title: `${collection.title} - Professionele Producten | Groothandel Direct`,
    description:
      (collection.metadata?.description as string) ||
      `Ontdek onze ${collection.title?.toLowerCase()} collectie met ${productCount} professionele producten. Scherpe groothandelsprijzen en snelle levering.`,
    keywords: `${collection.title?.toLowerCase()}, professionele producten, groothandel, B2B producten, zakelijke inkoop`,
    openGraph: {
      title: `${collection.title} - Professionele Producten | Groothandel Direct`,
      description:
        (collection.metadata?.description as string) ||
        `${collection.title} collectie met ${productCount} professionele producten voor uw bedrijf.`,
      type: "website",
      images: [
        {
          url: `/og-collection-${collection.handle}.jpg`,
          width: 1200,
          height: 630,
          alt: `${collection.title} - Groothandel Direct`,
        },
      ],
    },
  } as Metadata

  return metadata
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  // Redirect to brand page if this collection is marked as a brand
  if (collection.metadata?.is_brand === true) {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.href = '/brands/${collection.handle}';`,
        }}
      />
    )
  }

  // Parse current filters from search params
  const currentFilters = searchParams
    ? parseFiltersFromSearchParams(new URLSearchParams(searchParams))
    : undefined

  // Fetch all products for filter options (all products in this collection)
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
      searchParams={new URLSearchParams(searchParams)}
      products={filterProducts}
      filteredProducts={filteredProducts}
    />
  )
}
