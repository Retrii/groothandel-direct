import { getCategoryByHandle, listCategories } from "@/lib/data/categories"
import {
  getAllProductsForFilterOptions,
  getFilteredProductsForCounts,
} from "@/lib/data/products"
import { listRegions } from "@/lib/data/regions"
import { parseFiltersFromSearchParams } from "@/lib/util/filter-products"
import CategoryTemplate from "@/modules/categories/templates"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const dynamicParams = true

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

// SEO data per category - zou later van API komen
const getCategorySEOData = (
  categoryName: string,
  categoryHandle: string,
  productCount: number = 0
) => {
  const seoData: Record<string, any> = {
    kantoorbenodigdheden: {
      title: `${categoryName} - Professionele Kantoorartikelen | Groothandel Direct`,
      description: `Compleet assortiment ${categoryName.toLowerCase()} voor uw bedrijf. Van bureauartikelen tot kantoorinrichting. ${productCount} producten, scherpe groothandelsprijzen en snelle levering.`,
      keywords:
        "kantoorbenodigdheden, bureauartikelen, kantoorinrichting, schrijfwaren, mappen, ordners, groothandel kantoor",
    },
    "technische-producten": {
      title: `${categoryName} - Professionele Tools & Apparatuur | Groothandel Direct`,
      description: `Hoogwaardige ${categoryName.toLowerCase()} voor professionals. Van elektrisch gereedschap tot meet- en testapparatuur. ${productCount} producten tegen groothandelsprijzen.`,
      keywords:
        "technische producten, gereedschap, meetapparatuur, tools, professioneel gereedschap, elektrisch gereedschap",
    },
    "sanitaire-artikelen": {
      title: `${categoryName} - Professionele Hygiëne & Schoonmaak | Groothandel Direct`,
      description: `Professionele ${categoryName.toLowerCase()} voor bedrijven. Schoonmaakmiddelen, hygiëneproducten en sanitaire benodigdheden. ${productCount} artikelen op voorraad.`,
      keywords:
        "sanitaire artikelen, schoonmaakmiddelen, hygiëneproducten, toiletartikelen, professionele reiniging",
    },
    verpakkingen: {
      title: `${categoryName} - Professionele Verpakkingsmaterialen | Groothandel Direct`,
      description: `Complete range ${categoryName.toLowerCase()} voor uw bedrijf. Dozen, tassen, beschermende verpakkingen en verzendmaterialen. ${productCount} producten beschikbaar.`,
      keywords:
        "verpakkingen, verzendmateriaal, dozen, zakken, beschermende verpakking, verpakkingsmaterialen",
    },
    default: {
      title: `${categoryName} - Professionele Producten | Groothandel Direct`,
      description: `Ontdek ons uitgebreide assortiment ${categoryName.toLowerCase()} voor professionals. ${productCount} kwaliteitsproducten tegen scherpe groothandelsprijzen. Voor 15:00 besteld, zelfde dag verzonden.`,
      keywords: `${categoryName.toLowerCase()}, professionele producten, groothandel, B2B producten, zakelijke inkoop`,
    },
  }

  return (
    seoData[categoryHandle] || {
      ...seoData.default,
      title: `${categoryName} - Professionele Producten | Groothandel Direct`,
    }
  )
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  try {
    const product_category = await getCategoryByHandle(params.category)
    const productCount = product_category.products?.length || 0
    const seoData = getCategorySEOData(
      product_category.name,
      product_category.handle,
      productCount
    )

    const categoryPath = params.category.join("/")

    return {
      title: seoData.title,
      description: product_category.description || seoData.description,
      keywords: seoData.keywords,
      openGraph: {
        title: seoData.title,
        description: product_category.description || seoData.description,
        type: "website",
        url: `https://groothandeldirect.nl/categories/${categoryPath}`,
        images: [
          {
            url: `/og-category-${product_category.handle}.jpg`,
            width: 1200,
            height: 630,
            alt: `${product_category.name} - Groothandel Direct`,
          },
        ],
        siteName: "Groothandel Direct",
      },
      twitter: {
        card: "summary_large_image",
        title: seoData.title,
        description: product_category.description || seoData.description,
      },
      alternates: {
        canonical: `https://groothandeldirect.nl/categories/${categoryPath}`,
      },
      other: {
        "product:count": productCount.toString(),
        "product:category": product_category.name,
        "business:contact_data:country_name": "Netherlands",
        "business:contact_data:locality": "Nederland",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    }
  } catch (error) {
    notFound()
  }
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then(
    (regions) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )

  if (!countryCodes) {
    return null
  }

  const categories = await listCategories()

  return countryCodes
    .map((countryCode) =>
      categories.map((category) => ({
        countryCode,
        category: category.handle.split("/"),
      }))
    )
    .flat()
}

export default async function CategoryPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  const categories = await listCategories()
  const category = await getCategoryByHandle(params.category).then(
    (category) => category
  )

  if (!category) {
    notFound()
  }

  // Parse current filters from search params
  const currentFilters = searchParams
    ? parseFiltersFromSearchParams(new URLSearchParams(searchParams))
    : undefined

  // Fetch all products for filter options (all products in this category + subcategories)
  const filterProducts = await getAllProductsForFilterOptions({
    countryCode: params.countryCode,
    categoryId: category.id,
  })

  // Fetch filtered products for accurate counts
  const filteredProducts = await getFilteredProductsForCounts({
    countryCode: params.countryCode,
    categoryId: category.id,
    filters: currentFilters,
  })

  return (
    <CategoryTemplate
      categories={categories}
      currentCategory={category}
      page={page}
      sortBy={sortBy}
      countryCode={params.countryCode}
      searchParams={new URLSearchParams(searchParams)}
      products={filterProducts}
      filteredProducts={filteredProducts}
    />
  )
}
