import { ExecArgs, IProductModuleService } from "@medusajs/framework/types";
import { ModuleRegistrationName } from "@medusajs/framework/utils";

export default async function markCollectionsAsBrands({ container }: ExecArgs) {
  const productModuleService: IProductModuleService = container.resolve(
    ModuleRegistrationName.PRODUCT
  );

  console.log("Marking certain collections as brands...");

  // Get all collections
  const collections = await productModuleService.listProductCollections({});

  console.log(`Found ${collections.length} collections`);

  // Define which collections should be brands (you can adjust this)
  const brandCollectionNames = [
    "CleanPro",
    "HygieneMax",
    "EcoClean",
    "IndustrialSupply",
    "SafetyFirst",
  ];

  // Mark existing collections as brands if they match our brand names
  for (const collection of collections) {
    const isBrand = brandCollectionNames.includes(collection.title);

    const updatedMetadata = {
      ...collection.metadata,
      is_brand: isBrand,
      // Add descriptions for brands
      ...(isBrand && {
        description: getBrandDescription(collection.title),
      }),
    };

    await productModuleService.updateProductCollections(collection.id, {
      metadata: updatedMetadata,
    });

    console.log(
      `Updated collection "${collection.title}" - is_brand: ${isBrand}`
    );
  }

  // Create new brand collections if they don't exist
  for (const brandName of brandCollectionNames) {
    const existingCollection = collections.find((c) => c.title === brandName);

    if (!existingCollection) {
      await productModuleService.createProductCollections({
        title: brandName,
        handle: brandName.toLowerCase().replace(/\s+/g, "-"),
        metadata: {
          is_brand: true,
          description: getBrandDescription(brandName),
          logo: `https://via.placeholder.com/200x100/0ea5e9/ffffff?text=${encodeURIComponent(
            brandName
          )}`,
        },
      });

      console.log(`Created new brand collection: ${brandName}`);
    }
  }

  console.log("✅ Successfully marked collections as brands!");
}

function getBrandDescription(brandName: string): string {
  const descriptions: Record<string, string> = {
    CleanPro:
      "Professionele schoonmaakmiddelen voor de industrie. CleanPro staat bekend om hun krachtige en effectieve formules.",
    HygieneMax:
      "Premium hygiëne oplossingen voor commerciële toepassingen. HygieneMax biedt veilige en milieuvriendelijke producten.",
    EcoClean:
      "Duurzame schoonmaakmiddelen met minimale impact op het milieu. EcoClean combineert effectiviteit met ecologische verantwoordelijkheid.",
    IndustrialSupply:
      "Complete oplossingen voor industriële reiniging en onderhoud. Betrouwbare kwaliteit voor professioneel gebruik.",
    SafetyFirst:
      "Veilige schoonmaakmiddelen die voldoen aan de hoogste veiligheidsnormen. Perfect voor gebruik in gevoelige omgevingen.",
  };

  return descriptions[brandName] || `Hoogwaardige producten van ${brandName}.`;
}
