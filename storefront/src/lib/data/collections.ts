"use server"

import { sdk } from "@/lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const retrieveCollection = async (id: string) => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        next,
        cache: "force-cache",
      }
    )
    .then(({ collection }) => collection)
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  queryParams.limit = queryParams.limit || "100"
  queryParams.offset = queryParams.offset || "0"

  // Always include metadata in the response
  if (!queryParams.fields) {
    queryParams.fields = "*,metadata,products"
  }

  return sdk.client
    .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
      "/store/collections",
      {
        query: queryParams,
        next,
        cache: "no-cache",
      }
    )
    .then(({ collections, count }) => ({
      collections,
      count: count || collections.length,
    }))
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
      query: {
        handle,
        fields: "*,metadata,products",
      },
      next,
      cache: "no-cache",
    })
    .then(({ collections }) => collections[0])
}

export const getCollectionProducts = async (
  collectionId: string,
  queryParams: Record<string, string> = {}
): Promise<{ products: HttpTypes.StoreProduct[]; count: number }> => {
  const next = {
    ...(await getCacheOptions("products")),
  }

  queryParams.limit = queryParams.limit || "50"
  queryParams.offset = queryParams.offset || "0"

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/collections/${collectionId}/products`,
      {
        query: queryParams,
        next,
        cache: "no-cache",
      }
    )
    .then((response) => response)
}
