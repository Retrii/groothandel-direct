import { updateCollectionsWorkflow } from "@medusajs/core-flows";
import { ExecArgs } from "@medusajs/framework/types";

export default async function updateCollectionsMetadata({
  container,
}: ExecArgs) {
  const query = container.resolve("query");

  // Get existing collections
  const { data: collections } = await query.graph({
    entity: "product_collections",
    fields: ["id", "handle", "title"],
  });

  console.log(
    "Found collections:",
    collections.map((c) => c.handle)
  );

  // Define metadata for collections
  const collectionMetadata = {
    featured: {
      description: "Onze uitgelichte producten van top kwaliteit",
      logo: "https://placehold.co/200x200/22c55e/ffffff?text=Featured",
    },
    cleanpro: {
      description:
        "CleanPro is een toonaangevende fabrikant van professionele schoonmaakproducten. Al meer dan 30 jaar leveren wij hoogwaardige oplossingen voor de professionele schoonmaaksector.",
      logo: "https://placehold.co/200x200/0ea5e9/ffffff?text=CleanPro",
    },
    hygienemax: {
      description:
        "HygieneMax staat voor maximale hygiëne in elke omgeving. Onze producten voldoen aan de hoogste normen en zijn ideaal voor zorginstellingen, horeca en industrie.",
      logo: "https://placehold.co/200x200/8b5cf6/ffffff?text=HygieneMax",
    },
    ecoclean: {
      description:
        "EcoClean biedt duurzame schoonmaakoplossingen zonder concessies aan kwaliteit. Al onze producten zijn biologisch afbreekbaar en veilig voor mens en milieu.",
      logo: "https://placehold.co/200x200/10b981/ffffff?text=EcoClean",
    },
  };

  // Update collections with metadata
  for (const collection of collections) {
    const metadata = collectionMetadata[collection.handle];
    if (metadata) {
      await updateCollectionsWorkflow(container).run({
        input: {
          selector: { id: collection.id },
          update: {
            metadata: metadata,
          },
        },
      });
      console.log(`Updated collection ${collection.handle} with metadata`);
    }
  }

  console.log("Collection metadata update completed!");
}
