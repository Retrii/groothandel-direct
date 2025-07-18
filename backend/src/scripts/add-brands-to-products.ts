import { ExecArgs, IProductModuleService } from "@medusajs/framework/types";
import { ModuleRegistrationName } from "@medusajs/framework/utils";

export default async function addBrandsToProducts({ container }: ExecArgs) {
  const productModuleService: IProductModuleService = container.resolve(
    ModuleRegistrationName.PRODUCT
  );

  console.log("Adding brand information to products...");

  // Define some sample brands for cleaning products
  const brands = [
    {
      name: "CleanPro",
      description:
        "Professionele schoonmaakmiddelen voor de industrie. CleanPro staat bekend om hun krachtige en effectieve formules.",
    },
    {
      name: "HygieneMax",
      description:
        "Premium hygiëne oplossingen voor commerciële toepassingen. HygieneMax biedt veilige en milieuvriendelijke producten.",
    },
    {
      name: "EcoClean",
      description:
        "Duurzame schoonmaakmiddelen met minimale impact op het milieu. EcoClean combineert effectiviteit met ecologische verantwoordelijkheid.",
    },
    {
      name: "IndustrialSupply",
      description:
        "Complete oplossingen voor industriële reiniging en onderhoud. Betrouwbare kwaliteit voor professioneel gebruik.",
    },
    {
      name: "SafetyFirst",
      description:
        "Veilige schoonmaakmiddelen die voldoen aan de hoogste veiligheidsnormen. Perfect voor gebruik in gevoelige omgevingen.",
    },
  ];

  // Get all products
  const products = await productModuleService.listProducts(
    {},
    { relations: ["variants"] }
  );

  console.log(`Found ${products.length} products to update`);

  // Assign brands to products randomly
  for (const product of products) {
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];

    const updatedMetadata = {
      ...product.metadata,
      brand: randomBrand.name,
      brand_description: randomBrand.description,
    };

    await productModuleService.updateProducts(product.id, {
      metadata: updatedMetadata,
    });

    console.log(
      `Updated product "${product.title}" with brand: ${randomBrand.name}`
    );
  }

  console.log("✅ Successfully added brand information to all products!");
}
