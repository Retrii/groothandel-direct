import { ExecArgs, IProductModuleService } from "@medusajs/framework/types";
import { ModuleRegistrationName } from "@medusajs/framework/utils";

export default async function checkBrandCollections({ container }: ExecArgs) {
  const productModuleService: IProductModuleService = container.resolve(
    ModuleRegistrationName.PRODUCT
  );

  console.log("Checking all collections and their metadata...");

  // Get all collections
  const collections = await productModuleService.listProductCollections({});

  console.log(`\nFound ${collections.length} collections total:`);
  console.log("=".repeat(50));

  for (const collection of collections) {
    console.log(`\nCollection: ${collection.title}`);
    console.log(`Handle: ${collection.handle}`);
    console.log(`ID: ${collection.id}`);
    console.log(`Metadata:`, JSON.stringify(collection.metadata, null, 2));
    console.log(
      `Is Brand: ${collection.metadata?.is_brand === true ? "YES" : "NO"}`
    );

    // Get products in this collection
    const products = await productModuleService.listProducts({
      collection_id: [collection.id],
    });
    console.log(`Products: ${products.length}`);

    if (products.length > 0) {
      console.log(`Product titles: ${products.map((p) => p.title).join(", ")}`);
    }

    console.log("-".repeat(40));
  }

  // Summary
  const brandCollections = collections.filter(
    (c) => c.metadata?.is_brand === true
  );
  console.log(`\n✅ Summary:`);
  console.log(`Total collections: ${collections.length}`);
  console.log(`Brand collections: ${brandCollections.length}`);
  console.log(
    `Brand collection handles: ${brandCollections
      .map((c) => c.handle)
      .join(", ")}`
  );
}
