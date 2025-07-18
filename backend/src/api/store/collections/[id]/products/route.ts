import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { id } = req.params;

  const { limit = 50, offset = 0 } = req.query;

  try {
    // First get all products
    const { data: allProducts } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "handle",
        "thumbnail",
        "description",
        "collection_id",
        "variants",
        "variants.prices",
      ],
    });

    // Filter products that belong to this collection
    const products = allProducts.filter(
      (product: any) => product.collection_id === id
    );

    // Apply pagination manually
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedProducts = products.slice(startIndex, endIndex);

    res.json({
      products: paginatedProducts,
      count: products.length,
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
    });
  } catch (error) {
    console.error("Error fetching collection products:", error);
    res.status(500).json({
      code: "collection_products_error",
      message: "Failed to fetch products for collection",
    });
  }
};
