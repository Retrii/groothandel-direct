import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    limit = 100,
    offset = 0,
    fields = "*,metadata,products",
    handle,
    id,
    ...otherFilters
  } = req.query;

  // Handle fields parameter properly
  const fieldsList =
    typeof fields === "string"
      ? fields.split(",")
      : Array.isArray(fields)
      ? fields.map((f) => String(f))
      : ["*", "metadata", "products"];

  // Build filters object
  const filters: any = {};

  if (handle) {
    filters.handle = handle;
  }

  if (id) {
    filters.id = id;
  }

  // Add any other filters from query params
  Object.keys(otherFilters).forEach((key) => {
    if (otherFilters[key] !== undefined) {
      filters[key] = otherFilters[key];
    }
  });

  try {
    const { data: collections, metadata } = await query.graph({
      entity: "product_collection",
      fields: fieldsList,
      filters,
      pagination: {
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      },
    });

    // If we have collections, fetch their products separately to show correct count
    if (collections && Array.isArray(collections) && collections.length > 0) {
      for (const collection of collections) {
        // Add null/undefined checking
        if (collection && collection.id) {
          try {
            // Count products for this collection
            const { data: allProducts } = await query.graph({
              entity: "product",
              fields: ["id", "collection_id"],
            });

            if (allProducts && Array.isArray(allProducts)) {
              const products = allProducts.filter(
                (p: any) => p && p.collection_id === collection.id
              );
              // Add products to collection for count
              (collection as any).products = products || [];
            } else {
              (collection as any).products = [];
            }
          } catch (productError) {
            console.warn(
              `Failed to fetch products for collection ${collection.id}:`,
              productError
            );
            (collection as any).products = [];
          }
        } else {
          // Handle case where collection is null/undefined
          console.warn("Found null or undefined collection in results");
        }
      }
    }

    res.json({
      collections: collections || [],
      count: metadata?.count || (collections ? collections.length : 0),
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({
      code: "collections_error",
      message: "Failed to fetch collections",
      collections: [], // Provide empty array as fallback
      count: 0,
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
    });
  }
};
