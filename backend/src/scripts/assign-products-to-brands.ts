import { ExecArgs, IProductModuleService } from "@medusajs/framework/types";
import { ModuleRegistrationName } from "@medusajs/framework/utils";

export default async function assignProductsToBrands({ container }: ExecArgs) {
  const productModuleService: IProductModuleService = container.resolve(
    ModuleRegistrationName.PRODUCT
  );

  console.log("Assigning products to brand collections...");

  // Get all products and collections
  const products = await productModuleService.listProducts(
    {},
    { relations: ["variants"] }
  );
  const collections = await productModuleService.listProductCollections({});

  // Filter brand collections
  const brandCollections = collections.filter(
    (c) => c.metadata?.is_brand === true
  );

  console.log(
    `Found ${products.length} products and ${brandCollections.length} brand collections`
  );

  // Assign each product to a random brand collection
  for (const product of products) {
    const randomBrand =
      brandCollections[Math.floor(Math.random() * brandCollections.length)];

    try {
      // Update product with new collection_id
      await productModuleService.updateProducts(product.id, {
        collection_id: randomBrand.id,
      });

      console.log(
        `Assigned product "${product.title}" to brand: ${randomBrand.title}`
      );
    } catch (error) {
      console.error(`Error assigning product ${product.title}:`, error);
    }
  }

  console.log("✅ Successfully assigned all products to brand collections!");
}
