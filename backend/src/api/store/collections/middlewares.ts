import { MiddlewareRoute } from "@medusajs/medusa";

export const storeCollectionsMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/collections",
    middlewares: [],
  },
  {
    method: ["GET"],
    matcher: "/store/collections/:id/products",
    middlewares: [],
  },
];
