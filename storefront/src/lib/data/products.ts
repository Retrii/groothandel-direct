"use server"

import { sdk } from "@/lib/config"
import { getAuthHeaders, getCacheOptions } from "@/lib/data/cookies"
import { getRegion } from "@/lib/data/regions"
import { filterProducts, ProductFilters } from "@/lib/util/filter-products"
import { sortProducts } from "@/lib/util/sort-products"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"

export const getProductsById = async ({
  ids,
  regionId,
}: {
  ids: string[]
  regionId: string
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      credentials: "include",
      method: "GET",
      query: {
        id: ids,
        region_id: regionId,
        fields:
          "*variants,*variants.calculated_price,*variants.inventory_quantity",
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ products }) => products)
}

export const getProductByHandle = async (handle: string, regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      credentials: "include",
      method: "GET",
      query: {
        handle,
        region_id: regionId,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,*categories,*categories.parent_category,*categories.parent_category.parent_category,*collection",
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ products }) => products[0])
}

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams &
    HttpTypes.StoreProductParams & { category_id?: string[] }
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = (_pageParam - 1) * limit
  const region = await getRegion(countryCode)

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  // Handle category_id to include subcategories
  let finalQueryParams = { ...queryParams }

  if (
    queryParams?.category_id &&
    Array.isArray(queryParams.category_id) &&
    queryParams.category_id.length === 1
  ) {
    // Single category ID - check if we need to include subcategories
    const categoryId = queryParams.category_id[0]

    // Get all categories to find subcategories
    const { listCategories } = await import("./categories")
    const allCategories = await listCategories()

    // Find the current category
    const currentCategory = allCategories.find((cat) => cat.id === categoryId)

    if (currentCategory) {
      // Get all subcategory IDs including the current category
      const allCategoryIds = getAllSubcategoryIds(
        currentCategory,
        allCategories
      )
      finalQueryParams = {
        ...finalQueryParams,
        category_id: allCategoryIds,
      }
    }
  }

  const query = {
    limit,
    offset,
    region_id: region.id,
    fields:
      finalQueryParams.fields ||
      "*variants.calculated_price,*variants.inventory_quantity,*tags,*categories,*collection,*options",
    ...Object.fromEntries(
      Object.entries(finalQueryParams).filter(([key]) => key !== "fields")
    ),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        credentials: "include",
        method: "GET",
        query,
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
  filters,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
  filters?: ProductFilters
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 1000, // Get more products for filtering
      fields:
        "*variants.calculated_price,*variants.inventory_quantity,*tags,*categories,*collection",
    },
    countryCode,
  })

  // Apply filters if provided
  let filteredProducts = filters ? filterProducts(products, filters) : products

  // Then sort
  const sortedProducts = sortProducts(filteredProducts, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage =
    sortedProducts.length > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count: sortedProducts.length, // Return filtered count
    },
    nextPage,
    queryParams,
  }
}

/**
 * Get all subcategory IDs recursively
 */
const getAllSubcategoryIds = (category: any, categories: any[]): string[] => {
  const subcategoryIds: string[] = []

  // Add current category's ID
  subcategoryIds.push(category.id)

  // Recursively add all subcategory IDs
  if (category.category_children && category.category_children.length > 0) {
    category.category_children.forEach((child: any) => {
      const childCategory = categories.find((cat) => cat.id === child.id)
      if (childCategory) {
        subcategoryIds.push(...getAllSubcategoryIds(childCategory, categories))
      }
    })
  }

  return subcategoryIds
}

/**
 * Fetch all products for a specific collection/category for initial filter options
 * This gets ALL products in the collection/category, not filtered by current URL params
 */
export const getAllProductsForFilterOptions = async ({
  collectionId,
  categoryId,
  countryCode,
}: {
  collectionId?: string
  categoryId?: string
  countryCode: string
}): Promise<HttpTypes.StoreProduct[]> => {
  const queryParams: any = {
    limit: 1000,
    fields:
      "*variants.calculated_price,*variants.inventory_quantity,*variants.options,*tags,*categories,*collection,*options",
  }

  // Add collection filter if provided
  if (collectionId) {
    queryParams.collection_id = [collectionId]
  }

  // Add category filter if provided
  if (categoryId) {
    // First, get all categories to find subcategories
    const { listCategories } = await import("./categories")
    const allCategories = await listCategories()

    // Find the current category
    const currentCategory = allCategories.find((cat) => cat.id === categoryId)

    if (currentCategory) {
      // Get all subcategory IDs including the current category
      const allCategoryIds = getAllSubcategoryIds(
        currentCategory,
        allCategories
      )
      queryParams.category_id = allCategoryIds
    } else {
      // Fallback to just the current category if not found
      queryParams.category_id = [categoryId]
    }
  }

  const {
    response: { products },
  } = await listProducts({
    pageParam: 0,
    queryParams,
    countryCode,
  })

  return products
}

/**
 * Fetch filtered products for accurate count calculation
 * This gets the products that match the current URL filters
 */
export const getFilteredProductsForCounts = async ({
  collectionId,
  categoryId,
  countryCode,
  filters,
}: {
  collectionId?: string
  categoryId?: string
  countryCode: string
  filters?: ProductFilters
}): Promise<HttpTypes.StoreProduct[]> => {
  const queryParams: any = {
    limit: 1000,
    fields:
      "*variants.calculated_price,*variants.inventory_quantity,*variants.options,*tags,*categories,*collection,*options",
  }

  // Add collection filter if provided
  if (collectionId) {
    queryParams.collection_id = [collectionId]
  }

  // Add category filter if provided
  if (categoryId) {
    // First, get all categories to find subcategories
    const { listCategories } = await import("./categories")
    const allCategories = await listCategories()

    // Find the current category
    const currentCategory = allCategories.find((cat) => cat.id === categoryId)

    if (currentCategory) {
      // Get all subcategory IDs including the current category
      const allCategoryIds = getAllSubcategoryIds(
        currentCategory,
        allCategories
      )
      queryParams.category_id = allCategoryIds
    } else {
      // Fallback to just the current category if not found
      queryParams.category_id = [categoryId]
    }
  }

  const {
    response: { products },
  } = await listProducts({
    pageParam: 0,
    queryParams,
    countryCode,
  })

  // Apply filters if provided
  const filteredProducts = filters
    ? filterProducts(products, filters)
    : products

  return filteredProducts
}
