import { updateProductsWorkflow } from "@medusajs/core-flows";
import { ExecArgs } from "@medusajs/framework/types";

export default async function addProductToCollection({ container }: ExecArgs) {
  const query = container.resolve("query");

  // Get a product and collection
  const { data: products } = await query.graph({
    entity: "products",
    fields: ["id", "title", "collection_id"],
    pagination: {
      take: 1,
    },
  });

  const { data: collections } = await query.graph({
    entity: "product_collections",
    fields: ["id", "handle", "title"],
    filters: {
      handle: "featured",
    },
  });

  if (products.length > 0 && collections.length > 0) {
    const product = products[0];
    const collection = collections[0];

    console.log(
      `Adding product "${product.title}" to collection "${collection.title}"`
    );

    await updateProductsWorkflow(container).run({
      input: {
        selector: { id: product.id },
        update: {
          collection_id: collection.id,
          metadata: {
            usage_instructions:
              "Gebruik volgens de instructies op de verpakking.",
            dosage: "Doseer volgens aanwijzing",
            storage: "Bewaar op een koele, droge plaats",
            safety_information:
              "Buiten bereik van kinderen houden. Bij contact met ogen direct spoelen met water.",
            certificates: "ISO 9001, CE Keurmerk",
            material: "Hoogwaardige materialen",
          },
        },
      },
    });

    console.log("Product updated successfully!");
  } else {
    console.log(
      "No products without collection found or featured collection not found"
    );
  }
}
